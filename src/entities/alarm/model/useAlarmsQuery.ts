'use client';

import { useQuery } from '@tanstack/react-query';
import { alarmApi } from '../api/alarmApi';
import { alarmQueryKeys } from './alarmQueryKeys';

export function useAlarmsQuery(page: number) {
  return useQuery({
    queryKey: alarmQueryKeys.list(page),
    queryFn: () => alarmApi.getAlarms(page),
    staleTime: 0,
  });
}
