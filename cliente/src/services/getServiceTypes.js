import { api } from '@/utils/axios';

export const getServiceTypes = async (listname) => {
  try {
    const response = await api.post('/api/consultasOracle/valuelist/listname', {
      listname: listname
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching service types:', error);
    throw error;
  }
};