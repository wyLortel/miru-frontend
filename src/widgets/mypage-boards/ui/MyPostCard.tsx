import { Card, CardContent } from '@/shared/ui/card';
import { formatDate } from '@/shared/lib/formatDate';
import type { MyPost } from '@/entities/mypage/model/types';

interface Props {
  post: MyPost;
  onClick: () => void;
}

export function MyPostCard({ post, onClick }: Props) {
  return (
    <Card variant="soft" className="gap-0 py-0 cursor-pointer" onClick={onClick}>
      <CardContent className="py-4 flex flex-col gap-1">
        <p className="font-semibold text-foreground line-clamp-1">{post.title}</p>
        <p className="text-xs text-muted-foreground">{formatDate(post.createdAt)}</p>
      </CardContent>
    </Card>
  );
}
