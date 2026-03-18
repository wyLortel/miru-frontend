'use client';

import { Dispatch, SetStateAction } from 'react';
import { useRouter } from 'next/navigation';
import { useMyPostsQuery } from '@/entities/mypage/model/useMyPostsQuery';
import { useServerPagination } from '@/shared/lib/hooks/useServerPagination';
import { CommonPagination } from '@/shared/ui/CommonPagination';
import { MyPostCard } from './MyPostCard';

interface Props {
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  nickname: string;
}

export function MyPageBoardsContent({ page, setPage, nickname }: Props) {
  const { data } = useMyPostsQuery(page);
  const router = useRouter();
  const { totalPages, pageNumbers, goToNext, goToPrev } = useServerPagination(
    page,
    setPage,
    data.totalCount,
  );

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">{nickname}님이 쓴글</h1>
      {data.items.length === 0 ? (
        <p className="text-center text-muted-foreground py-20">작성한 글이 없습니다.</p>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {data.items.map((post) => (
              <MyPostCard
                key={post.id}
                post={post}
                onClick={() => router.push(`/boards/${post.id}`)}
              />
            ))}
          </div>
          <CommonPagination
            page={page}
            totalPages={totalPages}
            pageNumbers={pageNumbers}
            onPageChange={setPage}
            onNext={goToNext}
            onPrev={goToPrev}
          />
        </>
      )}
    </>
  );
}
