import { InquiryDetailPageClient } from './InquiryDetailPageClient';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function InquiryDetailPage({ params }: Props) {
  const { id } = await params;

  return <InquiryDetailPageClient id={id} />;
}
