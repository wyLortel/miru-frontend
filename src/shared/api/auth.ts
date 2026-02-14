import { apiClient } from './apiClient';

export const authApi = {
  getMe: async () => {
    const res = await apiClient.get('/me');
    return res.data;
  },

  logout: async () => {
    await apiClient.post('/logout');
  },
};
