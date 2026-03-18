'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/entities/admin/api/adminApi';
import { CommonPagination } from '@/shared/ui/CommonPagination';
import { MyPostCard } from '@/widgets/mypage-boards/ui/MyPostCard';
import { MyPostListSkeleton } from '@/widgets/mypage-boards/ui/MyPostListSkeleton';

const PAGE_SIZE = 10;
const GROUP_SIZE = 10;

interface Props {
  userId: number;
}

export function AdminUserBoardsContent({ userId }: Props) {
  const [page, setPage] = useState(1);
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin', 'user-boards', userId, page],
    queryFn: () => adminApi.getUserBoards(userId, page - 1),
  });

  const totalCount = data?.totalCount ?? 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE) || 1;
  const currentGroup = Math.ceil(page / GROUP_SIZE);
  const startPage = (currentGroup - 1) * GROUP_SIZE + 1;
  const endPage = Math.min(currentGroup * GROUP_SIZE, totalPages);
  const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  if (isLoading) return <MyPostListSkeleton />;

  if (isError) {
    return <p className="text-red-500">작성글 목록을 불러오지 못했습니다.</p>;
  }

  const items = data?.items ?? [];

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">{data?.targetNickname}님이 쓴 글</h1>
      {items.length === 0 ? (
        <p className="text-center text-muted-foreground py-20">작성한 글이 없습니다.</p>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {items.map((post) => (
              <MyPostCard
                key={post.id}
                post={post}
                onClick={() => router.push(`/boards/${post.id}`)}
              />
            ))}
          </div>
          {totalPages > 1 && (
            <CommonPagination
              page={page}
              totalPages={totalPages}
              pageNumbers={pageNumbers}
              onPageChange={setPage}
              onNext={() => setPage((p) => Math.min(p + 1, totalPages))}
              onPrev={() => setPage((p) => Math.max(p - 1, 1))}
            />
          )}
        </>
      )}
    </>
  );
}
