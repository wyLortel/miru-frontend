import { AdminUserBoardsContent } from '@/widgets/admin-user-boards';

export default async function AdminUserBoardsPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  return <AdminUserBoardsContent userId={Number(userId)} />;
}
