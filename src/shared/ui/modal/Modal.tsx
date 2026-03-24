'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface ModalButton {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  bgColor?: string;
  textColor?: string;
}

const WARNING_ICON_SRC = '/assets/icons/warning.webp';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  buttons?: ModalButton[];
  children?: ReactNode;
  iconSrc?: string;
  onBackdropClick?: () => void;
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  buttons,
  children,
  iconSrc = WARNING_ICON_SRC,
  onBackdropClick,
}: ModalProps) => {
  if (!isOpen) return null;

  const handleBackdropClick = () => {
    if (onBackdropClick) {
      onBackdropClick();
    } else {
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
    >
      <div
        className="w-full max-w-[320px] rounded-3xl bg-white p-7 shadow-xl flex flex-col items-center text-center border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {iconSrc && (
          <div className="mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={iconSrc}
              alt=""
              width={120}
              height={120}
            />
          </div>
        )}
        <h3 id="modal-title" className="mb-2 text-[20px] font-bold text-[#111827] leading-tight">
          {title}
        </h3>
        {description && (
          <p className="mb-6 text-[14px] text-[#111827] opacity-70 whitespace-pre-wrap leading-normal">
            {description}
          </p>
        )}
        {children}
        {buttons && buttons.length > 0 && (
          <div className="flex w-full gap-2 mt-2">
            {buttons.map((btn) => (
              <button
                key={btn.label}
                onClick={btn.onClick}
                style={{ backgroundColor: btn.bgColor, color: btn.textColor }}
                className={cn(
                  'flex-1 rounded-xl py-3 text-[16px] font-semibold transition-all active:scale-95',
                  btn.bgColor === 'white' && 'border-2 border-gray-300',
                  !btn.bgColor &&
                    (btn.variant === 'secondary'
                      ? 'bg-gray-100 text-[#111827]'
                      : 'bg-main text-white'),
                )}
              >
                {btn.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
