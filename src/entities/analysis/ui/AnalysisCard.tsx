'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/shared/ui/card';
import type { AnalysisItem } from '../model/types';

type Props = Pick<AnalysisItem, 'id' | 'content'>;

export function AnalysisCard({ id, content }: Props) {
  const router = useRouter();

  return (
    <Card
      variant="soft"
      className="cursor-pointer gap-0 py-0"
      onClick={() => router.push(`/analysis/${id}`)}
    >
      <CardContent className="py-5">
        <p className="text-sm text-foreground">{content}</p>
      </CardContent>
    </Card>
  );
}
