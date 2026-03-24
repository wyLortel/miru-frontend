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

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  buttons?: ModalButton[];
  children?: ReactNode;
  icon?: ReactNode;
  onBackdropClick?: () => void;
}

function WarningIcon() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="40" fill="#FFF3E0" />
      <path d="M40 22L62 58H18L40 22Z" fill="#FFB74D" stroke="#FF9800" strokeWidth="2" strokeLinejoin="round" />
      <rect x="37" y="35" width="6" height="14" rx="3" fill="white" />
      <circle cx="40" cy="54" r="3" fill="white" />
    </svg>
  );
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  buttons,
  children,
  icon = <WarningIcon />,
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
        {icon && (
          <div className="mb-4">
            {icon}
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
