import api from "./api";

export async function iniciarSesionApi(username, password) {
  const res = await api.post("/api/auth/login", { username, password });
  return res.data;
}

export async function cerrarSesionApi() {
  return api.post("/api/auth/logout");
}

export async function registrarActividadApi() {
  return api.post("/api/auth/activity");
}

export async function consultarSesiones(filtros = {}) {
  const params = typeof filtros === "number" ? { pagina: filtros } : filtros;
  const res = await api.get("/api/auth/sesiones", { params });
  return res.data;
}
