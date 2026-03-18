import { PostDetailPageClient } from './PostDetailPageClient';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PostDetailPage({ params }: Props) {
  const { id } = await params;

  return <PostDetailPageClient postId={id} />;
}
