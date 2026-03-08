import { Comment, Reply } from '@/entities/post/model/types';
import { CommentItem } from './CommentItem';

interface CommentListProps {
  comments: Comment[];
  renderActions?: (comment: Comment) => React.ReactNode;
  renderOwnerActions?: (id: number) => React.ReactNode;
  renderEditForm?: (id: number, content: string) => React.ReactNode;
  renderReplyActions?: (reply: Reply, parentId: number) => React.ReactNode;
  renderReplyOwnerActions?: (id: number) => React.ReactNode;
  renderReplyEditForm?: (id: number, content: string) => React.ReactNode;
}

export function CommentList({
  comments,
  renderActions,
  renderOwnerActions,
  renderEditForm,
  renderReplyActions,
  renderReplyOwnerActions,
  renderReplyEditForm,
}: CommentListProps) {
  if (comments.length === 0) {
    return <p className="py-10 text-center text-sm text-gray-400">첫 번째 댓글을 남겨보세요.</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      {comments.map((comment) => (
        <div key={comment.id}>
          <CommentItem
            comment={comment}
            actions={renderActions?.(comment)}
            ownerActions={renderOwnerActions?.(comment.id)}
            editForm={renderEditForm?.(comment.id, comment.content)}
          />
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              isReply
              actions={renderReplyActions?.(reply, comment.id)}
              ownerActions={renderReplyOwnerActions?.(reply.id)}
              editForm={renderReplyEditForm?.(reply.id, reply.content)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
