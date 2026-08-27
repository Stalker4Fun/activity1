import { getToken } from './auth';

const API_ROOT = import.meta.env.VITE_API_URL ?? '/api';

async function authFetch(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json, text/plain',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_ROOT}${path}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type') || '';
  let data = null;
  if (contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;
    if (typeof data === 'string' && data.trim()) {
      errorMessage = data;
    } else if (data && typeof data === 'object') {
      errorMessage = data.message || data.error || errorMessage;
    }
    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export function getServiceRequests() {
  return authFetch('/requests', {
    method: 'GET',
  });
}

export function getServiceRequest(id) {
  return authFetch(`/requests/${id}`, {
    method: 'GET',
  });
}

export function createServiceRequest(requestData) {
  return authFetch('/requests', {
    method: 'POST',
    body: JSON.stringify(requestData),
  });
}

export function updateServiceRequest(id, requestData) {
  return authFetch(`/requests/${id}`, {
    method: 'PUT',
    body: JSON.stringify(requestData),
  });
}

export function deleteServiceRequest(id) {
  return authFetch(`/requests/${id}`, {
    method: 'DELETE',
  });
}

