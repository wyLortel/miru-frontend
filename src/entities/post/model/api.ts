import { apiClient } from '@/shared/api/apiClient';
import { PostDetail } from './types';

export const fetchPostById = async (id: string): Promise<PostDetail> => {
  const res = await apiClient.get(`/api/boards/${id}`);

  // 응답 구조: { data: { items: [...] } }
  if (res.data.data?.items?.[0]) {
    return res.data.data.items[0];
  }

  return res.data;
};
