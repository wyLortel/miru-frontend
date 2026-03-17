'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSyncExternalStore } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { toggleLike } from '../model/api';
import { postQueryKeys } from '@/entities/post/model/usePostsQuery';
import type { PostDetail } from '@/entities/post/model/types';
import { cn } from '@/lib/utils';
import { useLoginRequired } from '@/shared/lib/hooks/useLoginRequired';

interface LikeButtonProps {
  postId: string;
  likeCount: number;
  isLiked: boolean;
}

export function LikeButton({ postId, likeCount: initialLikeCount, isLiked: initialIsLiked }: LikeButtonProps) {
  const queryClient = useQueryClient();
  const { checkAuth } = useLoginRequired();
  const detailKey = postQueryKeys.detail(parseInt(postId));

  // 캐시 변화를 구독해서, 캐시가 업데이트되면 즉시 리렌더링
  const post = useSyncExternalStore(
    (listener) => queryClient.getQueryCache().subscribe(listener),
    () => queryClient.getQueryData<PostDetail>(detailKey) || { isLiked: initialIsLiked, likeCount: initialLikeCount }
  );

  const isLiked = post?.isLiked ?? initialIsLiked;
  const likeCount = post?.likeCount ?? initialLikeCount;

  const { mutate, isPending } = useMutation({
    mutationFn: () => toggleLike(postId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: detailKey });
      const previous = queryClient.getQueryData<PostDetail>(detailKey);

      queryClient.setQueryData<PostDetail>(detailKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          isLiked: !old.isLiked,
          likeCount: old.isLiked ? old.likeCount - 1 : old.likeCount + 1,
        };
      });

      return { previous };
    },
    onSuccess: (data) => {
      queryClient.setQueryData<PostDetail>(detailKey, (old) => {
        if (!old) return data;

        // undefined 값을 제외하고 merge (서버가 반환하지 않은 필드는 기존값 유지)
        const cleanData = Object.fromEntries(
          Object.entries(data || {}).filter(([, value]) => value !== undefined)
        );

        return { ...old, ...cleanData };
      });
    },
    onSettled: () => {
      // 백그라운드에서 서버 상태 재조회로 isLiked 최종 확정 (active 쿼리도 refetch)
      queryClient.invalidateQueries({ queryKey: detailKey });
      queryClient.invalidateQueries({ queryKey: postQueryKeys.lists });
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(detailKey, context.previous);
      }
    },
  });

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => !isPending && checkAuth(() => mutate())}
      className={cn('cursor-pointer', isLiked && 'text-red-500 border-red-300')}
    >
      <Heart className={cn('size-4', isLiked && 'fill-red-500')} />
      {likeCount}
    </Button>
  );
}
