'use client';

import { Dispatch, SetStateAction } from 'react';
import { useRouter } from 'next/navigation';
import { useMyCommentsQuery } from '@/entities/mypage/model/useMyCommentsQuery';
import { useServerPagination } from '@/shared/lib/hooks/useServerPagination';
import { CommonPagination } from '@/shared/ui/CommonPagination';
import { MyCommentCard } from './MyCommentCard';

interface Props {
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  nickname: string;
}

export function MyPageCommentsContent({ page, setPage, nickname }: Props) {
  const { data } = useMyCommentsQuery(page);
  const router = useRouter();
  const { totalPages, pageNumbers, goToNext, goToPrev } = useServerPagination(
    page,
    setPage,
    data.totalCount,
  );

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">{nickname}님이 댓글</h1>
      {data.items.length === 0 ? (
        <p className="text-center text-muted-foreground py-20">작성한 댓글이 없습니다.</p>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {data.items.map((comment, i) => (
              <MyCommentCard
                key={`${comment.boardId}-${i}`}
                comment={comment}
                onClick={() => router.push(`/boards/${comment.boardId}`)}
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
