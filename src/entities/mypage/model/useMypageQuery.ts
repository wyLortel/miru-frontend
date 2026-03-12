import { useSuspenseQuery } from '@tanstack/react-query';
import { mypageApi } from '../api/mypageApi';

export const useMypageQuery = () => {
  return useSuspenseQuery({
    queryKey: ['mypage'],
    queryFn: mypageApi.getMyPage,
    staleTime: 1000 * 60 * 5,
  });
};
