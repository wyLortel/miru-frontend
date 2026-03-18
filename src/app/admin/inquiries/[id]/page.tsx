import { AdminInquiryDetailContent } from '@/widgets/admin-inquiry-detail';

export default async function AdminInquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AdminInquiryDetailContent id={Number(id)} />;
}
