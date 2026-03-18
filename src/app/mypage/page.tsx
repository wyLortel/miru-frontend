'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/entities/auth/useAuth';
import { MyPageMain } from '@/widgets/mypage-main';

export default function MyPage() {
  const { data: user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user === null) {
      router.replace('/login?redirect=' + encodeURIComponent('/mypage'));
    }
  }, [user, isLoading, router]);

  if (isLoading || user === null) return null;

  return <MyPageMain />;
}
