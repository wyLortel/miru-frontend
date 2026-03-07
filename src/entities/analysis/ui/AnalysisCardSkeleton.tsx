import { Card, CardContent } from '@/shared/ui/card';

function CardSkeleton() {
  return (
    <Card variant="soft" className="gap-0 py-0">
      <CardContent className="py-5">
        <div className="h-5 w-2/3 animate-pulse rounded bg-muted" />
      </CardContent>
    </Card>
  );
}

export function AnalysisListSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[800px] flex flex-col gap-3 pb-20">
      {Array.from({ length: 10 }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
