import { api } from '@/utils/axios';

export const getLocations = async () => {
  try {
    const response = await api.get('/api/consultasOracle/locations/');
    return response.data.result;
  } catch (error) {
    console.error('Error fetching locations:', error);
    throw error;
  }
};