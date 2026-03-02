'use client';

import { useState } from 'react';

import { PostList } from '@/entities/post/ui/PostList';
import { usePostsQuery } from '@/entities/post/model/usePostsQuery';
import { SearchInput } from '@/features/post-search/ui/SearchInput';
import { WriteButton } from '@/features/post-create/ui/WriteButton';
import { CommonPagination } from '@/shared/ui/CommonPagination';
import { useServerPagination } from '@/shared/lib/hooks/useServerPagination';
import { Container } from '@/shared/ui/container';

export function BoardMain() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data } = usePostsQuery(page);
  const posts = data?.posts ?? [];
  const totalCount = data?.totalCount ?? 0;

  const { totalPages, pageNumbers, goToNext, goToPrev } = useServerPagination(
    page,
    setPage,
    totalCount,
  );

  return (
    <Container>
      <div className="w-full py-8">
        {/* 검색 */}
        <SearchInput value={search} onChange={setSearch} />

        {/* 글쓰기 버튼 - 우측 정렬 */}
        <div className="mt-12 flex justify-end">
          <WriteButton />
        </div>

        {/* 게시글 목록 */}
        <div className="mt-6">
          <PostList posts={posts} />
        </div>

        {/* 페이지네이션 */}
        <CommonPagination
          page={page}
          totalPages={totalPages}
          pageNumbers={pageNumbers}
          onPageChange={setPage}
          onNext={goToNext}
          onPrev={goToPrev}
        />
      </div>
    </Container>
  );
}
