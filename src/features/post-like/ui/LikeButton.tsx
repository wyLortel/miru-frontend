'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Heart } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { toggleLike } from '../model/api';
import type { PostDetail } from '@/entities/post/model/types';
import { cn } from '@/lib/utils';
import { useLoginRequired } from '@/shared/lib/hooks/useLoginRequired';

interface LikeButtonProps {
  postId: string;
  likeCount: number;
  isLiked: boolean;
}

export function LikeButton({ postId, likeCount, isLiked }: LikeButtonProps) {
  const queryClient = useQueryClient();
  const { checkAuth } = useLoginRequired();

  const { mutate } = useMutation({
    mutationFn: () => toggleLike(postId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['post', postId] });
      const previous = queryClient.getQueryData<PostDetail>(['post', postId]);

      queryClient.setQueryData<PostDetail>(['post', postId], (old) => {
        if (!old) return old;
        return {
          ...old,
          isLiked: !old.isLiked,
          likeCount: old.isLiked ? old.likeCount - 1 : old.likeCount + 1,
        };
      });

      return { previous };
    },
    onSuccess: () => {
      // Optimistic update 완료 - 추가 처리 없음
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['post', postId], context.previous);
      }
    },
  });

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => checkAuth(() => mutate())}
      className={cn('cursor-pointer', isLiked && 'text-red-500 border-red-300')}
    >
      <Heart className={cn('size-4', isLiked && 'fill-red-500')} />
      {likeCount}
    </Button>
  );
}
