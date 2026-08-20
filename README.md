# Activity 1

This repository contains two separate applications:

- `backend/` — Spring Boot REST API and database configuration
- `frontend/` — React + Vite user registration, login, and dashboard application

## Run the backend

```powershell
cd backend
./mvnw.cmd spring-boot:run
```

Set `SUPABASE_DB_URL` in the terminal before starting it when using Supabase.

## Run the frontend

```powershell
cd frontend
npm install
npm run dev
```

The frontend development server proxies API requests to the backend at `http://localhost:8080`.
