'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postQueryKeys } from '@/entities/post/model/usePostsQuery';
import { Button } from '@/shared/ui/button';
import { createComment } from '../model/api';
import { useLoginRequired } from '@/shared/lib/hooks/useLoginRequired';
import { useApiErrorModal } from '@/shared/lib/hooks/useApiErrorModal';

interface CommentFormProps {
  postId: string;
}

export function CommentForm({ postId }: CommentFormProps) {
  const [content, setContent] = useState('');
  const queryClient = useQueryClient();
  const { checkAuth } = useLoginRequired();
  const { handleError } = useApiErrorModal();

  const { mutate, isPending } = useMutation({
    mutationFn: () => createComment(postId, content, null),
    onSuccess: () => {
      setContent('');
    },
    onError: (error) => {
      handleError(error, '댓글 작성 실패');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: postQueryKeys.detail(parseInt(postId)) });
    },
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      if (content.trim() && !isPending) {
        checkAuth(() => mutate());
      }
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => checkAuth()}
        placeholder="댓글을 입력하세요. (Shift+Enter로 줄바꿈)"
        rows={3}
        className="w-full rounded-md border px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <div className="flex justify-end">
        <Button
          size="sm"
          disabled={!content.trim() || isPending}
          onClick={() => checkAuth(() => mutate())}
        >
          댓글 작성
        </Button>
      </div>
    </div>
  );
}
