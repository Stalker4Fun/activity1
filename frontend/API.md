# API Data Contract

The React client uses JSON requests to the existing Spring Boot API. During development, Vite proxies `/api` to `http://localhost:8080`.

## Register a user

| Field | Value |
| --- | --- |
| HTTP method and URL | `POST /api/register` (development target: `http://localhost:8080/api/register`) |
| Purpose | Create a user when the username is not already registered. |
| Request headers | `Content-Type: application/json`; `Accept: application/json, text/plain` |
| Request body | JSON object: `username` (`string`), `password` (`string`) |
| Success | `200 OK`, JSON representation of the saved `User` |
| Error | `400 Bad Request`, plain text: `Username already exists` |

Request:

```json
{
  "username": "jane.doe",
  "password": "ExamplePassword123"
}
```

Successful response (`200 OK`):

```json
{
  "id": 1,
  "username": "jane.doe",
  "password": "ExamplePassword123"
}
```

The current backend returns the saved entity, including its password field. The React app deliberately ignores that response data and does not display or persist the password. In a production system, the backend should hash passwords and omit them from response objects.

## Log in a user

| Field | Value |
| --- | --- |
| HTTP method and URL | `POST /api/login` (development target: `http://localhost:8080/api/login`) |
| Purpose | Verify a username/password combination. |
| Request headers | `Content-Type: application/json`; `Accept: application/json, text/plain` |
| Request body | JSON object: `username` (`string`), `password` (`string`) |
| Success | `200 OK`, JSON object containing `message` (`string`) |
| Error | `401 Unauthorized`, JSON object containing `message` (`string`) |

Request:

```json
{
  "username": "jane.doe",
  "password": "ExamplePassword123"
}
```

Successful response (`200 OK`):

```json
{
  "message": "Login successful"
}
```

Error response (`401 Unauthorized`):

```json
{
  "message": "Invalid username or password"
}
```

## Client validation

Before either request, the React client rejects blank usernames and passwords. Registration also requires a matching confirmation password. These validations avoid unnecessary API calls; backend responses still handle duplicate usernames and invalid logins.
