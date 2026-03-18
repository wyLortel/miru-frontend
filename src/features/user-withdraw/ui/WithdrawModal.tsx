'use client';

import Image from 'next/image';
import { isAxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { Button } from '@/shared/ui/button';
import { useModalStore } from '@/app/store/useModalStore';
import { useWithdrawMutation } from '../model/useWithdrawMutation';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function WithdrawModal({ isOpen, onClose }: Props) {
  const { openModal, closeModal } = useModalStore();
  const { mutate, isPending } = useWithdrawMutation();
  const router = useRouter();

  if (!isOpen) return null;

  const handleWithdraw = () => {
    mutate(undefined, {
      onSuccess: () => {
        alert('회원 탈퇴가 완료되었습니다. 그동안 이용해주셔서 감사합니다.');
        router.push('/analysis');
      },
      onError: (err) => {
        if (isAxiosError(err) && err.response?.status === 401) return;
        const message = isAxiosError(err)
          ? err.response?.data?.message
          : undefined;
        openModal({
          title: '회원탈퇴 실패',
          description: message ?? '오류가 발생했습니다.',
          buttons: [{ label: '확인', onClick: closeModal }],
        });
      },
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[400px] mx-4 rounded-3xl bg-white px-10 pt-8 pb-8 flex flex-col items-center gap-1"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <h3 className="text-xl font-bold mb-1">회원탈퇴 하시겠습니까?</h3>
          <p className="text-sm text-muted-foreground">
            언제나 다시 기다리고 있겠습니다
          </p>
        </div>
        <Image
          src="/assets/images/withdrawal-hero.png"
          alt="회원탈퇴 캐릭터"
          width={400}
          height={400}
          className="w-full object-contain"
        />
        <div className="flex gap-3 w-full mt-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isPending}
            className="flex-1 rounded-xl"
          >
            취소
          </Button>
          <Button
            onClick={handleWithdraw}
            disabled={isPending}
            className="flex-1 rounded-xl bg-red-500 hover:bg-red-600 text-white border-0"
          >
            탈퇴
          </Button>
        </div>
      </div>
    </div>
  );
}
