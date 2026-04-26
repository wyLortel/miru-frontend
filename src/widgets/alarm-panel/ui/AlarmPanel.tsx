'use client';

import { useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { isAxiosError } from 'axios';
import { ErrorBoundary } from 'react-error-boundary';
import { useAlarmsQuery } from '@/entities/alarm/model/useAlarmsQuery';
import { useReadAllAlarmsMutation } from '@/features/alarm-read-all/model/useReadAllAlarmsMutation';
import { useReadOneAlarmMutation } from '@/features/alarm-read-one';
import { useModalStore } from '@/app/store/useModalStore';
import { AlarmList } from './AlarmList';

interface AlarmPanelProps {
  onNavigateToFull?: () => void;
}

export const AlarmPanel = ({ onNavigateToFull }: AlarmPanelProps) => {
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
        <AlarmPanelContent onNavigateToFull={onNavigateToFull} />
      </Suspense>
    </ErrorBoundary>
  );
};

function AlarmPanelContent({ onNavigateToFull }: AlarmPanelProps) {
  const router = useRouter();
  const { data, isLoading } = useAlarmsQuery(0);
  const { mutate: readAll, isPending } = useReadAllAlarmsMutation();
  const { mutate: deleteAlarm } = useReadOneAlarmMutation();

  const handleNavigateToFull = () => {
    onNavigateToFull?.();
    router.push('/alarms');
  };

  const items = data?.items ?? [];
  const hasItems = items.length > 0;

  const handleDelete = (itemId: number) => {
    deleteAlarm(itemId);
  };

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
        <div className="border-t border-gray-200 px-4 py-3">
          <p className="text-xs text-gray-500 text-center mb-2">
            패널에서는 10개까지만 표시됩니다.
          </p>
          <button
            onClick={handleNavigateToFull}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium block text-center w-full"
          >
            더 많은 알람 보기
          </button>
        </div>
      )}
    </div>
  );
}
