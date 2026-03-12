import { AdminSidebar } from '@/widgets/admin-sidebar/ui/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-white flex overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-10">{children}</main>
    </div>
  );
}
