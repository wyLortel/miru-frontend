'use client';

import dynamic from 'next/dynamic';

const PostDetailWidget = dynamic(
  () => import('@/widgets/post-detail/ui/PostDetailWidget').then(m => ({ default: m.PostDetailWidget })),
  { ssr: false }
);
const PostCommentsWidget = dynamic(
  () => import('@/widgets/post-comments/ui/PostCommentsWidget').then(m => ({ default: m.PostCommentsWidget })),
  { ssr: false }
);

export function PostDetailPageClient({ postId }: { postId: string }) {
  return (
    <>
      <PostDetailWidget postId={postId} />
      <PostCommentsWidget postId={postId} />
    </>
  );
}
