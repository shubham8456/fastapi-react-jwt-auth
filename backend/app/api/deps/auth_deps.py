from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from typing import Generator
from ...db.session import SessionLocal
from ...models.user import User
from ...core.security import decode_token


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


def get_db() -> Generator:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(request: Request, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)) -> User:
    # Prefer token from httpOnly cookie (set by login/refresh). Fall back to Authorization header.
    cookie_token = request.cookies.get('access_token')
    token_to_use = cookie_token or token
    if not token_to_use:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    payload = decode_token(token_to_use)
    if payload is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication credentials")

    user = db.query(User).filter(User.id == payload.get('sub')).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User inactive")

    return user
