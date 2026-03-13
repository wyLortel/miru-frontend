'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLoginRequired } from '@/shared/lib/hooks/useLoginRequired';
import { AdminNavLink } from './AdminNavLink';

export const Navigation = () => {
  const router = useRouter();
  const { checkAuth } = useLoginRequired();

  return (
    <nav className="hidden md:flex items-center gap-8">
      <NavLink href="/analysis">자기분석</NavLink>
      <NavLink href="/board">커뮤니티</NavLink>
      <NavLink href="/about">자기분석이란?</NavLink>
      <NavLink href="/tips">자기분석 팁</NavLink>
      <button
        onClick={() => checkAuth(() => router.push('/inquiry'))}
        className="font-bold leading-none hover:text-blue-600 transition-colors cursor-pointer"
      >
        1:1 문의
      </button>
      <AdminNavLink />
    </nav>
  );
};

//스타일 중복을 줄이기 위한 내부 컴포넌트
const NavLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <Link
    href={href}
    className=" font-bold leading-none hover:text-blue-600 transition-colors"
  >
    {children}
  </Link>
);
