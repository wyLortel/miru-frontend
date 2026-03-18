'use client';

import { Suspense, useState } from 'react';
import { isAxiosError } from 'axios';
import { useAuth } from '@/entities/auth/useAuth';
import { Container } from '@/shared/ui/container';
import { ErrorBoundaryWrapper } from '@/shared/ui/ErrorBoundaryWrapper';
import { MyPageCommentsContent } from './MyPageCommentsContent';
import { MyPostListSkeleton } from '@/widgets/mypage-boards/ui/MyPostListSkeleton';

export function MyPageCommentsMain() {
  const { data: user } = useAuth();
  const [page, setPage] = useState(1);

  return (
    <Container>
      <div className="py-10">
        <ErrorBoundaryWrapper
          errorMessage="댓글 목록을 불러오지 못했습니다."
          redirectTo="/mypage"
          onError={(error) => {
            if (isAxiosError(error) && error.response?.status === 401) return true;
          }}
        >
          <Suspense fallback={<MyPostListSkeleton />}>
            <MyPageCommentsContent
              page={page}
              setPage={setPage}
              nickname={user?.nickname ?? ''}
            />
          </Suspense>
        </ErrorBoundaryWrapper>
      </div>
    </Container>
  );
}
