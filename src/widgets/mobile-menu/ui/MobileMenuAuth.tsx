'use client';

import Link from 'next/link';
import { useAuth } from '@/entities/auth/useAuth';
import { useRouter } from 'next/navigation';

interface MobileMenuAuthProps {
  onClose: () => void;
}

export const MobileMenuAuth = ({ onClose }: MobileMenuAuthProps) => {
  const { data: user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    const { authApi } = await import('@/shared/api/auth');
    try {
      await authApi.logout();
    } finally {
      router.push('/login');
      onClose();
    }
  };

  if (!user) {
    return (
      <div className="border-t border-gray-100 mt-4 pt-4">
        <Link
          href="/login"
          onClick={onClose}
          className="block py-5 text-xl font-bold text-gray-800 hover:text-main transition-colors"
        >
          로그인
        </Link>
      </div>
    );
  }

  return (
    <div className="border-t border-gray-100 mt-4 pt-4">
      <button
        onClick={handleLogout}
        className="w-full text-left py-5 text-xl font-bold text-gray-800 hover:text-main transition-colors"
      >
        로그아웃
      </button>
    </div>
  );
};
