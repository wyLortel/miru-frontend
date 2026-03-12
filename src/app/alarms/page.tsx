'use client';

import Link from 'next/link';
import { useAlarmsInfiniteQuery } from '@/entities/alarm/model/useAlarmsInfiniteQuery';
import { useReadAllAlarmsMutation } from '@/features/alarm-read-all/model/useReadAllAlarmsMutation';
import { AlarmsPageClient } from '@/widgets/alarm-panel/ui/AlarmsPageClient';

export default function AlarmsPage() {
  const { data } = useAlarmsInfiniteQuery();
  const { mutate: readAll, isPending } = useReadAllAlarmsMutation();

  const items = data?.pages.flatMap((p) => p.items) ?? [];
  const hasItems = items.length > 0;

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="border-b border-gray-200 px-4 py-4 sticky top-0 bg-white z-10">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-2xl hover:opacity-70">
              ←
            </Link>
            <h1 className="font-bold text-lg">알람</h1>
          </div>
          {hasItems && (
            <button
              onClick={() => readAll()}
              disabled={isPending}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white text-xs font-medium rounded transition whitespace-nowrap"
            >
              모두 지우기
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <AlarmsPageClient />
      </div>
    </div>
  );
}
