'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { isAxiosError } from 'axios';
import { ErrorBoundaryWrapper } from '@/shared/ui/ErrorBoundaryWrapper';
import { useAnalysisQuery } from '@/entities/analysis/model/useAnalysisQuery';
import { TiptapEditor } from '@/shared/ui/tiptap-editor';
import { Button } from '@/shared/ui/button';
import { Container } from '@/shared/ui/container';
import { useLoginRequired } from '@/shared/lib/hooks/useLoginRequired';
import { useModalStore } from '@/app/store/useModalStore';
import { sanitizeHtml } from '@/shared/lib/sanitize';
import { useSubmitAnswerMutation } from '@/features/analysis-answer/model/useSubmitAnswerMutation';
import { useDeleteAnswerMutation } from '@/features/analysis-answer/model/useDeleteAnswerMutation';
import { AnalysisListSkeleton } from '@/entities/analysis/ui/AnalysisCardSkeleton';

interface Props {
  id: number;
}

function AnalysisDetailContent({ id }: Props) {
  const router = useRouter();
  const { data } = useAnalysisQuery();
  const { openModal, closeModal } = useModalStore();
  const { checkAuth, user } = useLoginRequired();

  const item = data.items.find((i) => i.id === id);

  const [mode, setMode] = useState<'view' | 'edit'>(
    item?.answerContext ? 'view' : 'edit',
  );
  const [editorContent, setEditorContent] = useState(item?.answerContext ?? '');
  const [viewContent, setViewContent] = useState(item?.answerContext ?? '');

  const { mutate: submitAnswer, isPending: isSubmitting } =
    useSubmitAnswerMutation(id);
  const { mutate: deleteAnswer, isPending: isDeleting } =
    useDeleteAnswerMutation(id);

  if (!item) {
    router.replace('/analysis');
    return null;
  }

  const handleReset = () => {
    checkAuth(() => {
      openModal({
        title: '초기화',
        description: '정말로 초기화 하시겠습니까?',
        buttons: [
          {
            label: '아니오',
            onClick: closeModal,
            bgColor: 'white',
            textColor: '#111827',
          },
          {
            label: '초기화',
            onClick: () => {
              closeModal();
              deleteAnswer(undefined, {
                onSuccess: () => {
                  router.push('/analysis');
                },
                onError: (error) => {
                  if (isAxiosError(error) && error.response?.status === 401) return;
                  const message = isAxiosError(error)
                    ? error.response?.data?.message
                    : undefined;
                  openModal({
                    title: '초기화 실패',
                    description: message ?? '오류가 발생했습니다.',
                    buttons: [{ label: '확인', onClick: closeModal }],
                  });
                },
              });
            },
            bgColor: '#ef4444',
            textColor: 'white',
          },
        ],
      });
    });
  };

  const handleSave = (status: 'IN_PROGRESS' | 'COMPLETED') => {
    checkAuth(() => {
      submitAnswer(
        { answerContext: editorContent, status },
        {
          onSuccess: () => {
            setViewContent(editorContent);
            setMode('view');
          },
          onError: (error) => {
            if (isAxiosError(error) && error.response?.status === 401) return;
            const message = isAxiosError(error)
              ? error.response?.data?.message
              : undefined;
            openModal({
              title: status === 'IN_PROGRESS' ? '임시저장 실패' : '저장 실패',
              description: message ?? '오류가 발생했습니다.',
              buttons: [{ label: '확인', onClick: closeModal }],
            });
          },
        },
      );
    });
  };

  return (
    <Container>
      <div className="py-10 pb-20">
        {/* 질문 + 우측 섹션 */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-8 gap-4 sm:gap-8">
          <h1 className="text-xl sm:text-3xl font-bold text-foreground">{item.content}</h1>

          {mode === 'edit' ? (
            <div className="flex items-start gap-3 shrink-0">
              <div className="flex flex-col gap-1">
                <span className="text-[var(--color-main)] font-bold text-sm">
                  필독
                </span>
                <Link href="/tips" className="text-sm font-medium text-gray-600 hover:underline">
                  자기분석 팁 바로 읽기!
                </Link>
              </div>
              <Image
                src="/assets/images/tip-character.webp"
                alt="팁 캐릭터"
                width={187}
                height={111}
                className="object-contain"
              />
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEditorContent(viewContent);
                setMode('edit');
              }}
              className="shrink-0"
            >
              수정
            </Button>
          )}
        </div>

        {mode === 'edit' ? (
          <>
            <div
              onFocusCapture={(e) => {
                if (!user) {
                  e.preventDefault();
                  checkAuth();
                }
              }}
            >
              <TiptapEditor
                content={editorContent}
                onChange={setEditorContent}
                placeholder="답변을 입력해주세요"
              />
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-3 min-h-[56px]">
              <Button
                variant="destructive"
                size="lg"
                onClick={handleReset}
                disabled={isDeleting || isSubmitting}
                className="rounded-2xl px-6 sm:px-10"
              >
                초기화
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => handleSave('IN_PROGRESS')}
                disabled={isSubmitting || isDeleting}
                className="rounded-2xl px-6 sm:px-10"
              >
                임시저장
              </Button>
              <Button
                size="lg"
                onClick={() => handleSave('COMPLETED')}
                disabled={isSubmitting || isDeleting}
                className="rounded-2xl px-6 sm:px-10"
              >
                작성 완료
              </Button>
            </div>
          </>
        ) : (
          <div className="w-full border border-[var(--color-border)] rounded-lg overflow-hidden bg-white">
            <div
              className="prose prose-base prose-h1:text-2xl prose-h2:text-xl max-w-none text-[var(--color-foreground)] p-10 min-h-[50vh] overflow-y-auto"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(viewContent) }}
            />
          </div>
        )}
      </div>
    </Container>
  );
}

export function AnalysisDetailMain({ id }: Props) {
  return (
    <ErrorBoundaryWrapper
      errorMessage="자기분석 정보를 불러오지 못했습니다."
      redirectTo="/analysis"
      onError={(error) => {
        if (isAxiosError(error) && error.response?.status === 401) return true;
      }}
    >
      <Suspense fallback={<AnalysisListSkeleton />}>
        <AnalysisDetailContent id={id} />
      </Suspense>
    </ErrorBoundaryWrapper>
  );
}
