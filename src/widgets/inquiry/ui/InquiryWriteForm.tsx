'use client';

import { isAxiosError } from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateInquiryMutation } from '@/features/inquiry/model/useCreateInquiryMutation';
import { Button } from '@/shared/ui/button';
import { TitleInput } from '@/shared/ui/title-input';
import { TiptapEditor } from '@/shared/ui/tiptap-editor';
import { Container } from '@/shared/ui/container';
import { useModalStore } from '@/app/store/useModalStore';

export function InquiryWriteForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const router = useRouter();

  // 1. 모달 제어 함수 가져오기
  const { openModal, closeModal } = useModalStore();

  // 2. mutation 훅 사용
  const { mutate: createInquiryMutation, isPending } = useCreateInquiryMutation();

  const handleSubmit = () => {
    if (!title || !content) {
      openModal({
        title: '입력 확인',
        description: '제목과 내용을 모두 입력해주세요.',
        buttons: [{ label: '확인', onClick: closeModal, variant: 'primary' }],
      });
      return;
    }

    createInquiryMutation(
      { title, content },
      {
        onSuccess: () => {
          router.push('/inquiries');
        },
        onError: (error) => {
          const message = isAxiosError(error)
            ? error.response?.data?.message
            : undefined;
          openModal({
            title: '등록 실패',
            description: message ?? '등록에 실패했습니다.',
            buttons: [{ label: '확인', onClick: closeModal }],
          });
        },
      }
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
          placeholder="문의 내용을 입력해주세요"
          content={content}
          onChange={setContent}
        />
        <div className="mt-4 flex justify-end">
          <Button
            className="cursor-pointer px-8 py-2"
            onClick={handleSubmit}
            disabled={isPending}
          >
            {isPending ? '등록 중...' : '올리기'}
          </Button>
        </div>
      </div>
    </Container>
  );
}
