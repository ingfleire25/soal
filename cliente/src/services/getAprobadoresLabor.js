import { api } from '@/utils/axios';

export const getAprobadoresLabor = async (nivel = '') => {
  try {
    const params = {};
    if (nivel) {
      params.nivel = nivel;
    }
    const response = await api.get('/api/consultasOracle/labor/filtered', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching aprobadores labor:', error);
    throw error;
  }
};
