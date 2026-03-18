'use client';

import { useRouter } from 'next/navigation';
import { useAnalysisQuery } from '@/entities/analysis/model/useAnalysisQuery';

export function MyPageAnalysisStats() {
  const { data } = useAnalysisQuery();
  const router = useRouter();
  const items = data.items;

  const stats = [
    { label: '미작성', count: items.filter((i) => i.status === null).length },
    { label: '작성중', count: items.filter((i) => i.status === 'IN_PROGRESS').length },
    { label: '작성 완료', count: items.filter((i) => i.status === 'COMPLETED').length },
  ];

  return (
    <div className="w-full">
      <h2 className="text-lg font-bold mb-3">자기분석</h2>
      <div className="grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <button
            key={s.label}
            onClick={() => router.push('/analysis')}
            className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-5 gap-1 hover:shadow-md transition-shadow cursor-pointer"
          >
            <span className="text-xs text-muted-foreground">{s.label}</span>
            <span className="text-2xl font-bold text-foreground">{s.count}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
