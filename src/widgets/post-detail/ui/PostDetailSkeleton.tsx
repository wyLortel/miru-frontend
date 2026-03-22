import { Card, CardContent } from '@/shared/ui/card';

export function PostDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {/* Header 영역 */}
      <div className="mb-8">
        {/* 제목 */}
        <div className="h-8 w-3/4 animate-pulse rounded bg-gray-200 mb-4" />

        {/* 메타 정보 */}
        <div className="flex items-center gap-4 mb-4">
          <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
        </div>

        {/* 액션 버튼 영역 */}
        <div className="flex gap-2">
          <div className="h-8 w-12 animate-pulse rounded bg-gray-200" />
          <div className="h-8 w-12 animate-pulse rounded bg-gray-200" />
        </div>
      </div>

      {/* Divider */}
      <div className="border-b border-gray-200 mb-8" />

      {/* 본문 영역 */}
      <div className="space-y-3 mb-10">
        <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
      </div>

      {/* 하단 액션 영역 */}
      <div className="flex gap-3">
        <div className="h-8 w-16 animate-pulse rounded bg-gray-200" />
        <div className="h-8 w-20 animate-pulse rounded bg-gray-200" />
      </div>
    </div>
  );
}
