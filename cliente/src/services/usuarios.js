import api from './api';

export async function searchUsuarios(search) {
  const query = search ? `?search=${encodeURIComponent(search)}` : '';
  const res = await api.get(`/api/usuarios${query}`);
  return res.data;
}

export async function getUsuarioById(id) {
  const res = await api.get(`/api/usuarios/${id}`);
  return res.data;
}

export async function createUsuario(usuario) {
  const res = await api.post('/api/usuarios', usuario);
  return res.data;
}

export async function updateUsuario(id, usuario) {
  const res = await api.put(`/api/usuarios/${id}`, usuario);
  return res.data;
}
