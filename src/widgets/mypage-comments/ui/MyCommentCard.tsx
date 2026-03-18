import { Card, CardContent } from '@/shared/ui/card';
import { formatDate } from '@/shared/lib/formatDate';
import type { MyComment } from '@/entities/mypage/model/types';

interface Props {
  comment: MyComment;
  onClick: () => void;
}

export function MyCommentCard({ comment, onClick }: Props) {
  return (
    <Card variant="soft" className="gap-0 py-0 cursor-pointer" onClick={onClick}>
      <CardContent className="py-4 flex flex-col gap-1">
        <p className="font-semibold text-foreground text-sm line-clamp-1">{comment.boardTitle}</p>
        <p className="text-xs text-gray-600 line-clamp-2">{comment.content}</p>
        <p className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</p>
      </CardContent>
    </Card>
  );
}
