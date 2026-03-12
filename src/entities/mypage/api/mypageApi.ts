import { apiClient } from '@/shared/api/apiClient';
import type {
  MyPageInfo,
  MyPostListResponse,
  MyCommentListResponse,
} from '../model/types';

interface ApiDataResponse<T> {
  data: {
    items: T[];
    [key: string]: unknown;
  };
}

export const mypageApi = {
  getMyPage: async (): Promise<MyPageInfo> => {
    const res = await apiClient.get<ApiDataResponse<MyPageInfo>>('/api/mypage');
    return res.data.data.items[0];
  },

  getMyPosts: async (page: number): Promise<MyPostListResponse> => {
    const res = await apiClient.get('/api/mypage/boards', {
      params: { page: page - 1 }, // 1-indexed → 0-indexed
    });
    return {
      items: res.data.data.items,
      totalCount: res.data.data.totalCount,
    };
  },

  getMyComments: async (page: number): Promise<MyCommentListResponse> => {
    const res = await apiClient.get('/api/mypage/comments', {
      params: { page: page - 1 }, // 1-indexed → 0-indexed
    });
    return {
      items: res.data.data.items,
      totalCount: res.data.data.totalCount,
    };
  },

  updateNickname: async (nickname: string): Promise<string> => {
    const res = await apiClient.patch('/api/mypage/nickname', { nickname });
    return res.data.data.nickname;
  },

  deleteMyPage: async (): Promise<void> => {
    await apiClient.delete('/api/mypage');
  },
};
