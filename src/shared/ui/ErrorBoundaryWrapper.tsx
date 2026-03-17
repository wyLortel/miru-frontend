import { ReactNode } from 'react';
import { isAxiosError } from 'axios';
import { ErrorBoundary } from 'react-error-boundary';
import { useRouter } from 'next/navigation';
import { useModalStore } from '@/app/store/useModalStore';

interface ErrorBoundaryWrapperProps {
  children: ReactNode;
  errorMessage: string;
  redirectTo?: string;
  // true를 반환하면 기본 모달 처리를 건너뜀, 반환하지 않으면 기본 처리 실행
  onError?: (error: unknown) => boolean | void;
}

export const ErrorBoundaryWrapper = ({
  children,
  errorMessage,
  redirectTo,
  onError,
}: ErrorBoundaryWrapperProps) => {
  const { openModal, closeModal } = useModalStore();
  const router = useRouter();

  const handleError = (error: unknown) => {
    if (onError) {
      const handled = onError(error);
      if (handled) return;
    }

    const message = isAxiosError(error)
      ? error.response?.data?.message
      : undefined;
    openModal({
      title: '불러오기 실패',
      description: message ?? errorMessage,
      buttons: [
        {
          label: '확인',
          onClick: () => {
            closeModal();
            if (redirectTo) router.push(redirectTo);
          },
        },
      ],
    });
  };

  return (
    <ErrorBoundary onError={handleError} fallback={<div />}>
      {children}
    </ErrorBoundary>
  );
};
