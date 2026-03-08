import { Suspense } from 'react';
import { PostEditForm } from '@/widgets/post-edit/ui/PostEditForm';

interface BoardEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function BoardEditPage({ params }: BoardEditPageProps) {
  const { id } = await params;
  return (
    <Suspense>
      <PostEditForm postId={id} />
    </Suspense>
  );
}
