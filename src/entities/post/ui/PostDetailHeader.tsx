import { RelativeTime } from '@/shared/ui/RelativeTime';
import { Eye, MessageCircle, Heart } from 'lucide-react';

interface PostDetailHeaderProps {
  title: string;
  writer: string;
  viewCount: number;
  commentCount: number;
  likeCount: number;
  createdAt: string;
  actions?: React.ReactNode;
}

export function PostDetailHeader({
  title,
  writer,
  viewCount,
  commentCount,
  likeCount,
  createdAt,
  actions,
}: PostDetailHeaderProps) {
  return (
    <div className="border-b pb-6 mb-6">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      <div className="flex flex-col min-[480px]:flex-row min-[480px]:items-center gap-3 text-sm text-gray-500">
        <div className="flex flex-wrap items-center gap-3">
          <span className="whitespace-nowrap">{writer}</span>
          <RelativeTime isoString={createdAt} />
          <span className="flex items-center gap-1 whitespace-nowrap">
            <Eye className="size-4" />
            조회수 {viewCount}
          </span>
          <span className="flex items-center gap-1 whitespace-nowrap">
            <MessageCircle className="size-4" />
            {commentCount}
          </span>
          <span className="flex items-center gap-1 whitespace-nowrap">
            <Heart className="size-4" />
            {likeCount}
          </span>
        </div>
        {actions && <div className="flex gap-3 min-[480px]:ml-auto shrink-0">{actions}</div>}
      </div>
    </div>
  );
}
