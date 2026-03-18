'use client';

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useIsActive } from '@/widgets/header/lib/useIsActive';
import { MobileMenuHeader } from './MobileMenuHeader';
import { MobileMenuAuth } from './MobileMenuAuth';

interface MobileMenuProps {
  onClose: () => void;
}

const MENU_ITEMS = [
  { href: '/analysis', label: '자기분석' },
  { href: '/about', label: '자기분석이란?' },
  { href: '/tips', label: '자기분석 팁' },
  { href: '/boards', label: '커뮤니티' },
  { href: '/inquiries', label: '1:1 문의' },
  { href: '/mypage', label: '마이페이지' },
];

export const MobileMenu = ({ onClose }: MobileMenuProps) => {
  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <MobileMenuHeader onClose={onClose} />

      <nav className="flex flex-col px-6 mt-4">
        {MENU_ITEMS.map((item) => (
          <MobileMenuItem
            key={item.href}
            href={item.href}
            label={item.label}
            onClose={onClose}
          />
        ))}

        <MobileMenuAuth onClose={onClose} />
      </nav>
    </div>
  );
};

const MobileMenuItem = ({
  href,
  label,
  onClose,
}: {
  href: string;
  label: string;
  onClose: () => void;
}) => {
  const isActive = useIsActive(href);

  return (
    <Link
      href={href}
      onClick={onClose}
      className="flex items-center justify-between py-5 border-b border-gray-100 group active:bg-gray-50"
    >
      <span
        className={`text-xl font-bold transition-colors ${
          isActive
            ? 'text-primary'
            : 'text-gray-800 group-hover:text-main'
        }`}
      >
        {label}
      </span>
      <ChevronRight
        size={24}
        className={`transition-colors ${
          isActive ? 'text-primary' : 'text-gray-400 group-hover:text-main'
        }`}
      />
    </Link>
  );
};
