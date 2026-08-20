const API_ROOT = import.meta.env.VITE_API_URL ?? '/api';

async function send(path, payload) {
  const response = await fetch(`${API_ROOT}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/plain' },
    body: JSON.stringify(payload),
  });
  const text = await response.text();
  if (!response.ok) throw new Error(text || `Request failed (${response.status})`);
  return text;
}

export function registerUser({ username, password }) {
  return send('/register', { username, password });
}

export function loginUser({ username, password }) {
  return send('/login', { username, password });
}
