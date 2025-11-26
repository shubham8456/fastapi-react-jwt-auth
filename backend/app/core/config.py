from typing import Optional
from pydantic_settings import BaseSettings
import os

cookie_secure = os.getenv('COOKIE_SECURE', 'false').lower() == 'true'
secret_key = os.getenv('JWT_SECRET_KEY')
if not secret_key:
    raise RuntimeError("Missing JWT_SECRET_KEY environment variable")

class Settings(BaseSettings):
    SECRET_KEY: str = secret_key
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    JWT_ALGORITHM: str = "HS256"
    COOKIE_SECURE: bool = cookie_secure
    COOKIE_SAMESITE: str = "lax"
    COOKIE_DOMAIN: Optional[str] = None

Settings.model_rebuild()
settings = Settings()
