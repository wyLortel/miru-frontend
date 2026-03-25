import { isAxiosError } from 'axios';
import { useModalStore } from '@/app/store/useModalStore';

export function useApiErrorModal() {
  const { openModal, closeModal } = useModalStore();

  const handleError = (error: unknown, title?: string) => {
    const message = isAxiosError(error) ? error.response?.data?.message : undefined;
    openModal({
      title: title ?? '오류가 발생했습니다.',
      description: message ?? '요청 처리 중 문제가 발생했습니다.',
      buttons: [{ label: '확인', onClick: closeModal }],
    });
  };

  return { handleError };
}
