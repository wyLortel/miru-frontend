'use client';

import { useState } from 'react';
import { WithdrawModal } from './WithdrawModal';

export function WithdrawButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-sm font-medium text-red-500 hover:text-red-600 transition-colors cursor-pointer"
      >
        회원탈퇴
      </button>
      <WithdrawModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
