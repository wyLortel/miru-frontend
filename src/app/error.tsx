'use client';

import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ reset }: ErrorProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 flex flex-col items-center justify-center gap-6">
        <div className="text-center">
          <h1 className="text-2xl text-gray-500 mb-4">문제가 발생했습니다</h1>
          <p className="text-sm text-muted-foreground mb-8 max-w-sm">
            페이지를 불러오는 중 오류가 발생했습니다. 다시 시도하거나 홈으로 돌아가세요.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={reset}
            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition"
          >
            다시 시도
          </button>
          <Link
            href="/"
            className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
          >
            홈으로
          </Link>
        </div>
      </main>
    </div>
  );
}
