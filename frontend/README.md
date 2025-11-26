# Frontend (frontend)

This folder contains the React + Vite frontend for the `fastapi-react-jwt-auth` app.

Important files

- `src/api/httpClient.ts` — axios instance configured with `withCredentials` and refresh/401 handling.
- `src/auth/AuthContext.tsx` — provides auth state and probes `GET /users/me` on mount.
- `src/router/AppRouter.tsx` — app routes (`/login`, `/register`, `/`).

Environment

- Copy `frontend/.env.example` to `frontend/.env` (optional) and update values if your backend runs on a different host/port.
- Vite expects env variables starting with `VITE_`.

Dev & Run

```bash
cd frontend
npm install
npm run dev
```

Build

```bash
npm run build
```

Troubleshooting

- If cookies are not sent to the backend, ensure `VITE_BACKEND_URL` matches the backend and that `withCredentials` is enabled in `httpClient.ts`.
- If `document.cookie` is empty after login, the tokens are likely `HttpOnly` (expected). Use DevTools → Application → Cookies and Network → Response Headers to inspect `Set-Cookie`.
