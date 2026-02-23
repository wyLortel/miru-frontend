import { useQuery } from '@tanstack/react-query';

import { postApi } from '@/entities/post/api/postApi';

export const postQueryKeys = {
  all: ['posts'] as const,
  list: (page: number) => ['posts', 'list', page] as const,
  detail: (postId: number) => ['posts', 'detail', postId] as const,
};

export const usePostsQuery = (page: number) => {
  return useQuery({
    queryKey: postQueryKeys.list(page),
    queryFn: () => postApi.getPosts(page),
    // 페이지 전환 시 이전 데이터를 유지해 레이아웃 깜빡임 방지
    placeholderData: (prev) => prev,
  });
};
