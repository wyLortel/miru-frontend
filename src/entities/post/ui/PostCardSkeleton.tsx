import { Card, CardContent } from '@/shared/ui/card';

function NoticeCardSkeleton() {
  return (
    <Card variant="soft" className="flex-row items-center gap-3 py-4">
      <CardContent className="flex items-center gap-3 py-0">
        <div className="h-5 w-10 animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-56 animate-pulse rounded bg-muted" />
      </CardContent>
    </Card>
  );
}

function RegularCardSkeleton() {
  return (
    <Card variant="soft" className="gap-0 py-4">
      <CardContent className="flex flex-col gap-1.5">
        <div className="flex items-start justify-between gap-4">
          <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
          <div className="flex shrink-0 items-center gap-3">
            <div className="h-4 w-8 animate-pulse rounded bg-muted" />
            <div className="h-4 w-8 animate-pulse rounded bg-muted" />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="h-3 w-28 animate-pulse rounded bg-muted" />
          <div className="h-3 w-14 animate-pulse rounded bg-muted" />
        </div>
      </CardContent>
    </Card>
  );
}

export function PostListSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <NoticeCardSkeleton />
      <NoticeCardSkeleton />
      {Array.from({ length: 8 }).map((_, i) => (
        <RegularCardSkeleton key={i} />
      ))}
    </div>
  );
}
