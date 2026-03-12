'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAlarmsInfiniteQuery } from '@/entities/alarm/model/useAlarmsInfiniteQuery';
import { useHasUnreadQuery } from '@/entities/alarm/model/useHasUnreadQuery';
import { useReadAllAlarmsMutation } from '@/features/alarm-read-all/model/useReadAllAlarmsMutation';
import { alarmQueryKeys } from '@/entities/alarm/model/alarmQueryKeys';
import { AlarmList } from './AlarmList';

export const AlarmsPageClient = () => {
  const queryClient = useQueryClient();
  const { data: unreadData } = useHasUnreadQuery();
  const { data, isLoading, hasNextPage, fetchNextPage } = useAlarmsInfiniteQuery();
  const { mutate: readAll, isPending } = useReadAllAlarmsMutation();

  const sentinelRef = useRef<HTMLDivElement>(null);

  // Call read-all once when page has unread alarms
  useEffect(() => {
    if (unreadData?.hasUnread) {
      readAll();
    }
  }, [unreadData?.hasUnread, readAll]);

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
  const hasItems = items.length > 0;

  const handleDelete = useCallback(
    (itemId: number) => {
      queryClient.setQueryData(alarmQueryKeys.infinite(), (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            items: page.items.filter((item: any) => item.id !== itemId),
          })),
        };
      });
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
};
