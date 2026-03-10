'use client';

import { X, ChevronRight } from 'lucide-react';
import { Logo } from '@/shared/ui/logo/Logo';
import Link from 'next/link';

interface MobileMenuProps {
  onClose: () => void;
}

export const MobileMenu = ({ onClose }: MobileMenuProps) => {
  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <div className="flex h-20 items-center justify-between px-6 border-b">
        <Logo />
        <button
          onClick={onClose}
          className="p-2  cursor-pointer"
          aria-label="닫기"
        >
          <X size={32} strokeWidth={1.5} />
        </button>
      </div>

      <nav className="flex flex-col px-6 mt-4">
        <MobileMenuItem href="/analysis" label="자기분석" onClose={onClose} />
        <MobileMenuItem href="/about" label="자기분석이란?" onClose={onClose} />
        <MobileMenuItem href="/board" label="커뮤니티" onClose={onClose} />
        <MobileMenuItem href="/mypage" label="마이페이지" onClose={onClose} />
        <MobileMenuItem href="/contact" label="자기분석 팁" onClose={onClose} />
      </nav>
    </div>
  );
};

const MobileMenuItem = ({
  href,
  label,
  onClose,
}: {
  href: string;
  label: string;
  onClose: () => void;
}) => (
  <Link
    href={href}
    onClick={onClose}
    className="flex items-center justify-between py-5 border-b border-gray-100 group active:bg-gray-50"
  >
    <span className="text-xl font-bold text-gray-800 group-hover:text-main  transition-colors">
      {label}
    </span>
    <ChevronRight size={24} className="text-gray-400 group-hover:text-main " />
  </Link>
);
