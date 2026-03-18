'use client';

import { useState, useEffect } from 'react';
import { PostDetail, Comment, Reply } from '@/entities/post/model/types';
import { CommentList } from '@/entities/comment/ui/CommentList';
import { CommentForm } from '@/features/comment-create/ui/CommentForm';
import { ReplyForm } from '@/features/comment-create/ui/ReplyForm';
import { DeleteCommentButton } from '@/features/comment-delete/ui/DeleteCommentButton';
import { EditCommentForm } from '@/features/comment-edit/ui/EditCommentForm';
import { Button } from '@/shared/ui/button';
import { useAuth } from '@/entities/auth/useAuth';

interface PostCommentsSectionProps {
  post: PostDetail;
  postId: string;
}

export function PostCommentsSection({ post, postId }: PostCommentsSectionProps) {
  const { data: user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  useEffect(() => setMounted(true), []);

  const isCommentOwner = (writer: string) =>
    mounted && (user?.nickname === writer || user?.role === 'ADMIN');

  return (
    <div className="max-w-4xl mx-auto px-4 pb-10">
      <h2 className="text-base font-semibold mb-4">댓글 {post.commentCount}</h2>
      <CommentForm postId={postId} />
      <div className="mt-6">
        <CommentList
          comments={post.comments}
          renderActions={(comment: Comment) => (
            <ReplyForm postId={postId} parentId={comment.id} />
          )}
          renderOwnerActions={(id: number) => {
            const comment = post.comments.find((c) => c.id === id);
            if (!comment || !isCommentOwner(comment.writer)) return null;
            return (
              <>
                <Button variant="ghost" size="sm" className="cursor-pointer hover:bg-primary/10 hover:text-primary" onClick={() => setEditingId(id)}>수정</Button>
                <DeleteCommentButton commentId={id} postId={postId} />
              </>
            );
          }}
          renderEditForm={(id: number, content: string) =>
            editingId === id ? (
              <EditCommentForm
                commentId={id}
                postId={postId}
                initialContent={content}
                onClose={() => setEditingId(null)}
              />
            ) : null
          }
          renderReplyActions={(reply: Reply, parentId: number) => (
            <ReplyForm postId={postId} parentId={parentId} mentionName={reply.writer} />
          )}
          renderReplyOwnerActions={(id: number) => {
            const reply = post.comments.flatMap((c) => c.replies).find((r) => r.id === id);
            if (!reply || !isCommentOwner(reply.writer)) return null;
            return (
              <>
                <Button variant="ghost" size="sm" className="cursor-pointer hover:bg-primary/10 hover:text-primary" onClick={() => setEditingId(id)}>수정</Button>
                <DeleteCommentButton commentId={id} postId={postId} />
              </>
            );
          }}
          renderReplyEditForm={(id: number, content: string) =>
            editingId === id ? (
              <EditCommentForm
                commentId={id}
                postId={postId}
                initialContent={content}
                onClose={() => setEditingId(null)}
              />
            ) : null
          }
        />
      </div>
    </div>
  );
}
