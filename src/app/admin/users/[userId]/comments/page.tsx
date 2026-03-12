import { AdminUserCommentsContent } from '@/widgets/admin-user-comments';

export default async function AdminUserCommentsPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  return <AdminUserCommentsContent userId={Number(userId)} />;
}
