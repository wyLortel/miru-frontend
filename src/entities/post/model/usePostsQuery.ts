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
    placeholderData: (prev) => prev,
    staleTime: 0, // 캐시 즉시 만료 → 마운트/포커스 복귀 시마다 최신 데이터 fetch
  });
};
