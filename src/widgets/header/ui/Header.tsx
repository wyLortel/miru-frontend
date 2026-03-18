'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Logo } from '@/shared/ui/logo/Logo';
import { Navigation } from './Navigation';
import { UserActions } from './UserActions';
import { useHeaderScroll } from '../lib/useHeaderScroll';
import { MobileMenu } from '../../mobile-menu/ui/MobileMenu';

export const Header = () => {
  const isScrolled = useHeaderScroll(80);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/80 backdrop-blur-md border-b border-border shadow-sm'
            : 'bg-transparent border-transparent'
        }`}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center mb-1">
              <Logo />
            </div>
            {/* md 이상에서만 네비게이션 표시 */}
            <Navigation />
          </div>
          <div className="flex items-center gap-4">
            <UserActions />
            {/* md 미만에서만 햄버거 버튼 표시 */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 cursor-pointer"
              aria-label="메뉴 열기"
            >
              <Menu size={28} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      {/* 모바일 메뉴 풀스크린 오버레이 */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-100 md:hidden">
          <MobileMenu onClose={() => setIsMobileMenuOpen(false)} />
        </div>
      )}
    </>
  );
};
