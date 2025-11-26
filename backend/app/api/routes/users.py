from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ...models.user import User
from ...schemas.user import UserRead
from ...api.deps.auth_deps import get_db, get_current_user

router = APIRouter(prefix="/users", tags=["users"])


@router.get('/me', response_model=UserRead)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user
