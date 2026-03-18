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
      <div className="flex items-center gap-4 text-sm text-gray-500">
        <span>{writer}</span>
        <RelativeTime isoString={createdAt} />
        <span className="flex items-center gap-1">
          <Eye className="size-4" />
          조회수 {viewCount}
        </span>
        <span className="flex items-center gap-1">
          <MessageCircle className="size-4" />
          {commentCount}
        </span>
        <span className="flex items-center gap-1">
          <Heart className="size-4" />
          {likeCount}
        </span>
        {actions && <div className="ml-auto flex gap-1">{actions}</div>}
      </div>
    </div>
  );
}
