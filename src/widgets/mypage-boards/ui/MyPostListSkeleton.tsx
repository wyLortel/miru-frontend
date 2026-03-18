import { Card, CardContent } from '@/shared/ui/card';

function RowSkeleton() {
  return (
    <Card variant="soft" className="gap-0 py-0">
      <CardContent className="py-4 flex flex-col gap-2">
        <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-3 w-24 animate-pulse rounded bg-muted" />
      </CardContent>
    </Card>
  );
}

export function MyPostListSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 10 }).map((_, i) => (
        <RowSkeleton key={i} />
      ))}
    </div>
  );
}
