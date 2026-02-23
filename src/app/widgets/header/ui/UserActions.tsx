import Link from 'next/link';
import { Bell, User } from 'lucide-react';

export const UserActions = () => {
  return (
    <div className="flex items-center gap-6">
      <Link
        href="/login"
        className=" font-bold leading-none hover:text-blue-600"
      >
        로그인
      </Link>

      <button className="hidden md:flex items-center justify-center p-1 point cursor-pointer">
        <Bell size={24} strokeWidth={2} />
      </button>

      <button className="hidden md:flex items-center justify-center p-1 cursor-pointer">
        <User size={24} strokeWidth={2} />
      </button>

    </div>
  );
};
