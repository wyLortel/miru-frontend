import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mypageApi } from '@/entities/mypage/api/mypageApi';
import { authApi } from '@/shared/api/auth';

export const useWithdrawMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await mypageApi.deleteMyPage();
      await authApi.logout();
    },
    onSuccess: () => {
      queryClient.setQueryData(['auth', 'me'], null);
    },
  });
};
