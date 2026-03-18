import { apiClient } from '@/shared/api/apiClient';
import { PostDetail } from './types';

export const fetchPostById = async (id: string): Promise<PostDetail> => {
  const res = await apiClient.get(`/api/boards/${id}`);

  // 응답 구조: { data: { items: [...] } }
  if (res.data.data?.items?.[0]) {
    const item = res.data.data.items[0];
    // 서버의 'liked' 필드를 프론트의 'isLiked'로 변환
    return {
      ...item,
      isLiked: item.liked
    };
  }

  if (res.data.data) {
    return {
      ...res.data.data,
      isLiked: res.data.data.liked
    };
  }

  return {
    ...res.data,
    isLiked: res.data.liked
  };
};
