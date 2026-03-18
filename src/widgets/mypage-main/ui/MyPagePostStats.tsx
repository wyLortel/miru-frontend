'use client';

import { useRouter } from 'next/navigation';
import { useMypageQuery } from '@/entities/mypage/model/useMypageQuery';

export function MyPagePostStats() {
  const { data } = useMypageQuery();
  const router = useRouter();

  const stats = [
    { label: '작성 글', count: data.postStats.articleCount, href: '/mypage/boards' },
    { label: '작성 댓글', count: data.postStats.commentCount, href: '/mypage/comments' },
  ];

  return (
    <div className="w-full">
      <h2 className="text-lg font-bold mb-3">작성글</h2>
      <div className="grid grid-cols-2 gap-3">
        {stats.map((s) => (
          <button
            key={s.label}
            onClick={() => router.push(s.href)}
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
