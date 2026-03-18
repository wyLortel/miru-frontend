'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { alarmApi } from '@/entities/alarm/api/alarmApi';
import { alarmQueryKeys } from '@/entities/alarm/model/alarmQueryKeys';

const PostDetailWidget = dynamic(
  () => import('@/widgets/post-detail/ui/PostDetailWidget').then(m => ({ default: m.PostDetailWidget })),
  { ssr: false }
);
const PostCommentsWidget = dynamic(
  () => import('@/widgets/post-comments/ui/PostCommentsWidget').then(m => ({ default: m.PostCommentsWidget })),
  { ssr: false }
);

export function PostDetailPageClient({ postId }: { postId: string }) {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  useEffect(() => {
    const alarmId = searchParams.get('alarmId');
    if (alarmId) {
      alarmApi.readAlarm(Number(alarmId))
        .then(() => {
          queryClient.invalidateQueries({ queryKey: alarmQueryKeys.hasUnread() });
          queryClient.invalidateQueries({ queryKey: alarmQueryKeys.items() });
        })
        .catch(error => {
          console.error('Failed to read alarm:', error);
        });
    }
  }, [searchParams, queryClient]);

  return (
    <>
      <PostDetailWidget postId={postId} />
      <PostCommentsWidget postId={postId} />
    </>
  );
}
