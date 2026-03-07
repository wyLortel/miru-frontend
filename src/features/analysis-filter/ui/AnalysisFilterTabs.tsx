'use client';

import { cn } from '@/lib/utils';

export type FilterTab = 'ALL' | 'NOT_WRITTEN' | 'COMPLETED' | 'IN_PROGRESS';

interface FilterCounts {
  all: number;
  notWritten: number;
  completed: number;
  inProgress: number;
}

interface Props {
  activeTab: FilterTab;
  counts: FilterCounts;
  onTabChange: (tab: FilterTab) => void;
}

const tabs: { key: FilterTab; label: string; countKey: keyof FilterCounts }[] =
  [
    { key: 'ALL', label: '전체 질문', countKey: 'all' },
    { key: 'NOT_WRITTEN', label: '미작성 질문', countKey: 'notWritten' },
    { key: 'IN_PROGRESS', label: '작성 중인 질문', countKey: 'inProgress' },
    { key: 'COMPLETED', label: '작성 완료 질문', countKey: 'completed' },
  ];

export function AnalysisFilterTabs({ activeTab, counts, onTabChange }: Props) {
  return (
    <div className="mb-8">
      <h2 className="mb-4 text-center text-lg font-semibold">
        질문 리스트 현황
      </h2>
      <div className="mx-auto flex w-full max-w-lg gap-2">
        {tabs.map(({ key, label, countKey }) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => onTabChange(key)}
              className={cn(
                'flex flex-1 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border px-2 py-8 text-sm transition-colors',
                isActive
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-card text-foreground hover:bg-muted',
              )}
            >
              <span className="text-center font-medium leading-snug">
                {label}
              </span>
              <span
                className={cn(
                  'text-sm font-semibold',
                  isActive ? 'text-primary-foreground' : 'text-foreground',
                )}
              >
                {counts[countKey]}개
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
