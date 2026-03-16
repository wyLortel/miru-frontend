'use client';

import { Suspense, useEffect, useState } from 'react';
import { isAxiosError } from 'axios';
import { ErrorBoundary } from 'react-error-boundary';
import { useAnalysisQuery } from '@/entities/analysis/model/useAnalysisQuery';
import { AnalysisCard } from '@/entities/analysis/ui/AnalysisCard';
import { AnalysisListSkeleton } from '@/entities/analysis/ui/AnalysisCardSkeleton';
import {
  AnalysisFilterTabs,
  type FilterTab,
} from '@/features/analysis-filter/ui/AnalysisFilterTabs';
import { CommonPagination } from '@/shared/ui/CommonPagination';
import { usePagination } from '@/shared/lib/hooks/usePagination';
import { useModalStore } from '@/app/store/useModalStore';
import type { AnalysisItem } from '@/entities/analysis/model/types';

function filterItems(items: AnalysisItem[], tab: FilterTab): AnalysisItem[] {
  if (tab === 'ALL') return items;
  if (tab === 'NOT_WRITTEN')
    return items.filter((item) => item.status === null);
  if (tab === 'COMPLETED')
    return items.filter((item) => item.status === 'COMPLETED');
  return items.filter((item) => item.status === 'IN_PROGRESS');
}

function AnalysisContent() {
  const { data } = useAnalysisQuery();
  const [activeTab, setActiveTab] = useState<FilterTab>('ALL');

  const allItems = data.items;
  const filteredItems = filterItems(allItems, activeTab);

  const counts = {
    all: allItems.length,
    notWritten: allItems.filter((i) => i.status === null).length,
    completed: allItems.filter((i) => i.status === 'COMPLETED').length,
    inProgress: allItems.filter((i) => i.status === 'IN_PROGRESS').length,
  };

  const { page, setPage, totalPages, pageNumbers, goToNext, goToPrev } =
    usePagination(filteredItems.length);

  useEffect(() => {
    setPage(1);
  }, [activeTab, setPage]);

  const offset = (page - 1) * 10;
  const currentItems = filteredItems.slice(offset, offset + 10);

  return (
    <section className="w-full max-w-[800px] mx-auto pb-20">
      <AnalysisFilterTabs
        activeTab={activeTab}
        counts={counts}
        onTabChange={setActiveTab}
      />

      {currentItems.length > 0 ? (
        <>
          <div className="flex flex-col gap-5 md:gap-3 mb-6 md:mb-10 px-4 md:px-0">
            {currentItems.map((item) => (
              <AnalysisCard key={item.id} id={item.id} content={item.content} />
            ))}
          </div>
          <div className="flex justify-center">
            <CommonPagination
              page={page}
              totalPages={totalPages}
              pageNumbers={pageNumbers}
              onPageChange={setPage}
              onNext={goToNext}
              onPrev={goToPrev}
            />
          </div>
        </>
      ) : (
        <div className="flex w-full items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-32">
          <p className="text-lg font-medium text-gray-400">질문이 없습니다.</p>
        </div>
      )}
    </section>
  );
}

export function AnalysisMain() {
  const { openModal, closeModal } = useModalStore();

  return (
    <div className="mt-10">
      <ErrorBoundary
        onError={(error) => {
          const message = isAxiosError(error)
            ? error.response?.data?.message
            : undefined;
          openModal({
            title: '불러오기 실패',
            description: message ?? '자기분석 질문을 불러오지 못했습니다.',
            buttons: [{ label: '확인', onClick: closeModal }],
          });
        }}
        fallback={<div />}
      >
        <Suspense fallback={<AnalysisListSkeleton />}>
          <AnalysisContent />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
