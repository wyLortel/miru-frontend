import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mypageApi } from '@/entities/mypage/api/mypageApi';
import { mypageQueryKeys } from '@/entities/mypage/model/mypageQueryKeys';

export const useNicknameEditMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (nickname: string) => mypageApi.updateNickname(nickname),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      // mypageQueryKeys.all로 mypage 관련 모든 캐시 무효화
      queryClient.invalidateQueries({ queryKey: mypageQueryKeys.all });
      // 게시글/댓글 writer, 알람 senderNickname 즉시 반영
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['alarms', 'items'] });
    },
  });
};
