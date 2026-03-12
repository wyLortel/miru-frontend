'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/entities/admin/api/adminApi';
import { usePagination } from '@/shared/lib/hooks/usePagination';
import { CommonPagination } from '@/shared/ui/CommonPagination';

export function AdminInquiriesContent() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin', 'inquiries'],
    queryFn: adminApi.getInquiries,
  });

  const items = data?.items ?? [];
  const { page, totalPages, pageNumbers, goToNext, goToPrev, setPage } =
    usePagination(items.length, 10);

  const pageItems = items.slice((page - 1) * 10, page * 10);

  if (isLoading) {
    return <p className="text-muted-foreground">불러오는 중...</p>;
  }

  if (isError) {
    return <p className="text-red-500">문의 목록을 불러오지 못했습니다.</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">문의 목록</h1>

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border">
            <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground w-1/4">
              상태
            </th>
            <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground w-1/4">
              유저명
            </th>
            <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground w-1/4">
              제목
            </th>
            <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground w-1/4">
              문의 날짜
            </th>
          </tr>
        </thead>
        <tbody>
          {pageItems.length === 0 ? (
            <tr>
              <td colSpan={4} className="py-8 text-center text-sm text-muted-foreground opacity-40">
                아직 문의 목록이 없습니다
              </td>
            </tr>
          ) : pageItems.map((inquiry) => (
            <tr key={inquiry.id} className="border-b border-border hover:bg-muted/40">
              <td className="py-3 px-4 text-center">
                {inquiry.status === 'WAITING' ? (
                  <span className="inline-flex items-center rounded-md bg-red-500 px-3 py-1 text-xs font-medium text-white">
                    답변 대기
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-md border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
                    답변 완료
                  </span>
                )}
              </td>
              <td className="py-3 px-4 text-sm text-center">{inquiry.writer}</td>
              <td className="py-3 px-4 text-sm text-center">
                <Link href={`/admin/inquiries/${inquiry.id}`} className="hover:underline">
                  {inquiry.title}
                </Link>
              </td>
              <td className="py-3 px-4 text-sm text-center text-muted-foreground">
                {inquiry.createdAt}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <CommonPagination
          page={page}
          totalPages={totalPages}
          pageNumbers={pageNumbers}
          onPageChange={setPage}
          onNext={goToNext}
          onPrev={goToPrev}
        />
      )}
    </div>
  );
}
