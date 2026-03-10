import { Badge } from '@/shared/ui/badge';
import { InquiryAdminAnswer } from './InquiryAdminAnswer';
import { DeleteInquiryButton } from '@/features/inquiry/ui/DeleteInquiryButton';
import { InquiryDetailItem } from '@/features/inquiry/model/types';
import { formatDateTime } from '@/shared/lib/formatDate';
import { sanitizeHtml } from '@/shared/lib/sanitize';

export const InquiryDetailSection = ({
  data,
  id,
}: {
  data: InquiryDetailItem;
  id: string;
}) => {
  const statusConfig = {
    WAITING: { label: '답변대기', className: 'bg-point-red text-white' },
    COMPLETED: { label: '답변완료', className: 'bg-main text-white' },
  };
  const currentStatus = statusConfig[data.status];

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="mb-8 border-b pb-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold">{data.title}</h1>
          {/* 삭제 버튼 피처 배치 */}
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <p className="text-gray-400 text-sm">{formatDateTime(data.createdAt)}</p>
            <Badge
              className={`h-6 px-3 text-xs font-bold rounded-md border-none ${currentStatus.className}`}
            >
              {currentStatus.label}
            </Badge>
          </div>
          <DeleteInquiryButton id={id} />
        </div>
      </div>

      {/* 본문 내용 */}
      <div
        className="min-h-75 text-lg leading-loose mb-10 prose prose-base max-w-none"
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(data.content) }}
      />

      {/* 운영자 답변 컴포넌트 */}
      <InquiryAdminAnswer
        adminName={data.answer?.adminName}
        content={data.answer?.content}
      />
    </div>
  );
};
