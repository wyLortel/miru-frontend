'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/entities/auth/useAuth';

export default function AdminPage() {
  const { data: user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user === null) {
      router.replace('/login?redirect=' + encodeURIComponent('/admin'));
    } else if (!isLoading && user !== null) {
      router.replace('/admin/inquiries');
    }
  }, [user, isLoading, router]);

  return null;
}
