'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { TitleInput } from '@/shared/ui/title-input';
import { TiptapEditor } from '@/shared/ui/tiptap-editor';
import { Button } from '@/shared/ui/button';
import { Container } from '@/shared/ui/container';
import { isAxiosError } from 'axios';
import { useModalStore } from '@/app/store/useModalStore';
import { useCreatePostMutation } from '@/features/post-create/model/useCreatePostMutation';

export function PostWriteForm() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const { openModal, closeModal } = useModalStore();
  const { mutate: createPost, isPending } = useCreatePostMutation();

  const handleSubmit = () => {
    if (!title || !content) {
      openModal({
        title: '입력 확인',
        description: '제목과 내용을 모두 입력해주세요.',
        buttons: [{ label: '확인', onClick: closeModal }],
      });
      return;
    }

    createPost(
      { title, content },
      {
        onSuccess: (post) => {
          router.push(`/board/${post.id}`);
        },
        onError: (error) => {
          const message = isAxiosError(error)
            ? error.response?.data?.message
            : undefined; // 알수없는 에러의 대비책
          openModal({
            title: '등록 실패',
            description: message,
            buttons: [{ label: '닫기', onClick: closeModal }],
          });
        },
      },
    );
  };

  return (
    <Container>
      <div className="py-10">
        <TitleInput
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력해 주세요"
        />

        <div className="border-b border-(--color-border) mb-6" />

        <TiptapEditor
          content={content}
          onChange={setContent}
          placeholder="내용을 입력해주세요"
        />

        <div className="mt-4 flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={isPending}
            className="px-8 py-2"
          >
            {isPending ? '올리는 중...' : '올리기'}
          </Button>
        </div>
      </div>
    </Container>
  );
}
