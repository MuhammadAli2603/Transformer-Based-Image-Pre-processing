# Authentication Middleware

This directory contains the Clerk JWT authentication middleware for the FastAPI backend.

## Files

- `auth.py` - Main authentication logic and dependencies
- `__init__.py` - Module exports

## Usage

### Protecting Endpoints

```python
from fastapi import Depends
from middleware.auth import get_current_user_id

@app.post("/my-endpoint")
async def my_endpoint(
    user_id: str = Depends(get_current_user_id)
):
    # user_id is automatically extracted from verified JWT
    # If token is invalid, a 401 error is raised automatically
    print(f"Request from user: {user_id}")
    # ... your logic here
```

### Getting Full User Info

```python
from middleware.auth import get_current_user

@app.post("/my-endpoint")
async def my_endpoint(
    user: Dict = Depends(get_current_user)
):
    user_id = user.get("sub")
    email = user.get("email")  # if available in token
    # ... your logic here
```

## How It Works

1. **Request arrives** with `Authorization: Bearer {jwt-token}` header
2. **HTTPBearer** security extracts the token
3. **ClerkAuthMiddleware.verify_token()** is called:
   - Fetches Clerk's public keys from JWKS endpoint
   - Verifies token signature using RS256 algorithm
   - Validates token claims (issuer, expiration, etc.)
   - Returns decoded token payload
4. **get_current_user_id()** extracts the user ID from payload
5. **Endpoint executes** with authenticated user context

## Token Payload Structure

A typical Clerk JWT contains:

```json
{
  "sub": "user_2abc123xyz",           // User ID
  "iss": "https://your.clerk.accounts.dev",  // Issuer
  "iat": 1234567890,                  // Issued at (timestamp)
  "exp": 1234571490,                  // Expires at (timestamp)
  "nbf": 1234567890,                  // Not before (timestamp)
  "azp": "https://yourapp.com",       // Authorized party
  // ... other claims
}
```

## Error Responses

### 401 Unauthorized - "Authorization header required"
- Token not provided in request
- Fix: Include `Authorization: Bearer {token}` header

### 401 Unauthorized - "Invalid authentication token (JWKS error)"
- Cannot fetch Clerk's public keys
- Fix: Check CLERK_ISSUER is correct and accessible

### 401 Unauthorized - "Invalid authentication token: {error}"
- Token signature invalid
- Token expired
- Token from wrong issuer
- Fix: Ensure token is fresh and from correct Clerk instance

## Configuration

Required environment variable in `backend/.env`:

```env
CLERK_ISSUER=https://your-clerk-instance.clerk.accounts.dev
```

Get this from Clerk Dashboard → Configure → API Keys → "Issuer"

## Testing

### Test with curl

```bash
# Get a token from Clerk (e.g., from browser DevTools)
TOKEN="eyJhbGc..."

# Make authenticated request
curl -X POST http://localhost:8000/classify-quality \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@test-image.jpg"
```

### Test in Python

```python
import requests

# Get token from your frontend or Clerk API
token = "eyJhbGc..."

headers = {
    "Authorization": f"Bearer {token}"
}

files = {
    "file": open("test-image.jpg", "rb")
}

response = requests.post(
    "http://localhost:8000/classify-quality",
    headers=headers,
    files=files
)

print(response.json())
```

## Security Considerations

✅ **Token Signature Verification**: Uses RS256 asymmetric encryption
✅ **Expiration Validation**: Tokens expire automatically (default: 1 hour)
✅ **Issuer Validation**: Only accepts tokens from configured Clerk instance
✅ **No Token Storage**: Backend only verifies, doesn't store tokens
✅ **Stateless**: Each request independently verified

## Logging

The middleware logs authentication events:

```python
INFO: Token verified successfully for user: user_abc123
INFO: User user_abc123 processing image: photo.jpg
ERROR: Token verification failed: Token is expired
ERROR: JWKS error: Unable to fetch public keys
```

## Dependencies

- `PyJWT[crypto]>=2.8.0` - JWT encoding/decoding with cryptography
- `cryptography>=41.0.0` - Cryptographic operations
- `httpx>=0.25.0` - HTTP client for JWKS fetching (via PyJWT)

## Extending

### Add Custom Claims Validation

```python
def verify_token(self, token: str) -> Dict:
    payload = decode(...)

    # Add custom validation
    if payload.get("custom_claim") != "expected_value":
        raise HTTPException(
            status_code=403,
            detail="Custom claim validation failed"
        )

    return payload
```

### Add Rate Limiting

```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@app.post("/classify-quality")
@limiter.limit("10/minute")
async def classify_quality(
    user_id: str = Depends(get_current_user_id)
):
    # ... endpoint logic
```

## Troubleshooting

### JWKS Caching Issues

The `PyJWKClient` caches public keys. If Clerk rotates keys and you get errors:

```python
# Force refresh by creating new client
clerk_auth.jwks_client = PyJWKClient(CLERK_JWKS_URL)
```

### Testing with Mock Tokens

For unit tests, you can mock the dependency:

```python
def mock_get_current_user_id():
    return "test_user_123"

app.dependency_overrides[get_current_user_id] = mock_get_current_user_id
```

## References

- [Clerk JWT Templates](https://clerk.com/docs/backend-requests/handling/manual-jwt)
- [PyJWT Documentation](https://pyjwt.readthedocs.io/)
- [FastAPI Security](https://fastapi.tiangolo.com/tutorial/security/)
- [JWKS Specification](https://datatracker.ietf.org/doc/html/rfc7517)
