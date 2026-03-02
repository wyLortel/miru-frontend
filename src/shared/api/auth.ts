import { apiClient } from './apiClient';

export interface User {
  id: number;
  email: string;
  nickname: string;
}

export const authApi = {
  getMe: async (): Promise<User> => {
    const res = await apiClient.get<User>('/me');
    return res.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/logout');
  },
};
