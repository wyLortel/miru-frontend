'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/entities/auth/useAuth';
import { useModalStore, MODAL_PRIORITY } from '@/app/store/useModalStore';
import { AdminSidebar } from '@/widgets/admin-sidebar/ui/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: user } = useAuth();
  const router = useRouter();
  const { openModal, closeModal } = useModalStore();

  useEffect(() => {
    if (user === undefined) return;

    if (user === null) {
      openModal({
        title: '권한 없습니다',
        description: '해당 페이지에 접근할 수 없습니다.',
        priority: MODAL_PRIORITY.HIGH,
        buttons: [
          {
            label: '확인',
            onClick: () => {
              closeModal();
              router.push('/login');
            },
          },
        ],
      });
      return;
    }

    if (user.role !== 'ADMIN') {
      openModal({
        title: '권한 없습니다',
        description: '해당 페이지에 접근할 수 없습니다.',
        priority: MODAL_PRIORITY.HIGH,
        buttons: [{ label: '확인', onClick: closeModal }],
      });
    }
  }, [user, router, openModal, closeModal]);

  if (user === undefined || user === null || user.role !== 'ADMIN') return null;

  return (
    <div className="fixed inset-0 z-50 bg-white flex overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-10">{children}</main>
    </div>
  );
}
