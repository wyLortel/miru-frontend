'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/entities/auth/useAuth';
import { TermsFormContent } from '@/widgets/terms-form';

export default function TermsPage() {
  const { data: user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user === null) {
      router.replace('/login?redirect=' + encodeURIComponent('/terms'));
    }
  }, [user, isLoading, router]);

  if (isLoading || user === null) return <main className="min-h-screen" />;

  return (
    <main className="min-h-screen">
      <TermsFormContent />
    </main>
  );
}
