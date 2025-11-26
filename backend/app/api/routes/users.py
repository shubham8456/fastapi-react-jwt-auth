from fastapi import APIRouter, Depends, Request, HTTPException, status
from sqlalchemy.orm import Session
import logging
import time
from ...models.user import User
from ...schemas.user import UserRead
from ...api.deps.auth_deps import get_db, get_current_user

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/users", tags=["users"])

# Simple in-memory rate limiter per client IP to protect against flooding during debugging.
_last_access: dict[str, float] = {}
_MIN_INTERVAL = 0.25  # seconds


@router.get('/me', response_model=UserRead)
def read_users_me(request: Request, current_user: User = Depends(get_current_user)):
    # Rate-limit repeated requests from the same client IP
    client_host = request.client.host if request.client else 'unknown'
    now = time.time()
    last = _last_access.get(client_host)
    if last and (now - last) < _MIN_INTERVAL:
        logger.info("Throttling /users/me from %s (interval %.3fs)", client_host, now - last)
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Too many requests")
    _last_access[client_host] = now

    # Log request headers for debugging repeated 401s
    try:
        headers = {k: v for k, v in request.headers.items()}
    except Exception:
        headers = {}
    logger.info("/users/me called from %s - headers: %s", client_host, headers)
    return current_user
