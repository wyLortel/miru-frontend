'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useModalStore } from '@/app/store/useModalStore';
import { useAuth } from '@/entities/auth/useAuth';

/**
 * 로그인이 필요한 기능을 사용할 때 호출
 * - 비로그인 상태면 모달 띄우고 로그인 페이지로 리다이렉션
 * - 로그인 상태면 callback 함수 실행
 */
export const useLoginRequired = () => {
  const { data: user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { openModal, closeModal } = useModalStore();

  const checkAuth = (callback?: () => void) => {
    if (!user) {
      // 현재 URL을 쿼리 파라미터로 전달
      const redirectUrl = `${pathname}${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
      const loginUrl = `/login?redirect=${encodeURIComponent(redirectUrl)}`;

      openModal({
        title: '로그인 필요',
        description: '로그인 후 이용 가능합니다.',
        buttons: [
          { label: '닫기', onClick: closeModal, bgColor: 'white', textColor: '#111827' },
          { label: '로그인', onClick: () => {
            closeModal();
            router.push(loginUrl);
          } },
        ],
      });
      return;
    }

    // 로그인 상태면 콜백 실행
    if (callback) {
      callback();
    }
  };

  return { checkAuth, user };
};
