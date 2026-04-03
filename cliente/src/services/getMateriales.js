import { api } from '@/utils/axios';

export const getMateriales = async () => {
  const response = await api.get('/api/materiales');
  return response.data.result;
};