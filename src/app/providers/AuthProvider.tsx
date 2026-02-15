'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/entities/auth/useAuth';
import { useRouter } from 'next/navigation';
import { useModalStore } from '../store/useModalStore';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const qc = useQueryClient();
  const router = useRouter();
  const openModal = useModalStore((s) => s.openModal);

  useAuth();

  useEffect(() => {
    const handler = () => {
      // auth 캐시 삭제
      qc.removeQueries({ queryKey: ['auth', 'me'] });

      // 세션 만료 모달 띄우기
      openModal({
        title: '세션이 만료되었습니다',
        description: '다시 로그인해주세요.',
        buttons: [
          {
            label: '로그인',
            onClick: () => {
              router.push('/login');
            },
          },
        ],
      });
    };

    window.addEventListener('auth:logout', handler);
    return () => window.removeEventListener('auth:logout', handler);
  }, [qc, openModal, router]);

  return <>{children}</>;
}
