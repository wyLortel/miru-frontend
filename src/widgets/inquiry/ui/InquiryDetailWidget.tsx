'use client';

import { Suspense, useEffect } from 'react';
import { isAxiosError } from 'axios';
import { useSuspenseQuery } from '@tanstack/react-query';
import { fetchInquiryById } from '@/features/inquiry/model/api';
import { InquiryDetailSection } from './InquiryDetailSection';
import { InquiryDetailSkeleton } from './InquiryDetailSkeleton';
import { ErrorBoundaryWrapper } from '@/shared/ui/ErrorBoundaryWrapper';
import { useLoginRequired } from '@/shared/lib/hooks/useLoginRequired';

// 1. 외부에서 사용하는 위젯 본체
export const InquiryDetailWidget = ({ id }: { id: string }) => {
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
    <ErrorBoundaryWrapper
      errorMessage="문의 내용을 불러오지 못했습니다."
      redirectTo="/inquiries"
      onError={handleError}
    >
      <Suspense fallback={<InquiryDetailSkeleton />}>
        <InquiryDetailContent id={id} />
      </Suspense>
    </ErrorBoundaryWrapper>
  );
};

// 2. 실제 데이터를 패칭하는 내부 컴포넌트 1번으로 렌더링을 시작하면서 이 함수가 실행됨
const InquiryDetailContent = ({ id }: { id: string }) => {
  const { data } = useSuspenseQuery({
    queryKey: ['inquiry', id],
    queryFn: () => fetchInquiryById(id),
  });

  // 성공하면 데이터를 Section에 전달합니다.
  return <InquiryDetailSection data={data} id={id} />;
};
