export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:1000";

// ✅ Change these endpoints to your backend
export const carRegisterAuth = {
  login: `${API_BASE}/car-register/login`,
  register: `${API_BASE}/car-register/register`,
  me: `${API_BASE}/car-register/me`,
};

export async function apiRequest(url, { method = "GET", body, token } = {}) {
  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const message = data?.message || data?.error || `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data;
}
