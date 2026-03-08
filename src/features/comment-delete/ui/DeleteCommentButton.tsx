'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/shared/ui/button';
import { deleteComment } from '@/features/comment-create/model/api';
import { PostDetail } from '@/entities/post/model/types';

interface DeleteCommentButtonProps {
  commentId: number;
  postId: string;
}

export function DeleteCommentButton({ commentId, postId }: DeleteCommentButtonProps) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: () => deleteComment(commentId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['post', postId] });
      const prev = queryClient.getQueryData<PostDetail>(['post', postId]);
      queryClient.setQueryData<PostDetail>(['post', postId], (old) => {
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
      queryClient.setQueryData(['post', postId], ctx?.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
    },
  });

  return (
    <Button variant="ghost" size="sm" className="cursor-pointer hover:bg-primary/10 hover:text-primary" onClick={() => mutate()}>
      삭제
    </Button>
  );
}
