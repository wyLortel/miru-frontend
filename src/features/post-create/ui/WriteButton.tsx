'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/shared/ui/button';
import { useLoginRequired } from '@/shared/lib/hooks/useLoginRequired';

export function WriteButton() {
  const router = useRouter();
  const { checkAuth } = useLoginRequired();

  return (
    <Button
      variant="default"
      size="default"
      className="cursor-pointer rounded-2xl px-6"
      onClick={() => checkAuth(() => router.push('/boards/write'))}
    >
      글 쓰기
    </Button>
  );
}
