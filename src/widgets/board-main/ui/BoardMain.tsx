'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import { PostList } from '@/entities/post/ui/PostList';
import { postApi } from '@/entities/post/api/postApi';
import { usePostsQuery } from '@/entities/post/model/usePostsQuery';
import { SearchInput } from '@/features/post-search/ui/SearchInput';
import { WriteButton } from '@/features/post-create/ui/WriteButton';
import { CommonPagination } from '@/shared/ui/CommonPagination';
import { Container } from '@/shared/ui/container';

export function BoardMain() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState('');

  // URL에서 검색 파라미터 읽기
  const urlKeyword = searchParams.get('keyword') || '';
  const urlPage = parseInt(searchParams.get('page') || '1', 10);

  const [searchKeyword, setSearchKeyword] = useState(urlKeyword);
  const [page, setPage] = useState(urlPage);

  // URL 변경 시 상태 동기화
  useEffect(() => {
    setSearchKeyword(urlKeyword);
    setPage(urlPage);
    setSearch(urlKeyword);
  }, [urlKeyword, urlPage]);

  // 검색 여부에 따라 다른 API 호출
  const isSearching = searchKeyword.trim() !== '';

  const postsQuery = usePostsQuery(page - 1);
  const searchQuery = useQuery({
    queryKey: ['posts', 'search', searchKeyword, page],
    queryFn: () => postApi.searchPosts(searchKeyword, page - 1),
    enabled: isSearching,
    placeholderData: (prev) => prev,
    staleTime: 1000 * 30,
  });

  const { data } = isSearching ? searchQuery : postsQuery;
  const posts = data?.posts ?? [];
  const totalCount = data?.totalCount ?? 0;

  // 페이지네이션 계산
  const pageSize = 10;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;
  const groupSize = 10;
  const currentGroup = Math.ceil(page / groupSize);
  const startPage = (currentGroup - 1) * groupSize + 1;
  const endPage = Math.min(currentGroup * groupSize, totalPages);
  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i,
  );

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
    setPage(1);
    // URL 업데이트
    if (keyword.trim()) {
      router.push(`/board?keyword=${encodeURIComponent(keyword)}&page=1`);
    } else {
      router.push('/board');
    }
  };

  // 페이지 변경 시 URL 업데이트
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    if (searchKeyword.trim()) {
      router.push(`/board?keyword=${encodeURIComponent(searchKeyword)}&page=${newPage}`);
    } else {
      router.push(`/board?page=${newPage}`);
    }
  };

  const handleNext = () => {
    handlePageChange(page + 1);
  };

  const handlePrev = () => {
    handlePageChange(page - 1);
  };

  return (
    <Container>
      <div className="w-full py-8">
        {/* 검색 */}
        <SearchInput
          value={search}
          onChange={setSearch}
          onSearch={handleSearch}
        />

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
          onPageChange={handlePageChange}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      </div>
    </Container>
  );
}
