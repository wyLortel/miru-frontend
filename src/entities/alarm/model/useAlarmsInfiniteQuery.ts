'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { alarmApi } from '../api/alarmApi';
import { alarmQueryKeys } from './alarmQueryKeys';

export function useAlarmsInfiniteQuery() {
  return useInfiniteQuery({
    queryKey: alarmQueryKeys.infinite(),
    queryFn: ({ pageParam }) => alarmApi.getAlarms(pageParam as number),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      // Calculate actual fetched count from all pages
      const fetchedCount = allPages.reduce((sum, p) => sum + p.items.length, 0);
      // Has more if fetched < total
      return fetchedCount < lastPage.totalCount ? allPages.length : undefined;
    },
    staleTime: 0,
  });
}
