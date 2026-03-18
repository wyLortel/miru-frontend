'use client';

import { useEffect, use } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Suspense } from 'react';
import { useAuth } from '@/entities/auth/useAuth';
import { PostEditForm } from '@/widgets/post-edit/ui/PostEditForm';

interface BoardEditPageProps {
  params: Promise<{ id: string }>;
}

export default function BoardEditPage({ params }: BoardEditPageProps) {
  const { data: user, isLoading } = useAuth();
  const router = useRouter();
  const paramsData = use(params);

  useEffect(() => {
    if (!isLoading && user === null) {
      router.replace('/login?redirect=' + encodeURIComponent(`/boards/${paramsData.id}/edit`));
    }
  }, [user, isLoading, router, paramsData.id]);

  if (isLoading || user === null) return null;

  return (
    <Suspense>
      <PostEditForm postId={paramsData.id} />
    </Suspense>
  );
}
