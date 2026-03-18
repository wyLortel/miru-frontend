'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Button } from '@/shared/ui/button';
import { apiClient } from '@/shared/api/apiClient';
import { useModalStore } from '@/app/store/useModalStore';

interface DeletePostButtonProps {
  postId: string;
}

export function DeletePostButton({ postId }: DeletePostButtonProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { openModal, closeModal } = useModalStore();

  const { mutate, isPending } = useMutation({
    mutationFn: () => apiClient.delete(`/api/boards/${postId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      router.push('/boards');
    },
  });

  const handleClick = () => {
    openModal({
      title: '게시글 삭제',
      description: '정말로 삭제하시겠습니까?',
      buttons: [
        { label: '취소', onClick: closeModal, variant: 'secondary' },
        {
          label: '삭제',
          onClick: () => {
            closeModal();
            mutate();
          },
          bgColor: '#ff5f5f',
          textColor: '#ffffff',
        },
      ],
    });
  };

  return (
    <Button variant="ghost" size="sm" className="cursor-pointer hover:bg-primary/10 hover:text-primary" disabled={isPending} onClick={handleClick}>
      삭제
    </Button>
  );
}
