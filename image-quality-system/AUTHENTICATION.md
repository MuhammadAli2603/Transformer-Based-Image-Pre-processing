# Authentication Setup Guide

This application uses **Clerk** for authentication. Both frontend and backend are fully integrated with Clerk's JWT-based authentication system.

## Overview

- **Frontend**: Clerk React SDK with Next.js
- **Backend**: JWT token verification using Clerk's JWKS (JSON Web Key Set)
- **Security**: All image classification endpoints are protected and require authentication

## Architecture

### Frontend Authentication Flow
```
1. User signs in via Clerk → Clerk issues JWT token
2. Token stored in browser by Clerk SDK
3. On API call → useAuth().getToken() retrieves token
4. Token sent in Authorization header: "Bearer {token}"
5. Backend verifies token and processes request
```

### Backend Authentication Flow
```
1. Receive request with Authorization header
2. Extract JWT token from "Bearer {token}"
3. Fetch Clerk's public keys from JWKS endpoint
4. Verify token signature using RS256 algorithm
5. Validate token claims (issuer, expiration, etc.)
6. Extract user ID from token's "sub" claim
7. Allow request to proceed with user context
```

## Configuration

### Frontend Environment Variables

Located in `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

### Backend Environment Variables

Located in `backend/.env`:

```env
# Clerk Authentication
CLERK_ISSUER=https://dear-lamb-34.clerk.accounts.dev
```

**Important**: The `CLERK_ISSUER` must match your Clerk instance URL. Find this in your Clerk Dashboard:
- Go to **Configure → API Keys**
- Look for "Issuer" or use format: `https://{your-clerk-subdomain}.clerk.accounts.dev`

## File Structure

### Frontend Files

```
frontend/
├── app/
│   ├── layout.tsx              # ClerkProvider wrapper
│   ├── sign-in/[[...sign-in]]/page.tsx
│   ├── sign-up/[[...sign-up]]/page.tsx
│   └── upload/page.tsx         # Uses useAuth() hook
├── components/
│   └── auth/
│       └── ProtectedRoute.tsx  # Route protection wrapper
└── lib/
    └── api.ts                  # API client with auth tokens
```

### Backend Files

```
backend/
├── middleware/
│   ├── __init__.py
│   └── auth.py                 # Clerk JWT verification
├── main.py                     # Protected endpoints
└── .env                        # Clerk configuration
```

## Protected Endpoints

All image classification endpoints now require authentication:

### POST /classify-quality
- **Auth Required**: Yes
- **Header**: `Authorization: Bearer {clerk-jwt-token}`
- **Response**: Includes `user_id` field

### POST /classify-batch
- **Auth Required**: Yes
- **Header**: `Authorization: Bearer {clerk-jwt-token}`
- **Response**: Includes `user_id` field

### GET /health
- **Auth Required**: No (public endpoint)

### GET /
- **Auth Required**: No (public endpoint)

## How It Works

### 1. Frontend: Getting User Token

```typescript
import { useAuth } from '@clerk/nextjs';

export default function UploadPage() {
  const { getToken } = useAuth();

  const handleUpload = async (files: File[]) => {
    // Get Clerk JWT token
    const token = await getToken();

    // Pass token to API
    const result = await imageQualityAPI.classifyImage(file, token);
  };
}
```

### 2. Frontend: API Client

```typescript
async classifyImage(file: File, authToken: string): Promise<QualityResult> {
  const formData = new FormData();
  formData.append('file', file);

  const headers = {
    'Authorization': `Bearer ${authToken}`,
  };

  const response = await axios.post(
    `${this.baseURL}/classify-quality`,
    formData,
    { headers }
  );

  return response.data;
}
```

### 3. Backend: Token Verification

```python
from middleware.auth import get_current_user_id

@app.post("/classify-quality")
async def classify_quality(
    file: UploadFile = File(...),
    user_id: str = Depends(get_current_user_id)  # ← Auth dependency
):
    # user_id is automatically extracted from verified JWT
    logger.info(f"User {user_id} processing image: {file.filename}")
    # ... process image
```

### 4. Backend: JWT Verification Process

The `ClerkAuthMiddleware` class handles verification:

```python
class ClerkAuthMiddleware:
    def verify_token(self, token: str) -> Dict:
        # 1. Fetch Clerk's public key from JWKS
        signing_key = self.jwks_client.get_signing_key_from_jwt(token)

        # 2. Verify signature and decode
        payload = decode(
            token,
            signing_key.key,
            algorithms=["RS256"],
            issuer=CLERK_ISSUER,
            options={
                "verify_signature": True,
                "verify_exp": True,      # Check expiration
                "verify_iat": True,      # Check issued-at
            }
        )

        # 3. Return decoded user info
        return payload  # Contains: sub (user_id), exp, iat, etc.
```

## Testing the Authentication

### 1. Start Backend
```bash
cd backend
venv\Scripts\activate       # Windows
python main.py
```

### 2. Start Frontend
```bash
cd frontend
npm run dev
```

### 3. Test Flow
1. Navigate to `http://localhost:3000`
2. Click "Sign In" or "Sign Up"
3. Complete Clerk authentication
4. Navigate to `/upload` or `/dashboard`
5. Upload images
6. Check backend logs - should show user ID

### 4. Verify Authentication
```bash
# Backend logs should show:
INFO: User user_abc123 processing image: test.jpg, size: 245123 bytes
INFO: Classification complete for user user_abc123: high (score: 0.823)
```

## Error Handling

### Common Authentication Errors

**401 Unauthorized - "Authorization header required"**
- Token not sent from frontend
- Check that `useAuth().getToken()` is called
- Verify token is passed to API client

**401 Unauthorized - "Invalid authentication token"**
- Token expired or malformed
- Check `CLERK_ISSUER` matches your Clerk instance
- Verify Clerk keys are correct

**401 Unauthorized - "JWKS error"**
- Cannot fetch Clerk's public keys
- Check internet connection
- Verify `CLERK_ISSUER` URL is accessible

## Security Features

✅ **JWT Signature Verification**: Uses RS256 asymmetric encryption
✅ **Token Expiration**: Automatic expiry validation
✅ **Issuer Validation**: Ensures token is from your Clerk instance
✅ **User Context**: Each request is tied to authenticated user
✅ **HTTPS Ready**: Secure token transmission in production

## Deployment Considerations

### Production Checklist

- [ ] Set `CLERK_ISSUER` to production Clerk instance
- [ ] Use production Clerk API keys
- [ ] Enable HTTPS for all API endpoints
- [ ] Configure CORS to allow only your frontend domain
- [ ] Set secure cookie settings in Clerk dashboard
- [ ] Monitor authentication logs for suspicious activity

### Environment Variables (Production)

**Frontend**:
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
```

**Backend**:
```env
CLERK_ISSUER=https://your-production.clerk.accounts.dev
ALLOWED_ORIGINS=https://yourdomain.com
```

## Troubleshooting

### Issue: "User not authenticated" on protected routes
**Solution**: Check that `ProtectedRoute` wrapper is used and Clerk session is valid

### Issue: Backend can't verify tokens
**Solution**:
1. Verify `CLERK_ISSUER` matches your Clerk instance
2. Check backend can access `{CLERK_ISSUER}/.well-known/jwks.json`
3. Ensure PyJWT and cryptography packages are installed

### Issue: CORS errors when calling API
**Solution**: Add frontend URL to backend's `ALLOWED_ORIGINS` in `.env`

## Additional Resources

- [Clerk Documentation](https://clerk.com/docs)
- [JWT.io Debugger](https://jwt.io) - Debug JWT tokens
- [Clerk Dashboard](https://dashboard.clerk.com) - Manage users & keys
- [FastAPI Security Docs](https://fastapi.tiangolo.com/tutorial/security/)

## Support

For authentication issues:
1. Check Clerk Dashboard for user session status
2. Inspect JWT token at [jwt.io](https://jwt.io)
3. Review backend logs for detailed error messages
4. Verify all environment variables are set correctly
