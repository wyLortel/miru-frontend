'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Pencil } from 'lucide-react';
import { useAuth } from '@/entities/auth/useAuth';
import { NicknameEditModal } from '@/features/nickname-edit';

export function MyPageProfile() {
  const { data: user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-3">
        <span className="text-4xl font-bold text-foreground">
          {user.nickname}
        </span>
        <button
          onClick={() => setIsModalOpen(true)}
          aria-label="닉네임 변경"
          className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
        >
          <Pencil size={24} />
        </button>
      </div>
      <p className="text-base text-muted-foreground mt-1">일본 취업 희망자</p>
      <Image
        src="/assets/images/mypage-hero.png"
        alt="마이페이지 캐릭터"
        width={700}
        height={700}
        className="w-[700px] max-w-full object-contain -my-14 pointer-events-none"
      />

      <NicknameEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentNickname={user.nickname}
      />
    </div>
  );
}
