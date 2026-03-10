import { Suspense } from 'react';
import { AnalysisDetailMain } from '@/widgets/analysis-detail';
import { AnalysisListSkeleton } from '@/entities/analysis/ui/AnalysisCardSkeleton';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AnalysisDetailPage({ params }: Props) {
  const { id } = await params;
  const numericId = Number(id);

  return (
    <Suspense fallback={<AnalysisListSkeleton />}>
      <AnalysisDetailMain id={numericId} />
    </Suspense>
  );
}
