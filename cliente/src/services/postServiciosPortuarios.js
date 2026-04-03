import { api } from '@/utils/axios';

export const postServiciosPortuarios = async (data) => {
  const response = await api.post('/api/solicitudes/servicios-portuarios', data);
  return response.data.result;
};