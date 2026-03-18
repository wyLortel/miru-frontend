'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/entities/auth/useAuth';
import { PostWriteForm } from '@/widgets/post-write';

export default function BoardWritePage() {
  const { data: user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user === null) {
      router.replace('/login?redirect=' + encodeURIComponent('/boards/write'));
    }
  }, [user, isLoading, router]);

  if (isLoading || user === null) return null;

  return <PostWriteForm />;
}
