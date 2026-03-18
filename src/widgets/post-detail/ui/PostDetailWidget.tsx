'use client';

import { Suspense } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { fetchPostById } from '@/entities/post/model/api';
import { postQueryKeys } from '@/entities/post/model/usePostsQuery';
import { PostDetailSection } from './PostDetailSection';
import { PostDetailSkeleton } from './PostDetailSkeleton';
import { ErrorBoundaryWrapper } from '@/shared/ui/ErrorBoundaryWrapper';

export function PostDetailWidget({ postId }: { postId: string }) {
  return (
    <ErrorBoundaryWrapper errorMessage="게시글을 불러오지 못했습니다." redirectTo="/boards">
      <Suspense fallback={<PostDetailSkeleton />}>
        <PostDetailContent postId={postId} />
      </Suspense>
    </ErrorBoundaryWrapper>
  );
}

function PostDetailContent({ postId }: { postId: string }) {
  const { data: post } = useSuspenseQuery({
    queryKey: postQueryKeys.detail(parseInt(postId)),
    queryFn: () => fetchPostById(postId),
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  return <PostDetailSection post={post} postId={postId} />;
}
