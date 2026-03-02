import Link from 'next/link';
import { Button } from '@/shared/ui/button';

export function WriteButton() {
  return (
    <Button
      variant="default"
      size="default"
      className="cursor-pointer rounded-2xl px-6"
      asChild
    >
      <Link href="/board/write">글 쓰기</Link>
    </Button>
  );
}
