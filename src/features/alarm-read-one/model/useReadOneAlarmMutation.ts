'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { alarmApi } from '@/entities/alarm/api/alarmApi';
import { alarmQueryKeys } from '@/entities/alarm/model/alarmQueryKeys';

export function useReadOneAlarmMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: number) => alarmApi.readAlarm(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: alarmQueryKeys.items() });
      queryClient.invalidateQueries({ queryKey: alarmQueryKeys.hasUnread() });
    },
  });
}
