const BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

export class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export const getToken = () => localStorage.getItem("token");
export const setToken = (t) => localStorage.setItem("token", t);
export const clearToken = () => localStorage.removeItem("token");

export async function api(path, { method = "GET", body } = {}) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(BASE + path, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError("No se pudo conectar con el servidor. Revisa tu conexión e intenta de nuevo.", 0);
  }

  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    // Token vencido o revocado: se limpia la sesión (no aplica al login fallido)
    if (res.status === 401 && !path.startsWith("/auth/login")) {
      clearToken();
      window.dispatchEvent(new Event("auth:expired"));
    }
    throw new ApiError(data.error || "Ocurrió un error inesperado", res.status, data.details);
  }
  return data;
}

// Convierte un error de la API en un mensaje legible para el usuario
export function describeError(e) {
  if (e?.details) {
    const lines = Object.entries(e.details).map(([field, msgs]) => `${field}: ${msgs.join(", ")}`);
    return `${e.message} (${lines.join("; ")})`;
  }
  return e?.message || "Ocurrió un error inesperado";
}
