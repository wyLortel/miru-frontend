import { useMutation, useQueryClient } from '@tanstack/react-query';

import { postApi } from '@/entities/post/api/postApi';
import { postQueryKeys } from '@/entities/post/model/usePostsQuery';

export const useCreatePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postApi.createPost,
    onSuccess: () => {
      // 게시글 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: postQueryKeys.all });
    },
  });
};
