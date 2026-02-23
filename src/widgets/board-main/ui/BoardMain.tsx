'use client';

import { Suspense, useState } from 'react';

import { PostList } from '@/entities/post/ui/PostList';
import { PostListSkeleton } from '@/entities/post/ui/PostCardSkeleton';
import { MOCK_REGULAR_POSTS } from '@/entities/post/ui/PostCard';
import { SearchInput } from '@/features/post-search/ui/SearchInput';
import { WriteButton } from '@/features/post-create/ui/WriteButton';
import { CommonPagination } from '@/shared/ui/CommonPagination';
import { ErrorBoundary } from '@/shared/ui/ErrorBoundary';
import { usePagination } from '@/shared/lib/hooks/usePagination';
import { Container } from '@/shared/ui/container';

export function BoardMain() {
  const [search, setSearch] = useState('');
  const { page, setPage, getPaginationData, goToNext, goToPrev } =
    usePagination(10);

  // API 연결 후 totalCount는 서버 응답값으로 교체
  const totalCount = MOCK_REGULAR_POSTS.length;
  const { totalPages, pageNumbers } = getPaginationData(totalCount);

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
          <ErrorBoundary>
            <Suspense fallback={<PostListSkeleton />}>
              <PostList page={page} />
            </Suspense>
          </ErrorBoundary>
        </div>

        {/* 페이지네이션 */}
        <CommonPagination
          page={page}
          totalPages={totalPages}
          pageNumbers={pageNumbers}
          onPageChange={setPage}
          onNext={() => goToNext(totalPages)}
          onPrev={goToPrev}
        />
      </div>
    </Container>
  );
}
