import { apiClient } from './apiClient';

export interface User {
  id: number;
  email: string;
  nickname: string;
  role: string;
  status: string;
}

interface ApiResponse<T> {
  data: T;
}

export const authApi = {
  /** 현재 로그인 유저 정보 조회 - auth */
  getMe: async (): Promise<User> => {
    const res = await apiClient.get<ApiResponse<User>>('/api/me');
    return res.data.data;
  },

  
  agreeTerms: async (): Promise<void> => {
    await apiClient.post('/api/agreements');
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/api/logout');
  },
};
