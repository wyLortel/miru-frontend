'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { alarmApi } from '@/entities/alarm/api/alarmApi';
import { alarmQueryKeys } from '@/entities/alarm/model/alarmQueryKeys';

const InquiryDetailWidget = dynamic(
  () => import('@/widgets/inquiry/ui/InquiryDetailWidget').then(m => ({ default: m.InquiryDetailWidget }))
);

export function InquiryDetailPageClient({ id }: { id: string }) {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  useEffect(() => {
    const alarmId = searchParams.get('alarmId');
    if (alarmId) {
      alarmApi.readAlarm(Number(alarmId))
        .then(() => {
          queryClient.invalidateQueries({ queryKey: alarmQueryKeys.hasUnread() });
          queryClient.invalidateQueries({ queryKey: alarmQueryKeys.items() });
        })
        .catch(error => {
          console.error('Failed to read alarm:', error);
        });
    }
  }, [searchParams, queryClient]);

  return <InquiryDetailWidget id={id} />;
}
