interface AdminAnswerProps {
  adminName?: string;
  content?: string;
}

export const InquiryAdminAnswer = ({
  adminName,
  content,
}: AdminAnswerProps) => {
  if (!content) return null;

  return (
    <div className="mt-12 p-8 bg-gray-50 rounded-xl border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <span className="text-lg font-bold">{adminName} 관리자님 답변</span>
      </div>
      <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
        {content}
      </div>
    </div>
  );
};
