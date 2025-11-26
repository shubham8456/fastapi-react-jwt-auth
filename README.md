# fastapi-react-jwt-auth

A minimal example application demonstrating JWT-based authentication using a FastAPI backend and a React + Vite frontend. Tokens are issued as HTTP-only cookies (access + refresh) and the frontend includes a minimal AuthProvider, axios http client with refresh logic, and protected routes.

See `frontend/README.md` and `backend/README.md` for per-app details.

Environment files:
- `frontend/.env.example` — sample frontend environment variables.
- `backend/.env.example` — sample backend environment variables.