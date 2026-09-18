from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jwt import PyJWKClient, decode, PyJWKClientError
from typing import Dict, Optional
import logging
import os

logger = logging.getLogger(__name__)

# Clerk Configuration
CLERK_ISSUER = os.getenv("CLERK_ISSUER", "https://dear-lamb-34.clerk.accounts.dev")
CLERK_JWKS_URL = f"{CLERK_ISSUER}/.well-known/jwks.json"

security = HTTPBearer()


class ClerkAuthMiddleware:
    """
    Middleware for verifying Clerk JWT tokens.
    """

    def __init__(self):
        self.jwks_client = PyJWKClient(CLERK_JWKS_URL)

    def verify_token(self, token: str) -> Dict:
        """
        Verify and decode a Clerk JWT token.

        Args:
            token: JWT token string

        Returns:
            Dict containing the decoded token payload

        Raises:
            HTTPException: If token is invalid or verification fails
        """
        try:
            # Get the signing key from Clerk's JWKS
            signing_key = self.jwks_client.get_signing_key_from_jwt(token)

            # Decode and verify the token
            payload = decode(
                token,
                signing_key.key,
                algorithms=["RS256"],
                issuer=CLERK_ISSUER,
                options={
                    "verify_signature": True,
                    "verify_exp": True,
                    "verify_iat": True,
                    "verify_aud": False,  # Clerk doesn't use aud claim by default
                }
            )

            logger.info(f"Token verified successfully for user: {payload.get('sub')}")
            return payload

        except PyJWKClientError as e:
            logger.error(f"JWKS error: {str(e)}")
            raise HTTPException(
                status_code=401,
                detail="Invalid authentication token (JWKS error)"
            )
        except Exception as e:
            logger.error(f"Token verification failed: {str(e)}")
            raise HTTPException(
                status_code=401,
                detail=f"Invalid authentication token: {str(e)}"
            )


# Create a global instance
clerk_auth = ClerkAuthMiddleware()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Security(security)
) -> Dict:
    """
    FastAPI dependency to get the current authenticated user.

    Args:
        credentials: HTTP Bearer token from the request

    Returns:
        Dict containing the decoded user information

    Raises:
        HTTPException: If authentication fails
    """
    if not credentials:
        raise HTTPException(
            status_code=401,
            detail="Authorization header required"
        )

    token = credentials.credentials
    user = clerk_auth.verify_token(token)

    return user


async def get_current_user_id(user: Dict = Security(get_current_user)) -> str:
    """
    FastAPI dependency to get the current user's ID.

    Args:
        user: The current authenticated user (from get_current_user)

    Returns:
        str: User ID from the token

    Raises:
        HTTPException: If user ID is not found
    """
    user_id = user.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="User ID not found in token"
        )

    return user_id
