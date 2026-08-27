# Authenticated Service Request Application

A full-stack application featuring a **ReactJS (Vite)** frontend and a **Spring Boot** REST backend secured with **Spring Security** and **JWT (JSON Web Tokens)**, backed by **Supabase (PostgreSQL)**.

---

## 🛠️ Technology Stack
- **Frontend**: ReactJS (Vite, React Router DOM)
- **Backend**: Spring Boot, Spring Security, Spring Data JPA, JJWT (io.jsonwebtoken)
- **Database**: PostgreSQL (Supabase)
- **Authentication**: JWT Bearer Tokens & BCrypt password hashing

---

## 🚀 Features
1. **User Authentication**:
   - User Registration with BCrypt password hashing.
   - User Login with JWT token generation and claims.
   - Token-based session management and secure logout in React.
2. **Service Request Management (CRUD)**:
   - Create Service Requests with title, category, description, and automatic timestamping.
   - View only service requests belonging to the authenticated user.
   - Edit own service requests with pre-filled modal form.
   - Delete own service requests with confirmation modal.
3. **Strict Backend Ownership & Security**:
   - Every request is mapped to the user extracted directly from the JWT.
   - Any attempt to view, modify, or delete another user's request is rejected with `403 Forbidden`.
   - Client routes guarded by `ProtectedRoute`.

---

## 📁 Repository Structure
```
activity1/
├── backend/                  # Spring Boot REST API
│   ├── src/main/java/edu/cit/valendez/activity1/
│   │   ├── controller/      # REST Controllers (UserController, ServiceRequestController)
│   │   ├── dto/             # Request & Response DTOs
│   │   ├── security/        # JwtUtil, JwtAuthenticationFilter, SecurityConfig, CustomUserDetailsService
│   │   ├── service/         # ServiceRequestService with ownership rules
│   │   ├── ServiceRequest.java
│   │   ├── ServiceRequestRepository.java
│   │   ├── User.java
│   │   ├── UserRepository.java
│   │   └── Activity1Application.java
│   ├── src/test/            # Unit & Integration Tests
│   └── pom.xml
├── frontend/                 # ReactJS + Vite Web Application
│   ├── src/
│   │   ├── api/             # API client & Auth helpers (auth.js, requests.js, users.js)
│   │   ├── components/      # ProtectedRoute, ServiceRequestModal
│   │   ├── pages/           # LoginPage, RegistrationPage, DashboardPage
│   │   ├── App.jsx
│   │   ├── styles.css
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── API.md
└── README.md
```

---

## 🏃 Running the Application

### 1. Backend (Spring Boot)

Make sure you have your Supabase environment variables configured:
```powershell
$env:SUPABASE_DB_URL="jdbc:postgresql://<your-supabase-host>:5432/<db_name>"
$env:SUPABASE_DB_USERNAME="postgres"
$env:SUPABASE_DB_PASSWORD="<your_password>"
```

Then run the backend:
```powershell
cd backend
.\mvnw.cmd spring-boot:run
```
The server will start on `http://localhost:8080`.

To run automated backend tests:
```powershell
cd backend
.\mvnw.cmd test
```

### 2. Frontend (ReactJS)

In a separate terminal:
```powershell
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🔒 Implemented API Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/register` | Public | Register a new user account |
| `POST` | `/api/login` | Public | Authenticate user and return signed JWT |
| `GET` | `/api/requests` | Authenticated | Retrieve all service requests for authenticated user |
| `POST` | `/api/requests` | Authenticated | Create a new service request owned by JWT user |
| `GET` | `/api/requests/{id}` | Authenticated | Retrieve specific service request (enforces ownership) |
| `PUT` | `/api/requests/{id}` | Authenticated | Update service request (enforces ownership) |
| `DELETE` | `/api/requests/{id}` | Authenticated | Delete service request (enforces ownership) |

---

## 🧪 Testing Multi-User Ownership
1. Open the application and register two accounts:
   - Account 1: `userA`
   - Account 2: `userB`
2. Log in as `userA` and create Request #1 ("Fix Network Switch", Category: "Network").
3. Verify Request #1 appears on `userA`'s dashboard.
4. Log out and log in as `userB`.
5. Verify `userB`'s dashboard has **no** service requests.
6. If `userB` tries to access `GET /api/requests/1` or `PUT /api/requests/1` directly via API, the backend responds with **`403 Forbidden`**.
