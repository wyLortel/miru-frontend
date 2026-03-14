'use client';

import { Suspense, useEffect } from 'react'; // React 기본 기능 [cite: 2026-02-10]
import { isAxiosError } from 'axios';
import { ErrorBoundary } from 'react-error-boundary';
import Link from 'next/link';
import { InquiryList } from '@/features/inquiry/ui/InquiryList';
import { Button } from '@/shared/ui/button';
import { useModalStore } from '@/app/store/useModalStore';
import { useLoginRequired } from '@/shared/lib/hooks/useLoginRequired';

export const InquiryListSection = () => {
  const { openModal, closeModal } = useModalStore();
  const { checkAuth, user } = useLoginRequired();

  useEffect(() => {
    if (user === null) {
      checkAuth();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <section className="w-full max-w-[800px] mx-auto">
      <div className="flex justify-end w-full mb-6">
        <Button asChild className="cursor-pointer">
          <Link href="/inquiries/write">글쓰기</Link>
        </Button>
      </div>
      <ErrorBoundary
        onError={(error) => {
          if (isAxiosError(error) && error.response?.status === 401) {
            checkAuth();
            return;
          }
          const message = isAxiosError(error) ? error.response?.data?.message : undefined;
          openModal({
            title: '불러오기 실패',
            description: message ?? '문의 목록을 불러오지 못했습니다.',
            buttons: [{ label: '확인', onClick: closeModal }],
          });
        }}
        fallback={<div />}
      >
        {/* 로딩 중일 때 처리 */}
        <Suspense
          fallback={
            <div className="w-full py-20 text-center text-gray-400">
              불러오는 중...
            </div>
          }
        >
          <InquiryList />
        </Suspense>
      </ErrorBoundary>
    </section>
  );
};
