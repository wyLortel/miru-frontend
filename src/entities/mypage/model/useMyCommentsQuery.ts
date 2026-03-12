import { useSuspenseQuery } from '@tanstack/react-query';
import { mypageApi } from '../api/mypageApi';

export const useMyCommentsQuery = (page: number) => {
  return useSuspenseQuery({
    queryKey: ['my-comments', page],
    queryFn: () => mypageApi.getMyComments(page),
    staleTime: 0,
  });
};
