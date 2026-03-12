'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/entities/auth/useAuth';
import { alarmApi } from '../api/alarmApi';
import { alarmQueryKeys } from './alarmQueryKeys';

export function useHasUnreadQuery() {
  const { data: user } = useAuth();

  return useQuery({
    queryKey: alarmQueryKeys.hasUnread(),
    queryFn: alarmApi.getHasUnread,
    enabled: !!user,
    refetchInterval: 30_000, // Poll every 30 seconds
    staleTime: 0,
    refetchOnWindowFocus: false,
  });
}
