import api from './api';

export async function loginApi(username, password) {
  const res = await api.post('/api/auth/login', { username, password });
  return res.data;
}
