import { Card, CardContent } from '@/shared/ui/card';

export function InquiryDetailSkeleton() {
  return (
    <div className="max-w-[800px] mx-auto">
      {/* 제목 영역 */}
      <Card variant="soft" className="gap-0 py-6 px-6 mb-6">
        <CardContent className="flex flex-col gap-4 py-0">
          <div className="h-6 w-3/4 animate-pulse rounded bg-muted" />
          <div className="flex items-center gap-4">
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
            <div className="h-4 w-20 animate-pulse rounded bg-muted" />
          </div>
        </CardContent>
      </Card>

      {/* 상태 배지 및 메타 정보 */}
      <div className="mb-6 flex items-center gap-3">
        <div className="h-6 w-16 animate-pulse rounded-full bg-muted" />
        <div className="h-4 w-32 animate-pulse rounded bg-muted" />
      </div>

      {/* 본문 영역 */}
      <Card variant="soft" className="gap-0 py-6 px-6">
        <CardContent className="flex flex-col gap-3 py-0">
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
        </CardContent>
      </Card>
    </div>
  );
}
