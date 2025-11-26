from fastapi import APIRouter, Depends, status, Response, Cookie
from sqlalchemy.orm import Session
import logging
from ...schemas.auth import UserCreate, UserOut
from ...services.auth_service import authenticate_user, register_user
from ...core.security import create_access_token, create_refresh_token, decode_token
from ...api.deps.auth_deps import get_db
from ...models.user import User

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post('/register', response_model=UserOut)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    user = register_user(db, user_in.email, user_in.password)
    return user


@router.post('/login', response_model=UserOut)
def login(user_in: UserCreate, response: Response, db: Session = Depends(get_db)):
    user = authenticate_user(db, user_in.email, user_in.password)
    if not user:
        return Response(status_code=status.HTTP_401_UNAUTHORIZED)
    access_token = create_access_token({"sub": str(user.id)})
    refresh_token = create_refresh_token({"sub": str(user.id)})
    response.set_cookie(key="access_token", value=access_token, httponly=True, secure=False, max_age=1800, samesite="lax")
    response.set_cookie(key="refresh_token", value=refresh_token, httponly=True, secure=False, max_age=604800, samesite="lax")
    return user


@router.post('/refresh')
def refresh_token(response: Response, refresh_token: str = Cookie(None), db: Session = Depends(get_db)):
    logger.info("/auth/refresh called")
    if refresh_token is None:
        logger.info("refresh token missing")
        return Response(status_code=status.HTTP_401_UNAUTHORIZED)
    payload = decode_token(refresh_token)
    if payload is None:
        logger.info("refresh token invalid or expired")
        return Response(status_code=status.HTTP_401_UNAUTHORIZED)
    user_id = payload.get('sub')
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        logger.info("refresh token references missing user: %s", user_id)
        return Response(status_code=status.HTTP_401_UNAUTHORIZED)
    if not user.is_active:
        logger.info("refresh token references inactive user: %s", user_id)
        return Response(status_code=status.HTTP_401_UNAUTHORIZED)
    access_token = create_access_token({"sub": str(user_id)})
    response.set_cookie(key="access_token", value=access_token, httponly=True, secure=False, max_age=1800, samesite="lax")
    logger.info("refresh succeeded for user %s", user_id)
    return {"msg": "Token refreshed"}


@router.post('/logout')
def logout(response: Response):
    response.delete_cookie(key="access_token")
    response.delete_cookie(key="refresh_token")
    return {"msg": "Logged out"}
