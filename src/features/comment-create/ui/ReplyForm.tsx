'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/shared/ui/button';
import { postQueryKeys } from '@/entities/post/model/usePostsQuery';
import { createComment } from '../model/api';
import { useLoginRequired } from '@/shared/lib/hooks/useLoginRequired';

interface ReplyFormProps {
  postId: string;
  parentId: number;
  mentionName?: string;
}

export function ReplyForm({ postId, parentId, mentionName }: ReplyFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState('');
  const queryClient = useQueryClient();
  const { checkAuth } = useLoginRequired();

  const finalContent = mentionName ? `@${mentionName} ${content}` : content;

  const { mutate, isPending } = useMutation({
    mutationFn: () => createComment(postId, finalContent, parentId),
    onSuccess: () => {
      setContent('');
      setIsOpen(false);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: postQueryKeys.detail(parseInt(postId)) });
    },
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      if (content.trim() && !isPending) {
        mutate();
      }
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div>
        <button
          onClick={() => checkAuth(() => setIsOpen((prev) => !prev))}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          답글
        </button>
      </div>
      {isOpen && (
        <div className="flex flex-col gap-2">
          {mentionName && (
            <span className="text-xs font-medium text-primary">@{mentionName}</span>
          )}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => checkAuth()}
            placeholder="답글을 입력하세요. (Shift+Enter로 줄바꿈)"
            rows={3}
            className="w-full rounded-md border px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
              취소
            </Button>
            <Button size="sm" disabled={!content.trim() || isPending} onClick={() => mutate()}>
              작성
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
