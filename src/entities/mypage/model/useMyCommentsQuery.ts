import { useSuspenseQuery } from '@tanstack/react-query';
import { mypageApi } from '../api/mypageApi';
import { mypageQueryKeys } from './mypageQueryKeys';

export const useMyCommentsQuery = (page: number) => {
  return useSuspenseQuery({
    queryKey: mypageQueryKeys.commentsList(page),
    queryFn: () => mypageApi.getMyComments(page),
    staleTime: 0,
  });
};
