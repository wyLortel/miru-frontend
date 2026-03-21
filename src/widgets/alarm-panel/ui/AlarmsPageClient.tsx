'use client';

import { Suspense, useEffect, useRef, useCallback } from 'react';
import { isAxiosError } from 'axios';
import { ErrorBoundary } from 'react-error-boundary';
import { useQueryClient, InfiniteData } from '@tanstack/react-query';
import { useAlarmsInfiniteQuery } from '@/entities/alarm/model/useAlarmsInfiniteQuery';
import { alarmApi } from '@/entities/alarm/api/alarmApi';
import { alarmQueryKeys } from '@/entities/alarm/model/alarmQueryKeys';
import { AlarmsListResponse } from '@/entities/alarm/model/types';
import { useModalStore } from '@/app/store/useModalStore';
import { AlarmList } from './AlarmList';


export const AlarmsPageClient = () => {
  const { openModal, closeModal } = useModalStore();

  return (
    <ErrorBoundary
      onError={(error) => {
        const message = isAxiosError(error) ? error.response?.data?.message : undefined;
        openModal({
          title: '불러오기 실패',
          description: message ?? '알람을 불러오지 못했습니다.',
          buttons: [{ label: '확인', onClick: closeModal }],
        });
      }}
      fallback={<div />}
    >
      <Suspense fallback={<div className="flex-1 py-20 text-center text-gray-400">불러오는 중...</div>}>
        <AlarmsPageContent />
      </Suspense>
    </ErrorBoundary>
  );
};

function AlarmsPageContent() {
  const queryClient = useQueryClient();
  const { data, isLoading, hasNextPage, fetchNextPage } = useAlarmsInfiniteQuery();

  const sentinelRef = useRef<HTMLDivElement>(null);

  // Infinite scroll with IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage]);

  const items = data?.pages.flatMap((p) => p.items) ?? [];

  const handleDelete = useCallback(
    async (itemId: number) => {
      try {
        await alarmApi.readAlarm(itemId);
        queryClient.setQueryData<InfiniteData<AlarmsListResponse>>(alarmQueryKeys.infinite(), (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              items: page.items.filter((item) => item.id !== itemId),
            })),
          };
        });
        // 헤더의 빨간 점도 업데이트 (읽지 않은 알람이 남아있으면 true, 없으면 false)
        const remainingAlarms = queryClient.getQueryData<InfiniteData<AlarmsListResponse>>(alarmQueryKeys.infinite());
        const hasUnread = remainingAlarms?.pages?.some((p) => p.items.some((item) => !item.isRead)) ?? false;
        queryClient.setQueryData(alarmQueryKeys.hasUnread(), { hasUnread });
      } catch (error) {
        console.error('Failed to read alarm:', error);
      }
    },
    [queryClient]
  );

  return (
    <div className="flex flex-col h-full">
      {/* List */}
      <div className="flex-1">
        <AlarmList items={items} isLoading={isLoading} isEmpty={items.length === 0 && !isLoading} onDelete={handleDelete} />
      </div>

      {/* Sentinel for infinite scroll */}
      {hasNextPage && <div ref={sentinelRef} className="h-4" />}
    </div>
  );
}
