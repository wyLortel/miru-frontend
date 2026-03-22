'use client';

import Link from 'next/link';
import { User } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/entities/auth/useAuth';
import { authApi } from '@/shared/api/auth';
import { AlarmBell } from './AlarmBell';
import { useLoginRequired } from '@/shared/lib/hooks/useLoginRequired';

export const UserActions = () => {
  const { data: user } = useAuth();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { checkAuth } = useLoginRequired();

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } finally {
      queryClient.setQueryData(['auth', 'me'], null);
      router.push('/login');
    }
  };

  return (
    <div className="flex items-center gap-8">
      {user ? (
        <button
          onClick={handleLogout}
          className="font-bold leading-none hover:text-blue-600 cursor-pointer max-[380px]:hidden"
        >
          로그아웃
        </button>
      ) : (
        <Link href="/login" className="font-bold leading-none hover:text-blue-600 max-[380px]:hidden">
          로그인
        </Link>
      )}

      <AlarmBell />

      <button
        className="hidden md:flex items-center justify-center p-1 cursor-pointer"
        onClick={() => checkAuth(() => router.push('/mypage'))}
        aria-label="마이페이지"
      >
        <User size={24} strokeWidth={2} />
      </button>
    </div>
  );
};
