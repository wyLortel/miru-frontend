import { apiClient } from '@/shared/api/apiClient';
import type { PostDetail } from '@/entities/post/model/types';

export const toggleLike = async (id: string): Promise<PostDetail> => {
  const res = await apiClient.post(`/api/boards/${id}/like`);

  // 응답 구조: { data: { items: [...] } }
  if (res.data.data?.items?.[0]) {
    return res.data.data.items[0];
  }

  if (res.data.data) {
    return res.data.data;
  }

  return res.data;
};
