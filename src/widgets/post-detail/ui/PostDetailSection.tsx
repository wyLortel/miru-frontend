'use client';

import { useRouter } from 'next/navigation';
import { PostDetail } from '@/entities/post/model/types';
import { PostDetailHeader } from '@/entities/post/ui/PostDetailHeader';
import { LikeButton } from '@/features/post-like/ui/LikeButton';
import { DeletePostButton } from '@/features/post-delete/ui/DeletePostButton';
import { useAuth } from '@/entities/auth/useAuth';
import { Button } from '@/shared/ui/button';

interface PostDetailSectionProps {
  post: PostDetail;
  postId: string;
}

export function PostDetailSection({ post, postId }: PostDetailSectionProps) {
  const router = useRouter();
  const { data: user } = useAuth();

  const isOwner = !!(user?.nickname === post.writer || user?.role === 'ADMIN');

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <PostDetailHeader
        title={post.title}
        writer={post.writer}
        viewCount={post.viewCount}
        commentCount={post.commentCount}
        likeCount={post.likeCount}
        createdAt={post.createdAt}
        actions={
          isOwner && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="cursor-pointer hover:bg-primary/10 hover:text-primary"
                onClick={() => router.push(`/board/${postId}/edit`)}
              >
                수정
              </Button>
              <DeletePostButton postId={postId} />
            </>
          )
        }
      />
      <div
        className="prose prose-base prose-h1:text-2xl prose-h1:font-bold prose-h2:text-xl prose-h2:font-bold prose-strong:font-bold max-w-none min-h-[200px] text-base leading-loose mb-10"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      <div className="flex justify-start">
        <LikeButton
          postId={postId}
          likeCount={post.likeCount}
          isLiked={post.isLiked}
        />
      </div>
    </div>
  );
}
