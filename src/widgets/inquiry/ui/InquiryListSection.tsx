'use client';

import { Suspense, useEffect } from 'react'; // React 기본 기능 [cite: 2026-02-10]
import { isAxiosError } from 'axios';
import Link from 'next/link';
import { InquiryList } from '@/features/inquiry/ui/InquiryList';
import { InquiryListSkeleton } from './InquiryListSkeleton';
import { Button } from '@/shared/ui/button';
import { ErrorBoundaryWrapper } from '@/shared/ui/ErrorBoundaryWrapper';
import { useLoginRequired } from '@/shared/lib/hooks/useLoginRequired';

export const InquiryListSection = () => {
  const { checkAuth, user } = useLoginRequired();

  useEffect(() => {
    if (user === null) {
      checkAuth();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleError = (error: unknown): boolean | void => {
    if (isAxiosError(error) && error.response?.status === 401) {
      checkAuth();
      return true; // 401은 직접 처리 → 기본 모달 건너뜀
    }
  };

  return (
    <section className="w-full max-w-[800px] mx-auto px-4">
      <div className="flex justify-end w-full mb-6">
        <Button asChild className="cursor-pointer">
          <Link href="/inquiries/write">글쓰기</Link>
        </Button>
      </div>
      <ErrorBoundaryWrapper
        errorMessage="문의 목록을 불러오지 못했습니다."
        redirectTo="/"
        onError={handleError}
      >
        {/* 로딩 중일 때 처리 */}
        <Suspense fallback={<InquiryListSkeleton />}>
          <InquiryList />
        </Suspense>
      </ErrorBoundaryWrapper>
    </section>
  );
};
