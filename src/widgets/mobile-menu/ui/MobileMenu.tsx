'use client';

import { X, ChevronRight } from 'lucide-react';
import { Logo } from '@/shared/ui/logo/Logo';
import Link from 'next/link';
import { useAuth } from '@/entities/auth/useAuth';
import { useRouter } from 'next/navigation';

interface MobileMenuProps {
  onClose: () => void;
}

export const MobileMenu = ({ onClose }: MobileMenuProps) => {
  const { data: user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    const { authApi } = await import('@/shared/api/auth');
    const { useQueryClient } = await import('@tanstack/react-query');
    try {
      await authApi.logout();
    } finally {
      router.push('/login');
      onClose();
    }
  };

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
        <MobileMenuItem href="/contact" label="자기분석 팁" onClose={onClose} />
        <MobileMenuItem href="/board" label="커뮤니티" onClose={onClose} />
        <MobileMenuItem href="/mypage" label="마이페이지" onClose={onClose} />

        {/* 로그인/로그아웃 */}
        <div className="border-t border-gray-100 mt-4 pt-4">
          {user ? (
            <button
              onClick={handleLogout}
              className="w-full text-left py-5 text-xl font-bold text-gray-800 hover:text-main transition-colors"
            >
              로그아웃
            </button>
          ) : (
            <MobileMenuItem href="/login" label="로그인" onClose={onClose} />
          )}
        </div>
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
