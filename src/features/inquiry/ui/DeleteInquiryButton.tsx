'use client';

import { isAxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useDeleteInquiryMutation } from '../model/useDeleteInquiryMutation';
import { useModalStore } from '@/app/store/useModalStore';

export const DeleteInquiryButton = ({ id }: { id: string }) => {
  const { openModal, closeModal } = useModalStore();
  const router = useRouter();

  const { mutate: deleteInquiryMutation, isPending } = useDeleteInquiryMutation();

  const handleDelete = () => {
    openModal({
      title: '정말 삭제하시겠습니까?',
      description: '삭제된 문의글은 복구할 수 없습니다.',
      buttons: [
        { label: '취소', onClick: closeModal, variant: 'secondary' },
        {
          label: isPending ? '삭제 중...' : '삭제',
          bgColor: '#EF4444',
          textColor: '#FFFFFF',
          onClick: () => {
            deleteInquiryMutation(id, {
              onSuccess: () => {
                closeModal();
                router.push('/inquiries');
              },
              onError: (error) => {
                const message = isAxiosError(error) ? error.response?.data?.message : undefined;
                openModal({
                  title: '삭제 실패',
                  description: message ?? '삭제에 실패했습니다.',
                  buttons: [{ label: '확인', onClick: closeModal }],
                });
              },
            });
          },
        },
      ],
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-gray hover:text-point-red text-sm transition-colors cursor-pointer hover:underline underline-offset-4 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      삭제
    </button>
  );
};
