'use client';

import {
  PostCard,
  MOCK_NOTICES,
  MOCK_REGULAR_POSTS,
} from '@/entities/post/ui/PostCard';

interface PostListProps {
  page: number;
}

const PAGE_SIZE = 10;

export function PostList({ page }: PostListProps) {
  // API 연결 후 아래 주석을 해제하고 목업 데이터 제거
  // const { data } = usePostsSuspenseQuery(page);
  // const regularPosts = data?.posts ?? [];
  // const notices = page === 1 ? data?.notices ?? [] : [];

  const regularPosts = MOCK_REGULAR_POSTS.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );
  const orderedPosts =
    page === 1 ? [...MOCK_NOTICES, ...regularPosts] : regularPosts;

  return (
    <div className="flex flex-col gap-3">
      {orderedPosts.map((post) => (
        <PostCard key={post.id} post={post} onClick={() => {}} />
      ))}
    </div>
  );
}
