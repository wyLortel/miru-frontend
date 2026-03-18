import { useSuspenseQuery } from '@tanstack/react-query';
import { mypageApi } from '../api/mypageApi';
import { mypageQueryKeys } from './mypageQueryKeys';

export const useMypageQuery = () => {
  return useSuspenseQuery({
    queryKey: mypageQueryKeys.profile(),
    queryFn: mypageApi.getMyPage,
    staleTime: 0,
  });
};
