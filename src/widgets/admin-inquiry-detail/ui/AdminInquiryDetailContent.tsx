'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { adminApi } from '@/entities/admin/api/adminApi';
import { Textarea } from '@/shared/ui/textarea';
import { Button } from '@/shared/ui/button';
import { useModalStore } from '@/app/store/useModalStore';

interface Props {
  id: number;
}

export function AdminInquiryDetailContent({ id }: Props) {
  const queryClient = useQueryClient();
  const { openModal, closeModal } = useModalStore();
  const [answer, setAnswer] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin', 'inquiry', id],
    queryFn: () => adminApi.getInquiryDetail(id),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (answerContent: string) => adminApi.postAnswer(id, answerContent),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'inquiry', id] });
    },
    onError: (err) => {
      if (isAxiosError(err) && err.response?.status === 401) return;
      const message = isAxiosError(err) ? err.response?.data?.message : undefined;
      openModal({
        title: '답변 등록 실패',
        description: message ?? '오류가 발생했습니다.',
        buttons: [{ label: '확인', onClick: closeModal }],
      });
    },
  });

  const { mutate: deleteAnswer, isPending: isDeleting } = useMutation({
    mutationFn: () => adminApi.deleteAnswer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'inquiry', id] });
    },
    onError: (err) => {
      if (isAxiosError(err) && err.response?.status === 401) return;
      const message = isAxiosError(err) ? err.response?.data?.message : undefined;
      openModal({
        title: '답변 삭제 실패',
        description: message ?? '오류가 발생했습니다.',
        buttons: [{ label: '확인', onClick: closeModal }],
      });
    },
  });

  const handleSubmit = () => {
    if (!answer.trim()) {
      openModal({
        title: '답변 내용을 입력해주세요',
        buttons: [{ label: '확인', onClick: closeModal }],
      });
      return;
    }
    openModal({
      title: '정말로 답변을 보내시겠습니까?',
      buttons: [
        { label: '취소', onClick: closeModal, bgColor: 'white', textColor: '#111827' },
        {
          label: '확인',
          onClick: () => {
            closeModal();
            mutate(answer.trim());
          },
        },
      ],
    });
  };

  if (isLoading) {
    return <p className="text-muted-foreground">불러오는 중...</p>;
  }

  if (isError || !data) {
    return <p className="text-red-500">문의 내용을 불러오지 못했습니다.</p>;
  }

  const isCompleted = data.status === 'COMPLETED';

  return (
    <div className="max-w-4xl pt-24">
      <h1 className="text-3xl font-bold mb-3">{data.title}</h1>
      <div className="flex items-center gap-4 mb-4">
        <span className="text-sm font-medium">{data.writer}</span>
        <span className="text-sm text-muted-foreground">{data.createdAt}</span>
      </div>
      <div className="mb-8">
        {isCompleted ? (
          <span className="inline-flex items-center rounded-md border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
            답변 완료
          </span>
        ) : (
          <span className="inline-flex items-center rounded-md bg-red-500 px-3 py-1 text-xs font-medium text-white">
            답변 대기
          </span>
        )}
      </div>

      <div className="mb-8">
        <p className="text-base font-bold mb-3">유저 메세지</p>
        <Textarea
          value={data.content}
          readOnly
          className="resize-none h-40"
        />
      </div>

      <div className="mb-6">
        <p className="text-base font-bold mb-3">관리자 메세지</p>
        <Textarea
          value={isCompleted ? (data.answerContent ?? '') : answer}
          readOnly={isCompleted}
          onChange={(e) => setAnswer(e.target.value)}
          className="resize-none h-40"
        />
      </div>

      {!isCompleted && (
        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={isPending} className="px-8 rounded-xl">
            답변 보내기
          </Button>
        </div>
      )}

      {isCompleted && (
        <div className="flex justify-end">
          <Button
            onClick={() =>
              openModal({
                title: '정말로 답변을 삭제하시겠습니까?',
                buttons: [
                  { label: '취소', onClick: closeModal, bgColor: 'white', textColor: '#111827' },
                  { label: '삭제', onClick: () => { closeModal(); deleteAnswer(); }, bgColor: '#ef4444', textColor: 'white' },
                ],
              })
            }
            disabled={isDeleting}
            className="px-8 rounded-xl bg-red-500 hover:bg-red-600 text-white border-0"
          >
            답변 삭제
          </Button>
        </div>
      )}
    </div>
  );
}
