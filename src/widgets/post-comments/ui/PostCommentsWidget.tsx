'use client';

import { Suspense } from 'react';
import { isAxiosError } from 'axios';
import { ErrorBoundary } from 'react-error-boundary';
import { useSuspenseQuery } from '@tanstack/react-query';
import { fetchPostById } from '@/entities/post/model/api';
import { useModalStore } from '@/app/store/useModalStore';
import { PostCommentsSection } from './PostCommentsSection';

export function PostCommentsWidget({ postId }: { postId: string }) {
  const { openModal, closeModal } = useModalStore();

  return (
    <ErrorBoundary
      onError={(error) => {
        const message = isAxiosError(error) ? error.response?.data?.message : undefined;
        openModal({
          title: '불러오기 실패',
          description: message ?? '댓글을 불러오지 못했습니다.',
          buttons: [{ label: '확인', onClick: closeModal }],
        });
      }}
      fallback={<div />}
    >
      <Suspense fallback={<div className="py-10 text-center text-gray-400">댓글 불러오는 중...</div>}>
        <PostCommentsContent postId={postId} />
      </Suspense>
    </ErrorBoundary>
  );
}

function PostCommentsContent({ postId }: { postId: string }) {
  const { data: post } = useSuspenseQuery({
    queryKey: ['post', postId],
    queryFn: () => fetchPostById(postId),
  });

  return <PostCommentsSection post={post} postId={postId} />;
}
