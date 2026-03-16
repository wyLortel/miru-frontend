'use client';

import { X } from 'lucide-react';
import { Logo } from '@/shared/ui/logo/Logo';

interface MobileMenuHeaderProps {
  onClose: () => void;
}

export const MobileMenuHeader = ({ onClose }: MobileMenuHeaderProps) => {
  return (
    <div className="flex h-20 items-center justify-between px-6 border-b">
      <Logo />
      <button
        onClick={onClose}
        className="p-2 cursor-pointer"
        aria-label="닫기"
      >
        <X size={32} strokeWidth={1.5} />
      </button>
    </div>
  );
};
