# Activity 1 ReactJS Frontend

A Vite + React application for the existing Spring Boot user API. It provides registration, login, client-side required-field validation, API success/error feedback, and a post-login dashboard.

## Run locally

1. Start the Spring Boot backend from the sibling `../backend` directory on `http://localhost:8080`.
2. In this `frontend` directory, run `npm install` once.
3. Run `npm run dev` and open the URL Vite prints (normally `http://localhost:5173`).

The Vite development server proxies `/api` to `http://localhost:8080`, so no frontend CORS configuration is needed during local development. For a separately deployed frontend, set `VITE_API_URL` to the backend API base URL, for example `https://example.edu/api`.

## Screenshots to include with submission

Capture these browser states while the backend is running:

- `/register` before submitting
- `/register` after a new username succeeds
- `/login` before submitting
- `/dashboard` after a successful login
- a required-field validation message or the invalid-login API error

## Security note

Password inputs use `type="password"`. Passwords exist only in component state until the request completes, are never rendered in messages, and are never saved in local storage, session storage, or cookies by this frontend.

See [API.md](./API.md) for the complete API contract.
