'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postQueryKeys } from '@/entities/post/model/usePostsQuery';
import { Button } from '@/shared/ui/button';
import { deleteComment } from '@/features/comment-create/model/api';
import { PostDetail } from '@/entities/post/model/types';

interface DeleteCommentButtonProps {
  commentId: number;
  postId: string;
}

export function DeleteCommentButton({ commentId, postId }: DeleteCommentButtonProps) {
  const queryClient = useQueryClient();
  const detailKey = postQueryKeys.detail(parseInt(postId));

  const { mutate } = useMutation({
    mutationFn: () => deleteComment(commentId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: detailKey });
      const prev = queryClient.getQueryData<PostDetail>(detailKey);
      queryClient.setQueryData<PostDetail>(detailKey, (old) => {
        if (!old) return old;
        const isTopLevel = old.comments.some((c) => c.id === commentId);
        return {
          ...old,
          commentCount: old.commentCount - 1,
          comments: isTopLevel
            ? old.comments.filter((c) => c.id !== commentId)
            : old.comments.map((c) => ({
                ...c,
                replies: c.replies.filter((r) => r.id !== commentId),
              })),
        };
      });
      return { prev };
    },
    onError: (_, __, ctx) => {
      queryClient.setQueryData(detailKey, ctx?.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: detailKey });
    },
  });

  return (
    <Button variant="ghost" size="sm" className="cursor-pointer hover:bg-primary/10 hover:text-primary" onClick={() => mutate()}>
      삭제
    </Button>
  );
}
