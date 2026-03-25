import { Comment, Reply } from '@/entities/post/model/types';
import { RelativeTime } from '@/shared/ui/RelativeTime';
import { Card, CardContent } from '@/shared/ui/card';
import { useAdminWriter } from '@/shared/lib/hooks/useAdminWriter';

function CommentContent({ text }: { text: string }) {
  const parts = text.split(/(@\S+)/g);
  return (
    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
      {parts.map((part, i) =>
        part.startsWith('@') ? (
          <span key={i} className="text-primary font-medium">{part}</span>
        ) : (
          part
        )
      )}
    </p>
  );
}

interface CommentItemProps {
  comment: Comment | Reply;
  isReply?: boolean;
  actions?: React.ReactNode;
  ownerActions?: React.ReactNode;
  editForm?: React.ReactNode;
}

export function CommentItem({ comment, isReply = false, actions, ownerActions, editForm }: CommentItemProps) {
  const isAdmin = useAdminWriter(comment.writer);

  if (isReply) {
    return (
      <div className="flex gap-3 mt-2 ml-8 pl-4 border-l-2 border-border">
        <div className="flex-1">
          <Card variant="soft" className="gap-2 py-3">
            <CardContent className="px-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className={`font-bold ${isAdmin ? 'text-primary' : 'text-foreground'}`}>{comment.writer}</span>
                  <RelativeTime isoString={comment.createdAt} />
                </div>
                {ownerActions && <div className="flex gap-1">{ownerActions}</div>}
              </div>
              {editForm ?? <CommentContent text={comment.content} />}
              {actions}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <Card className="gap-2 py-4">
      <CardContent className="px-4 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className={`font-bold ${isAdmin ? 'text-primary' : 'text-foreground'}`}>{comment.writer}</span>
            <RelativeTime isoString={comment.createdAt} />
          </div>
          {ownerActions && <div className="flex gap-1">{ownerActions}</div>}
        </div>
        {editForm ?? <CommentContent text={comment.content} />}
        {actions}
      </CardContent>
    </Card>
  );
}
