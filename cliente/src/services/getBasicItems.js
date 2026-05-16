import { api } from '@/utils/axios';

export const getBasicItems = async (query = '') => {
  const params = {};
  if (query && query.trim().length > 0) {
    params.q = query.trim();
  }

  const response = await api.get('/api/consultasOracle/item', { params });
  return response.data;
};
