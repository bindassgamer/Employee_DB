export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const getToken = () => localStorage.getItem("token");

const request = async (path, options = {}) => {
  const headers = options.headers || {};
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || "Request failed");
  }

  return res.json();
};

export const api = {
  login: (payload) => request("/api/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  register: (payload) => request("/api/auth/register", { method: "POST", body: JSON.stringify(payload) }),
  fetchEmployees: (query = "") => request(`/api/employees${query}`),
  createEmployee: (formData) => request("/api/employees", { method: "POST", body: formData }),
  fetchMeta: () => request("/api/employees/meta")
};

export default api;
