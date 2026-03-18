'use client';

import { Suspense } from 'react';
import { isAxiosError } from 'axios';
import { Container } from '@/shared/ui/container';
import { ErrorBoundaryWrapper } from '@/shared/ui/ErrorBoundaryWrapper';
import { MyPageProfile } from './MyPageProfile';
import { MyPageAnalysisStats } from './MyPageAnalysisStats';
import { MyPagePostStats } from './MyPagePostStats';

function StatsSkeleton() {
  return (
    <div className="w-full grid grid-cols-3 gap-3">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="rounded-xl border border-border bg-card py-5 flex flex-col items-center gap-2"
        >
          <div className="h-3 w-10 animate-pulse rounded bg-muted" />
          <div className="h-8 w-8 animate-pulse rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}

function PostStatsSkeleton() {
  return (
    <div className="w-full grid grid-cols-2 gap-3">
      {[0, 1].map((i) => (
        <div
          key={i}
          className="rounded-xl border border-border bg-card py-5 flex flex-col items-center gap-2"
        >
          <div className="h-3 w-12 animate-pulse rounded bg-muted" />
          <div className="h-8 w-8 animate-pulse rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}

export function MyPageMain() {
  return (
    <Container>
      <div className="flex flex-col items-center gap-8 py-10 max-w-[480px] mx-auto">
        <MyPageProfile />

        <ErrorBoundaryWrapper
          errorMessage="정보를 불러오지 못했습니다."
          redirectTo="/"
          onError={(error) => {
            if (isAxiosError(error) && error.response?.status === 401) return true;
          }}
        >
          <Suspense
            fallback={
              <div className="w-full flex flex-col gap-8">
                <StatsSkeleton />
                <PostStatsSkeleton />
              </div>
            }
          >
            <div className="w-full flex flex-col gap-8">
              <MyPageAnalysisStats />
              <MyPagePostStats />
            </div>
          </Suspense>
        </ErrorBoundaryWrapper>
      </div>
    </Container>
  );
}
