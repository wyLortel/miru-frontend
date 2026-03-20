'use client';

import { Modal } from '../../shared/ui/modal/Modal';
import { useModalStore } from '../store/useModalStore';

export const GlobalModal = () => {
  const { isOpen, title, description, buttons, closeModal, backdropAction } = useModalStore();

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      title={title}
      description={description}
      buttons={buttons}
      onBackdropClick={backdropAction}
    />
  );
};
