'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/entities/auth/useAuth';
import { useRouter } from 'next/navigation';
import { useModalStore, MODAL_PRIORITY } from '../store/useModalStore';
import { APP_EVENTS } from '@/shared/lib/events';

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
        priority: MODAL_PRIORITY.HIGH,
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

    window.addEventListener(APP_EVENTS.AUTH_LOGOUT, handler);
    return () => window.removeEventListener(APP_EVENTS.AUTH_LOGOUT, handler);
  }, [qc, openModal, router]);

  return <>{children}</>;
}
