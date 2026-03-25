'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/shared/ui/button';
import { postQueryKeys } from '@/entities/post/model/usePostsQuery';
import { editComment } from '@/features/comment-create/model/api';
import { useApiErrorModal } from '@/shared/lib/hooks/useApiErrorModal';

interface EditCommentFormProps {
  commentId: number;
  postId: string;
  initialContent: string;
  onClose: () => void;
}

export function EditCommentForm({ commentId, postId, initialContent, onClose }: EditCommentFormProps) {
  const [content, setContent] = useState(initialContent);
  const queryClient = useQueryClient();
  const { handleError } = useApiErrorModal();

  const { mutate, isPending } = useMutation({
    mutationFn: () => editComment(commentId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postQueryKeys.detail(parseInt(postId)) });
      onClose();
    },
    onError: (error) => {
      handleError(error, '댓글 수정 실패');
    },
  });

  return (
    <div className="flex flex-col gap-2 mt-2">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring"
        rows={3}
      />
      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={onClose} disabled={isPending}>
          취소
        </Button>
        <Button size="sm" onClick={() => mutate()} disabled={isPending || !content.trim()}>
          저장
        </Button>
      </div>
    </div>
  );
}
