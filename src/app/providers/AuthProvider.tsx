'use client';

import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/entities/auth/useAuth';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useModalStore, MODAL_PRIORITY } from '../store/useModalStore';
import { APP_EVENTS } from '@/shared/lib/events';
import { isValidRedirectUrl } from '@/shared/lib/validateUrl';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const qc = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const openModal = useModalStore((s) => s.openModal);
  const closeModal = useModalStore((s) => s.closeModal);
  const sessionModalShownRef = useRef(false);

  const { data: user } = useAuth();

  // 로그인 감지 후 저장된 redirect URL로 이동
  useEffect(() => {
    if (user === null) {
      sessionStorage.removeItem('adminRedirected');
      return;
    }
    if (user) {
      // 약관 미동의 유저 → /terms 강제 이동
      if (user.status === 'PENDING') {
        router.push('/terms');
        return;
      }

      // 탈퇴 계정 → 세션 만료 처리
      if (user.status === 'DELETE') {
        qc.setQueryData(['auth', 'me'], null);
        openModal({
          title: '탈퇴한 계정입니다',
          description: '다시 로그인해주세요.',
          priority: MODAL_PRIORITY.HIGH,
          buttons: [
            {
              label: '확인',
              onClick: () => {
                closeModal();
                router.push('/login');
              },
            },
          ],
        });
        return;
      }

      if (user.role === 'ADMIN') {
        localStorage.removeItem('redirectAfterLogin');
        if (!sessionStorage.getItem('adminRedirected')) {
          sessionStorage.setItem('adminRedirected', '1');
          router.push('/admin/inquiries');
        }
        return;
      }
      const redirectUrl = localStorage.getItem('redirectAfterLogin');
      if (redirectUrl && isValidRedirectUrl(redirectUrl)) {
        localStorage.removeItem('redirectAfterLogin');
        router.push(redirectUrl);
      } else if (redirectUrl) {
        localStorage.removeItem('redirectAfterLogin');
      }
    }
  }, [user, router, qc, openModal, closeModal]);

  useEffect(() => {
    const handler = () => {
      // 로그인 상태가 아니었으면 무시 (useLoginRequired가 처리)
      const cachedUser = qc.getQueryData(['auth', 'me']);
      if (!cachedUser) return;

      // 중복 방지
      if (sessionModalShownRef.current) return;
      sessionModalShownRef.current = true;

      // auth 캐시를 null로 세팅 → 헤더 즉시 로그아웃 상태 반영
      qc.setQueryData(['auth', 'me'], null);

      // 현재 URL 저장해서 로그인 후 복귀
      const redirectUrl = `${pathname}${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
      const loginUrl = `/login?redirect=${encodeURIComponent(redirectUrl)}`;

      openModal({
        title: '세션이 만료되었습니다',
        description: '다시 로그인해주세요.',
        priority: MODAL_PRIORITY.HIGH,
        buttons: [
          {
            label: '로그인',
            onClick: () => {
              sessionModalShownRef.current = false;
              closeModal();
              router.push(loginUrl);
            },
          },
        ],
      });
    };

    window.addEventListener(APP_EVENTS.AUTH_LOGOUT, handler);
    return () => window.removeEventListener(APP_EVENTS.AUTH_LOGOUT, handler);
  }, [qc, openModal, closeModal, router, pathname, searchParams]);

  // 403 "약관 동의 필요" → /terms 이동 (이미 /terms이면 생략)
  useEffect(() => {
    const handler = () => {
      if (!window.location.pathname.startsWith('/terms')) router.push('/terms');
    };
    window.addEventListener(APP_EVENTS.TERMS_REQUIRED, handler);
    return () => window.removeEventListener(APP_EVENTS.TERMS_REQUIRED, handler);
  }, [router, pathname]);

  // 403 "정지된 계정" → 모달 표시 + 로그아웃
  useEffect(() => {
    const handler = () => {
      qc.setQueryData(['auth', 'me'], null);
      openModal({
        title: '정지된 계정입니다',
        description: '계정이 정지되어 서비스를 이용할 수 없습니다.',
        priority: MODAL_PRIORITY.HIGH,
        buttons: [
          {
            label: '확인',
            onClick: () => {
              closeModal();
              router.push('/login');
            },
          },
        ],
      });
    };
    window.addEventListener(APP_EVENTS.ACCOUNT_BANNED, handler);
    return () => window.removeEventListener(APP_EVENTS.ACCOUNT_BANNED, handler);
  }, [qc, openModal, closeModal, router]);

  return <>{children}</>;
}
