'use client';

import Link from 'next/link';
import { User } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/entities/auth/useAuth';
import { authApi } from '@/shared/api/auth';
import { AlarmBell } from './AlarmBell';

export const UserActions = () => {
  const { data: user } = useAuth();
  const queryClient = useQueryClient();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } finally {
      queryClient.setQueryData(['auth', 'me'], null);
      router.push('/login');
    }
  };

  return (
    <div className="flex items-center gap-6">
      {user ? (
        <button
          onClick={handleLogout}
          className="font-bold leading-none hover:text-blue-600 cursor-pointer"
        >
          로그아웃
        </button>
      ) : (
        <Link href="/login" className="font-bold leading-none hover:text-blue-600">
          로그인
        </Link>
      )}

      <AlarmBell />

      <button className="hidden md:flex items-center justify-center p-1 cursor-pointer">
        <User size={24} strokeWidth={2} />
      </button>
    </div>
  );
};
