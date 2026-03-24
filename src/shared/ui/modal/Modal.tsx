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

const WARNING_ICON_SRC = 'data:image/webp;base64,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';

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
