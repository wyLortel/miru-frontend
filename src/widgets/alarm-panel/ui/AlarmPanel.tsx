'use client';

import Link from 'next/link';
import { Suspense, useCallback } from 'react';
import { isAxiosError } from 'axios';
import { ErrorBoundary } from 'react-error-boundary';
import { useQueryClient } from '@tanstack/react-query';
import { useAlarmsQuery } from '@/entities/alarm/model/useAlarmsQuery';
import { useReadAllAlarmsMutation } from '@/features/alarm-read-all/model/useReadAllAlarmsMutation';
import { alarmApi } from '@/entities/alarm/api/alarmApi';
import { alarmQueryKeys } from '@/entities/alarm/model/alarmQueryKeys';
import { useModalStore } from '@/app/store/useModalStore';
import { AlarmList } from './AlarmList';

export const AlarmPanel = () => {
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
      <Suspense fallback={<div className="w-96 flex flex-col max-h-[480px] items-center justify-center text-gray-400">불러오는 중...</div>}>
        <AlarmPanelContent />
      </Suspense>
    </ErrorBoundary>
  );
};

function AlarmPanelContent() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useAlarmsQuery(0);
  const { mutate: readAll, isPending } = useReadAllAlarmsMutation();

  const items = data?.items ?? [];
  const hasItems = items.length > 0;

  const handleDelete = useCallback(
    async (itemId: number) => {
      try {
        await alarmApi.readAlarm(itemId);
        queryClient.setQueryData(alarmQueryKeys.list(0), (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            items: oldData.items.filter((item: any) => item.id !== itemId),
          };
        });
        // 헤더의 빨간 점도 업데이트
        const updatedData = queryClient.getQueryData(alarmQueryKeys.list(0)) as any;
        const hasUnread = updatedData?.items?.some((item: any) => !item.isRead) ?? false;
        queryClient.setQueryData(alarmQueryKeys.hasUnread(), { hasUnread });
      } catch (error) {
        console.error('Failed to read alarm:', error);
      }
    },
    [queryClient]
  );

  return (
    <div className="w-96 flex flex-col max-h-[480px]">
      {/* Header */}
      <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <h2 className="font-bold text-sm">알람</h2>
        {hasItems && (
          <button
            onClick={() => readAll()}
            disabled={isPending || isLoading}
            className="text-xs text-blue-600 hover:text-blue-700 disabled:text-gray-400 font-medium"
          >
            전체 읽음
          </button>
        )}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        <AlarmList items={items} isLoading={isLoading} isEmpty={!hasItems && !isLoading} onDelete={handleDelete} />
      </div>

      {/* Footer */}
      {hasItems && (
        <div className="border-t border-gray-200 p-3">
          <Link
            href="/alarms"
            className="text-xs text-blue-600 hover:text-blue-700 font-medium block text-center"
          >
            전체 알람 보기
          </Link>
        </div>
      )}
    </div>
  );
}
