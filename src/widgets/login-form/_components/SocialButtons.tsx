'use client';

import Image from 'next/image';
import { memo } from 'react';

interface BaseProps {
  children: React.ReactNode;
  onClick: () => void;
  className: string;
  icon: string;
}

const BaseButton = memo(function BaseButton({
  children,
  onClick,
  className,
  icon,
}: BaseProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center w-full h-[60px] rounded-[12px] gap-3 font-medium cursor-pointer transition-all active:scale-95 ${className}`}
    >
      <Image
        src={icon}
        alt="logo"
        width={24}
        height={24}
        className="object-contain"
      />
      <span>{children}</span>
    </button>
  );
});

export const GoogleButton = memo(function GoogleButton({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <BaseButton
      onClick={onClick}
      className="bg-white border border-gray-400"
      icon="/assets/icons/google-logo.png"
    >
      구글 로그인
    </BaseButton>
  );
});
