import { useSuspenseQuery } from '@tanstack/react-query';
import { mypageApi } from '../api/mypageApi';

export const useMyPostsQuery = (page: number) => {
  return useSuspenseQuery({
    queryKey: ['my-posts', page],
    queryFn: () => mypageApi.getMyPosts(page),
    staleTime: 0,
  });
};
