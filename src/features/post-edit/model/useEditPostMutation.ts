import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postApi, CreatePostPayload } from '@/entities/post/api/postApi';
import { postQueryKeys } from '@/entities/post/model/usePostsQuery';

export const useEditPostMutation = (postId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePostPayload) => postApi.updatePost(postId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
      queryClient.invalidateQueries({ queryKey: postQueryKeys.all });
    },
  });
};
