import { api } from '@/utils/axios';

export const getModserv = async () => {
  try {
    const response = await api.get('/api/consultasOracle/modserv');
    return response.data.result || response.data;
  } catch (error) {
    console.error('Error fetching modserv:', error);
    throw error;
  }
};