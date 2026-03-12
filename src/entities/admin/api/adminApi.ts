import { apiClient } from '@/shared/api/apiClient';
import type { AdminInquiriesResponse, AdminInquiryDetail, AdminUsersResponse, AdminUserBoardsResponse, AdminUserCommentsResponse } from '../model/types';

export const adminApi = {
  getInquiries: async (): Promise<AdminInquiriesResponse> => {
    const res = await apiClient.get('/api/admin/inquiries');
    return res.data.data;
  },

  getInquiryDetail: async (id: number): Promise<AdminInquiryDetail> => {
    const res = await apiClient.get(`/api/admin/inquiries/${id}`);
    return res.data.data.items[0];
  },

  postAnswer: async (id: number, answerContent: string): Promise<void> => {
    await apiClient.post(`/api/admin/inquiries/${id}/answer`, { answerContent });
  },

  deleteAnswer: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/admin/inquiries/${id}`);
  },

  getUsers: async (page: number, name?: string): Promise<AdminUsersResponse> => {
    const params: Record<string, string | number> = { page };
    if (name) params.name = name;
    const res = await apiClient.get('/api/admin/users', { params });
    return res.data.data;
  },

  getUserBoards: async (userId: number, page: number): Promise<AdminUserBoardsResponse> => {
    const res = await apiClient.get(`/api/admin/users/${userId}/board`, { params: { page } });
    return res.data.data;
  },

  getUserComments: async (userId: number, page: number): Promise<AdminUserCommentsResponse> => {
    const res = await apiClient.get(`/api/admin/users/${userId}/comments`, { params: { page } });
    return res.data.data;
  },

  updateUserStatus: async (userId: number): Promise<void> => {
    await apiClient.patch(`/api/admin/users/${userId}/status`);
  },
};
