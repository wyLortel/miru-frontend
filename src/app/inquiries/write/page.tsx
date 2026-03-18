'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/entities/auth/useAuth';
import { InquiryWriteForm } from '@/widgets/inquiry';

export default function InquiryWritePage() {
  const { data: user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user === null) {
      router.replace('/login?redirect=' + encodeURIComponent('/inquiries/write'));
    }
  }, [user, isLoading, router]);

  if (isLoading || user === null) return null;

  return <InquiryWriteForm />;
}
