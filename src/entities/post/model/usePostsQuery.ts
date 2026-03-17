import { useQuery, useSuspenseQuery } from '@tanstack/react-query';

import { postApi } from '@/entities/post/api/postApi';

export const postQueryKeys = {
  all: ['posts'] as const,
  lists: ['posts', 'list'] as const,
  list: (page: number) => ['posts', 'list', page] as const,
  detail: (postId: number) => ['posts', 'detail', postId] as const,
};

export const usePostsQuery = (page: number) => {
  return useQuery({
    queryKey: postQueryKeys.list(page),
    queryFn: () => postApi.getPosts(page),
    placeholderData: (prev) => prev,
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchInterval: 30_000,
  });
};

export const useSuspensePostsQuery = (page: number) => {
  return useSuspenseQuery({
    queryKey: postQueryKeys.list(page),
    queryFn: () => postApi.getPosts(page),
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchInterval: 30_000,
  });
};
