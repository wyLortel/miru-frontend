'use client';

import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useAlarmsQuery } from '@/entities/alarm/model/useAlarmsQuery';
import { useReadAllAlarmsMutation } from '@/features/alarm-read-all/model/useReadAllAlarmsMutation';
import { alarmQueryKeys } from '@/entities/alarm/model/alarmQueryKeys';
import { AlarmList } from './AlarmList';

export const AlarmPanel = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useAlarmsQuery(0);
  const { mutate: readAll, isPending } = useReadAllAlarmsMutation();

  const items = data?.items ?? [];
  const hasItems = items.length > 0;

  const handleDelete = useCallback(
    (itemId: number) => {
      queryClient.setQueryData(alarmQueryKeys.list(0), (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          items: oldData.items.filter((item: any) => item.id !== itemId),
        };
      });
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
};
