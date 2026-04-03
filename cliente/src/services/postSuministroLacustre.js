import { api } from '@/utils/axios';

export const postSuministroLacustre = async (data) => {
  const response = await api.post('/api/solicitudes/suministro-lacustre', data);
  return response.data.result;
};