'use client';

import { useRouter } from 'next/navigation';
import type { Post } from '@/entities/post/model/types';
import { PostCard } from '@/entities/post/ui/PostCard';

interface PostListProps {
  posts: Post[];
}

export function PostList({ posts }: PostListProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-3">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onClick={() => router.push(`/board/${post.id}`)} />
      ))}
    </div>
  );
}
