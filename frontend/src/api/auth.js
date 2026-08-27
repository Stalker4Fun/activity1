const TOKEN_KEY = 'activity1_jwt_token';
const USERNAME_KEY = 'activity1_username';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUsername() {
  return localStorage.getItem(USERNAME_KEY);
}

export function setAuth(token, username) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
  if (username) {
    localStorage.setItem(USERNAME_KEY, username);
  }
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USERNAME_KEY);
}

export function isAuthenticated() {
  const token = getToken();
  return Boolean(token && token.trim());
}

