import { create } from 'zustand';
import { ModalButton } from '../../shared/ui/modal/Modal';

/**
 * 모달 우선순위 상수
 * 숫자가 클수록 높은 우선순위 — 현재 열린 모달보다 우선순위가 낮으면 무시됩니다.
 */
export const MODAL_PRIORITY = {
  DEFAULT: 0,
  HIGH: 10,    // 인증 오류 등 사용자가 반드시 확인해야 하는 모달
} as const;

interface ModalConfig {
  title: string;
  description?: string;
  buttons?: ModalButton[];
  priority?: number;
}

interface ModalState {
  isOpen: boolean;
  title: string;
  description?: string;
  buttons?: ModalButton[];
  priority: number;
  openModal: (config: ModalConfig) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set, get) => ({
  isOpen: false,
  title: '',
  description: undefined,
  buttons: [],
  priority: MODAL_PRIORITY.DEFAULT,
  openModal: (config) => {
    const { isOpen, priority } = get();
    const incomingPriority = config.priority ?? MODAL_PRIORITY.DEFAULT;

    // 현재 열린 모달의 우선순위가 더 높으면 무시
    if (isOpen && incomingPriority < priority) return;

    set({ ...config, priority: incomingPriority, isOpen: true });
  },
  closeModal: () =>
    set({ isOpen: false, title: '', description: undefined, buttons: [], priority: MODAL_PRIORITY.DEFAULT }),
}));
