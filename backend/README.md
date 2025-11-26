# Backend (backend)

FastAPI backend for `fastapi-react-jwt-auth` providing JWT authentication endpoints and a minimal user store.

Important files

- `app/main.py` — FastAPI app and CORS configuration.
- `app/api/routes/auth.py` — `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`.
- `app/api/routes/users.py` — `GET /users/me` (protected route).
- `app/core/config.py` — Pydantic settings for secret key, token lifetimes, and cookie flags.

Environment

- Copy `backend/.env.example` to `backend/.env` and update values for production (especially `SECRET_KEY`). The backend reads settings via Pydantic `BaseSettings` in `app/core/config.py`.

Dev & Run

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Notes

- Cookies are set as `HttpOnly` and `samesite='lax'` by default in development. For production use HTTPS and set `COOKIE_SECURE=true`.
- Ensure CORS allows credentials: `allow_credentials=True` in `app/main.py` and frontend `axios` must set `withCredentials=true`.
- For production, move secret and token expiry values to environment variables and enable stronger cookie flags.
