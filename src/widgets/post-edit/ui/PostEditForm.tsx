'use client';

import { Suspense, useState } from 'react';
import { isAxiosError } from 'axios';
import { ErrorBoundary } from 'react-error-boundary';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { TitleInput } from '@/shared/ui/title-input';
import { TiptapEditor } from '@/shared/ui/tiptap-editor';
import { Button } from '@/shared/ui/button';
import { Container } from '@/shared/ui/container';
import { useModalStore } from '@/app/store/useModalStore';
import { fetchPostById } from '@/entities/post/model/api';
import { useEditPostMutation } from '@/features/post-edit/model/useEditPostMutation';

interface PostEditFormProps {
  postId: string;
}

export function PostEditForm({ postId }: PostEditFormProps) {
  const { openModal, closeModal } = useModalStore();

  return (
    <ErrorBoundary
      onError={(error) => {
        const message = isAxiosError(error) ? error.response?.data?.message : undefined;
        openModal({
          title: '불러오기 실패',
          description: message ?? '게시글을 불러오지 못했습니다.',
          buttons: [{ label: '확인', onClick: closeModal }],
        });
      }}
      fallback={<div />}
    >
      <Suspense
        fallback={
          <Container>
            <div className="py-20 text-center text-gray-400">불러오는 중...</div>
          </Container>
        }
      >
        <PostEditFormContent postId={postId} />
      </Suspense>
    </ErrorBoundary>
  );
}

function PostEditFormContent({ postId }: { postId: string }) {
  const router = useRouter();
  const { openModal, closeModal } = useModalStore();

  const { data: post } = useSuspenseQuery({
    queryKey: ['post', postId],
    queryFn: () => fetchPostById(postId),
  });

  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);

  const { mutate: editPost, isPending } = useEditPostMutation(postId);

  const handleSubmit = () => {
    if (!title || !content) {
      openModal({
        title: '입력 확인',
        description: '제목과 내용을 모두 입력해주세요.',
        buttons: [{ label: '확인', onClick: closeModal }],
      });
      return;
    }

    editPost(
      { title, content },
      {
        onSuccess: () => {
          router.replace(`/boards/${postId}`);
        },
        onError: (error) => {
          const message = isAxiosError(error)
            ? error.response?.data?.message
            : undefined;
          openModal({
            title: '수정 실패',
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

        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => router.back()}>
            취소
          </Button>
          <Button onClick={handleSubmit} disabled={isPending} className="px-8 py-2">
            {isPending ? '수정 중...' : '수정 완료'}
          </Button>
        </div>
      </div>
    </Container>
  );
}
