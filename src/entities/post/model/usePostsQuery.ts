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
    staleTime: 1000 * 30, // 30초간 캐시 유지, 윈도우 포커스 재요청 방지
  });
};
