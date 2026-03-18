'use client';

import Link from 'next/link';
import { useAuth } from '@/entities/auth/useAuth';

export const AdminNavLink = () => {
  const { data: user } = useAuth();
  if (user?.role !== 'ADMIN') return null;
  return (
    <Link
      href="/admin/inquiries"
      className="font-bold leading-none hover:text-blue-600 transition-colors"
    >
      관리자 페이지
    </Link>
  );
};
