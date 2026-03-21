'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { isAxiosError } from 'axios';
import { Button } from '@/shared/ui/button';
import { useModalStore } from '@/app/store/useModalStore';
import { useNicknameEditMutation } from '../model/useNicknameEditMutation';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentNickname: string;
}

export function NicknameEditModal({ isOpen, onClose, currentNickname }: Props) {
  const { openModal, closeModal } = useModalStore();
  const [inputValue, setInputValue] = useState(currentNickname);
  const [error, setError] = useState<string | null>(null);
  const { mutate, isPending } = useNicknameEditMutation();

  useEffect(() => {
    if (isOpen) {
      setInputValue(currentNickname);
      setError(null);
    }
  }, [isOpen, currentNickname]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!inputValue.trim()) return;
    mutate(inputValue.trim(), {
      onSuccess: () => {
        onClose();
      },
      onError: (err) => {
        if (isAxiosError(err) && err.response?.status === 400) {
          setError(
            err.response.data?.message ?? '이미 사용 중인 닉네임입니다.',
          );
          return;
        }
        if (isAxiosError(err) && err.response?.status === 401) return;
        const message = isAxiosError(err)
          ? err.response?.data?.message
          : undefined;
        openModal({
          title: '닉네임 변경 실패',
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
        <h3 className="text-xl font-bold text-center leading-snug">
          새로운 닉네임을 정해주세요
        </h3>
        <Image
          src="/assets/images/mypage-hero.webp"
          alt="캐릭터"
          width={500}
          height={500}
          className="w-full object-contain -mt-6"
        />
        <p className="text-xm text-muted-foreground opacity-40">
          닉네임은 최대 15자까지 입력할 수 있습니다.
        </p>
        {error && <p className="text-sm text-red-500 -mb-2">{error}</p>}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            const val = e.target.value;
            if (val.length > 15) {
              openModal({
                title: '닉네임 길이 초과',
                description: '닉네임은 최대 15자까지 입력할 수 있습니다.',
                buttons: [{ label: '확인', onClick: closeModal }],
              });
              return;
            }
            setInputValue(val);
            setError(null);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSubmit();
          }}
          className="w-full text-center text-xl font-medium tracking-widest border-b-2 border-gray-300 bg-transparent py-2 outline-none focus:border-[var(--color-main)]"
          autoFocus
        />
        <Button
          onClick={handleSubmit}
          disabled={isPending || !inputValue.trim()}
          className="self-end rounded-xl px-6"
        >
          결정
        </Button>
      </div>
    </div>
  );
}
