import { api } from '@/utils/axios';

export const getCompanies = async () => {
  try {
    const response = await api.get('/api/consultasOracle/companies/');
    return response.data.result || response.data;
  } catch (error) {
    console.error('Error fetching companies:', error);
    throw error;
  }
};
