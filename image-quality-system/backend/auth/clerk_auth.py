"""
Clerk authentication middleware for FastAPI
Verifies JWT tokens from Clerk and extracts user information
"""

import os
import jwt
import httpx
from typing import Optional
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from functools import lru_cache

# Security scheme for Bearer token
security = HTTPBearer()

# Clerk configuration
CLERK_SECRET_KEY = os.getenv("CLERK_SECRET_KEY", "")
CLERK_JWKS_URL = "https://api.clerk.com/v1/jwks"


class ClerkUser:
    """Represents an authenticated Clerk user"""

    def __init__(self, user_id: str, email: Optional[str] = None, **kwargs):
        self.user_id = user_id
        self.email = email
        self.metadata = kwargs


@lru_cache(maxsize=1)
def get_jwks():
    """
    Fetch and cache Clerk's JWKS (JSON Web Key Set)
    Used to verify JWT signatures
    """
    try:
        response = httpx.get(CLERK_JWKS_URL, timeout=10.0)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Error fetching JWKS: {e}")
        return None


def verify_clerk_token(token: str) -> ClerkUser:
    """
    Verify a Clerk JWT token and extract user information

    Args:
        token: The JWT token from the Authorization header

    Returns:
        ClerkUser: The authenticated user's information

    Raises:
        HTTPException: If token is invalid or verification fails
    """
    if not CLERK_SECRET_KEY:
        raise HTTPException(
            status_code=500,
            detail="Clerk authentication not configured. Set CLERK_SECRET_KEY in environment."
        )

    try:
        # Get JWKS for signature verification
        jwks = get_jwks()
        if not jwks:
            raise HTTPException(
                status_code=500,
                detail="Unable to fetch Clerk JWKS for token verification"
            )

        # Decode and verify the token
        # Clerk tokens are signed with RS256 algorithm
        unverified_header = jwt.get_unverified_header(token)
        rsa_key = {}

        # Find the matching key from JWKS
        for key in jwks.get("keys", []):
            if key["kid"] == unverified_header["kid"]:
                rsa_key = {
                    "kty": key["kty"],
                    "kid": key["kid"],
                    "use": key["use"],
                    "n": key["n"],
                    "e": key["e"]
                }
                break

        if not rsa_key:
            raise HTTPException(
                status_code=401,
                detail="Unable to find appropriate key for token verification"
            )

        # Verify and decode the token
        payload = jwt.decode(
            token,
            jwt.algorithms.RSAAlgorithm.from_jwk(rsa_key),
            algorithms=["RS256"],
            options={"verify_signature": True, "verify_exp": True}
        )

        # Extract user information from the token
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=401,
                detail="Invalid token: missing user ID"
            )

        # Create and return ClerkUser instance
        return ClerkUser(
            user_id=user_id,
            email=payload.get("email"),
            **payload
        )

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=401,
            detail="Token has expired"
        )
    except jwt.JWTError as e:
        raise HTTPException(
            status_code=401,
            detail=f"Invalid token: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=401,
            detail=f"Authentication failed: {str(e)}"
        )


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Security(security)
) -> ClerkUser:
    """
    FastAPI dependency to get the current authenticated user

    Usage:
        @app.get("/protected")
        async def protected_route(user: ClerkUser = Depends(get_current_user)):
            return {"user_id": user.user_id, "email": user.email}
    """
    token = credentials.credentials
    return verify_clerk_token(token)


# Optional: Dependency for routes that don't require auth but can use it if available
async def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Security(security, auto_error=False)
) -> Optional[ClerkUser]:
    """
    FastAPI dependency for optional authentication
    Returns user if authenticated, None otherwise
    """
    if not credentials:
        return None

    try:
        return verify_clerk_token(credentials.credentials)
    except HTTPException:
        return None
