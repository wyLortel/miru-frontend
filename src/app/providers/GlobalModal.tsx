'use client';

import { useEffect, useRef } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Modal } from '../../shared/ui/modal/Modal';
import { useModalStore } from '../store/useModalStore';
import { APP_EVENTS } from '@/shared/lib/events';

export const GlobalModal = () => {
  const { isOpen, title, description, buttons, closeModal, openModal } = useModalStore();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sessionModalShownRef = useRef(false);

  useEffect(() => {
    const handleAuthLogout = () => {
      // 이미 모달을 띄웠으면 다시 띄우지 않기
      if (sessionModalShownRef.current) return;
      sessionModalShownRef.current = true;

      // 현재 URL을 쿼리 파라미터로 전달
      const redirectUrl = `${pathname}${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
      const loginUrl = `/login?redirect=${encodeURIComponent(redirectUrl)}`;

      openModal({
        title: '세션 만료',
        description: '로그인 세션이 만료되었습니다.\n다시 로그인 해주세요.',
        buttons: [
          { label: '로그인', onClick: () => {
            sessionModalShownRef.current = false;
            closeModal();
            router.push(loginUrl);
          } },
        ],
      });
    };

    window.addEventListener(APP_EVENTS.AUTH_LOGOUT, handleAuthLogout);

    return () => {
      window.removeEventListener(APP_EVENTS.AUTH_LOGOUT, handleAuthLogout);
    };
  }, [openModal, closeModal, router, pathname, searchParams]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      title={title}
      description={description}
      buttons={buttons}
    />
  );
};
