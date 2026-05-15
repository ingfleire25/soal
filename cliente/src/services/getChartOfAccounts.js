import {api} from '../utils/axios';

let chartOfAccountsCache = null;

export const getChartOfAccounts = async () => {
  if (chartOfAccountsCache) {
    return chartOfAccountsCache;
  }

  try {
    const response = await api.get('/api/consultasOracle/chartofaccounts');
    chartOfAccountsCache = response.data || [];
    return chartOfAccountsCache;
  } catch (error) {
    console.error('Error fetching chart of accounts:', error);
    throw error;
  }
};
 