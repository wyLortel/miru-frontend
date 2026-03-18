import { useSuspenseQuery } from '@tanstack/react-query';
import { mypageApi } from '../api/mypageApi';
import { mypageQueryKeys } from './mypageQueryKeys';

export const useMyPostsQuery = (page: number) => {
  return useSuspenseQuery({
    queryKey: mypageQueryKeys.postsList(page),
    queryFn: () => mypageApi.getMyPosts(page),
    staleTime: 0,
  });
};
