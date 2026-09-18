# Authentication Setup Checklist

Use this checklist to ensure Clerk authentication is properly configured.

## Prerequisites

- [ ] Clerk account created at [clerk.com](https://clerk.com)
- [ ] New application created in Clerk Dashboard
- [ ] API keys copied from Clerk Dashboard

## Backend Setup

### 1. Environment Configuration

- [ ] File `backend/.env` exists
- [ ] `CLERK_ISSUER` is set to your Clerk instance URL
  ```env
  CLERK_ISSUER=https://your-instance.clerk.accounts.dev
  ```
- [ ] Verify issuer URL format (should start with `https://` and end with `.clerk.accounts.dev`)

### 2. Dependencies

- [ ] Run: `cd backend && venv\Scripts\activate` (Windows) or `source venv/bin/activate` (Mac/Linux)
- [ ] Install dependencies: `pip install -r requirements.txt`
- [ ] Verify PyJWT installed: `pip list | grep PyJWT`
- [ ] Verify python-dotenv installed: `pip list | grep python-dotenv`

### 3. File Structure

- [ ] File exists: `backend/middleware/__init__.py`
- [ ] File exists: `backend/middleware/auth.py`
- [ ] `main.py` imports authentication middleware

### 4. Test Backend

- [ ] Start backend: `python main.py`
- [ ] Backend starts without errors
- [ ] Visit `http://localhost:8000` - should return API info
- [ ] Visit `http://localhost:8000/docs` - should show Swagger UI with lock icons on protected endpoints

## Frontend Setup

### 1. Environment Configuration

- [ ] File `frontend/.env.local` exists
- [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is set (starts with `pk_test_` or `pk_live_`)
- [ ] `CLERK_SECRET_KEY` is set (starts with `sk_test_` or `sk_live_`)
- [ ] Clerk URLs are configured:
  ```env
  NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
  NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
  NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
  NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
  ```

### 2. Dependencies

- [ ] Run: `cd frontend`
- [ ] Install dependencies: `npm install`
- [ ] Verify Clerk package: `npm list @clerk/nextjs`

### 3. File Structure

- [ ] `app/layout.tsx` wraps app in `<ClerkProvider>`
- [ ] Sign-in page exists: `app/sign-in/[[...sign-in]]/page.tsx`
- [ ] Sign-up page exists: `app/sign-up/[[...sign-up]]/page.tsx`
- [ ] Protected route wrapper exists: `components/auth/ProtectedRoute.tsx`

### 4. Test Frontend

- [ ] Start frontend: `npm run dev`
- [ ] Frontend starts without errors
- [ ] Visit `http://localhost:3000`
- [ ] Landing page loads correctly
- [ ] Can navigate to `/sign-in` route
- [ ] Can navigate to `/sign-up` route

## Integration Testing

### 1. Authentication Flow

- [ ] Navigate to `http://localhost:3000`
- [ ] Click "Sign In" or "Sign Up"
- [ ] Clerk modal/page appears
- [ ] Can create a new account or sign in
- [ ] After sign-in, redirected to `/dashboard` or `/upload`
- [ ] User profile appears in navigation (if implemented)

### 2. Protected Routes

- [ ] While logged out, visiting `/upload` redirects to sign-in
- [ ] While logged out, visiting `/dashboard` redirects to sign-in
- [ ] After logging in, can access `/upload` route
- [ ] After logging in, can access `/dashboard` route

### 3. API Authentication

- [ ] Log in to the application
- [ ] Navigate to upload page
- [ ] Open browser DevTools → Network tab
- [ ] Upload an image
- [ ] Check the API request to `/classify-quality`
  - [ ] Request has `Authorization` header
  - [ ] Header value starts with `Bearer `
  - [ ] Request succeeds (status 200)
- [ ] Check backend console logs
  - [ ] Logs show user ID: `User user_xxx processing image`

### 4. Error Handling

- [ ] Try uploading without being logged in (should redirect to sign-in)
- [ ] Check that 401 errors show appropriate messages
- [ ] Verify expired tokens are handled (wait for token to expire or test manually)

## Verification Commands

### Check Backend JWT Configuration

```bash
cd backend
python -c "import os; from dotenv import load_dotenv; load_dotenv(); print(f'CLERK_ISSUER: {os.getenv(\"CLERK_ISSUER\")}')"
```

Expected output: `CLERK_ISSUER: https://your-instance.clerk.accounts.dev`

### Check Frontend Clerk Keys

```bash
cd frontend
cat .env.local | grep CLERK
```

Expected output:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### Test JWKS Endpoint Accessibility

```bash
curl https://your-instance.clerk.accounts.dev/.well-known/jwks.json
```

Expected: JSON response with public keys

## Common Issues

### ✅ Issue: Backend returns 401 "Invalid authentication token"

**Causes**:
- CLERK_ISSUER doesn't match your Clerk instance
- Token is from a different Clerk application
- Clerk keys are from test environment but token is from production (or vice versa)

**Solution**:
1. Verify `CLERK_ISSUER` in `backend/.env`
2. Check Clerk Dashboard → Configure → API Keys
3. Ensure frontend and backend use same Clerk instance

### ✅ Issue: "JWKS error" in backend logs

**Causes**:
- Backend can't reach Clerk's JWKS endpoint
- CLERK_ISSUER URL is incorrect
- Network/firewall blocking outbound HTTPS

**Solution**:
1. Test JWKS URL manually: `curl {CLERK_ISSUER}/.well-known/jwks.json`
2. Check CLERK_ISSUER format (must include `https://`)
3. Verify internet connection

### ✅ Issue: Frontend doesn't redirect after sign-in

**Causes**:
- Clerk redirect URLs misconfigured
- Protected route not using `ProtectedRoute` wrapper

**Solution**:
1. Check `.env.local` has correct redirect URLs
2. Verify `ProtectedRoute` wrapper is used in protected pages
3. Check Clerk Dashboard → Paths for redirect configuration

### ✅ Issue: No Authorization header in API requests

**Causes**:
- Not calling `useAuth().getToken()`
- Token not being passed to API client
- API client not adding header

**Solution**:
1. Verify `upload/page.tsx` uses `useAuth()` hook
2. Check token is passed to `imageQualityAPI.classifyImage(file, token)`
3. Verify `lib/api.ts` adds token to headers

## Success Indicators

✅ All checkboxes above are checked
✅ Can sign up and sign in successfully
✅ Protected routes require authentication
✅ API requests include Authorization header
✅ Backend logs show user IDs
✅ Image upload and analysis works end-to-end
✅ No console errors in browser or backend

## Next Steps

Once all checks pass:

1. [ ] Test with multiple users
2. [ ] Verify user data isolation (each user only sees their data)
3. [ ] Test sign-out functionality
4. [ ] Review security headers and CORS settings
5. [ ] Prepare for production deployment

## Production Readiness

Before deploying to production:

- [ ] Use production Clerk keys (`pk_live_...` and `sk_live_...`)
- [ ] Update `CLERK_ISSUER` to production instance
- [ ] Configure CORS to only allow production frontend domain
- [ ] Enable HTTPS on backend
- [ ] Set secure cookie settings in Clerk Dashboard
- [ ] Review Clerk Dashboard → Security settings
- [ ] Enable rate limiting on API
- [ ] Set up monitoring and logging

## Support Resources

- **Clerk Documentation**: https://clerk.com/docs
- **Clerk Dashboard**: https://dashboard.clerk.com
- **JWT Debugger**: https://jwt.io
- **Project Auth Guide**: See `AUTHENTICATION.md` in project root

## Notes

Date completed: _______________

Issues encountered:
_________________________________
_________________________________
_________________________________

Notes:
_________________________________
_________________________________
_________________________________
