# API Data Contract

The React client communicates with the Spring Boot REST API using JSON payloads. During development, Vite proxies `/api` to `http://localhost:8080`.

---

## 1. Authentication Endpoints

### Register a User
- **Method & URL**: `POST /api/register`
- **Auth**: Public (No JWT required)
- **Request Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "username": "userA",
  "password": "PasswordA123"
}
```
- **Response `200 OK`**:
```json
{
  "id": 1,
  "username": "userA",
  "message": "Registration successful"
}
```
- **Response `400 Bad Request`**:
```json
{
  "message": "Username already exists"
}
```

---

### Log In a User
- **Method & URL**: `POST /api/login`
- **Auth**: Public (No JWT required)
- **Request Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "username": "userA",
  "password": "PasswordA123"
}
```
- **Response `200 OK`**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "username": "userA",
  "message": "Login successful"
}
```
- **Response `401 Unauthorized`**:
```json
{
  "message": "Invalid username or password"
}
```

---

## 2. Service Request Endpoints (Protected)

All service request endpoints require the HTTP header:
`Authorization: Bearer <jwt-token>`

The authenticated user is automatically determined from the JWT claims by Spring Security. No `userId` is passed in the request body or path to determine ownership.

---

### Create a Service Request
- **Method & URL**: `POST /api/requests`
- **Auth**: Authenticated (Bearer JWT required)
- **Request Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "title": "Network Connectivity Issue",
  "description": "Unable to connect to building 2 Wi-Fi network",
  "category": "Network"
}
```
- **Response `201 Created`**:
```json
{
  "id": 1,
  "title": "Network Connectivity Issue",
  "description": "Unable to connect to building 2 Wi-Fi network",
  "category": "Network",
  "dateCreated": "2026-08-27 18:45:00",
  "createdBy": "userA"
}
```

---

### Get All My Service Requests
- **Method & URL**: `GET /api/requests`
- **Auth**: Authenticated (Bearer JWT required)
- **Request Headers**:
  - `Authorization: Bearer <token>`
- **Response `200 OK`**:
```json
[
  {
    "id": 1,
    "title": "Network Connectivity Issue",
    "description": "Unable to connect to building 2 Wi-Fi network",
    "category": "Network",
    "dateCreated": "2026-08-27 18:45:00",
    "createdBy": "userA"
  }
]
```

---

### Get Service Request by ID
- **Method & URL**: `GET /api/requests/{id}`
- **Auth**: Authenticated (Bearer JWT required)
- **Request Headers**:
  - `Authorization: Bearer <token>`
- **Response `200 OK`** (if request belongs to authenticated user):
```json
{
  "id": 1,
  "title": "Network Connectivity Issue",
  "description": "Unable to connect to building 2 Wi-Fi network",
  "category": "Network",
  "dateCreated": "2026-08-27 18:45:00",
  "createdBy": "userA"
}
```
- **Response `403 Forbidden`** (if request belongs to another user):
```json
{
  "error": "Access denied: You do not own this service request"
}
```
- **Response `404 Not Found`** (if request does not exist).

---

### Update Service Request
- **Method & URL**: `PUT /api/requests/{id}`
- **Auth**: Authenticated (Bearer JWT required)
- **Request Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "title": "Network Connectivity Issue - Resolved",
  "description": "Configured static IP and network is now stable.",
  "category": "Network"
}
```
- **Response `200 OK`** (if request belongs to authenticated user):
```json
{
  "id": 1,
  "title": "Network Connectivity Issue - Resolved",
  "description": "Configured static IP and network is now stable.",
  "category": "Network",
  "dateCreated": "2026-08-27 18:45:00",
  "createdBy": "userA"
}
```
- **Response `403 Forbidden`** (if request belongs to another user):
```json
{
  "error": "Access denied: You do not own this service request"
}
```

---

### Delete Service Request
- **Method & URL**: `DELETE /api/requests/{id}`
- **Auth**: Authenticated (Bearer JWT required)
- **Request Headers**:
  - `Authorization: Bearer <token>`
- **Response `200 OK`** (if request belongs to authenticated user):
```json
{
  "message": "Service request deleted successfully"
}
```
- **Response `403 Forbidden`** (if request belongs to another user):
```json
{
  "error": "Access denied: You do not own this service request"
}
```
