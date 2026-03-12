'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { alarmReadAllApi } from '../api/alarmReadAllApi';
import { alarmQueryKeys } from '@/entities/alarm/model/alarmQueryKeys';
import { HasUnreadResponse } from '@/entities/alarm/model/types';

export function useReadAllAlarmsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: alarmReadAllApi.readAll,
    onSuccess: () => {
      // 1. Immediately set hasUnread to false (separate branch, not affected by list invalidation)
      queryClient.setQueryData<HasUnreadResponse>(
        alarmQueryKeys.hasUnread(),
        { hasUnread: false }
      );

      // 2. Invalidate items parent to refresh list/infinite (hasUnread not included)
      queryClient.invalidateQueries({ queryKey: alarmQueryKeys.items() });
    },
  });
}
