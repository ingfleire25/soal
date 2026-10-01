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

export async function consultarSesiones(pagina = 1) {
  const res = await api.get("/api/auth/sesiones", { params: { pagina } });
  return res.data;
}
