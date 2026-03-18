'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { MessageSquareMore, BookUser } from 'lucide-react';

const navItems = [
  { href: '/admin/inquiries', icon: MessageSquareMore, label: '문의 목록' },
  { href: '/admin/users', icon: BookUser, label: '유저 정보 목록' },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-48 shrink-0 flex flex-col border-r border-border h-full">
      <div className="px-6 py-6">
        <Link href="/analysis">
          <Image
            src="/miru_logo.png"
            alt="MIRU 로고"
            width={200}
            height={68}
            priority
          />
        </Link>
      </div>

      <nav className="flex flex-col gap-1 px-3 mt-9">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-[var(--color-main)]/10 text-[var(--color-main)] font-medium'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
