import { AnalysisDetailMain } from '@/widgets/analysis-detail';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AnalysisDetailPage({ params }: Props) {
  const { id } = await params;
  return <AnalysisDetailMain id={Number(id)} />;
}
