'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { adminApi } from '@/entities/admin/api/adminApi';
import { CommonPagination } from '@/shared/ui/CommonPagination';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { useModalStore } from '@/app/store/useModalStore';

const PAGE_SIZE = 20;
const GROUP_SIZE = 10;

export function AdminUsersContent() {
  const [page, setPage] = useState(1);
  const [inputValue, setInputValue] = useState('');
  const [name, setName] = useState('');

  const queryClient = useQueryClient();
  const { openModal, closeModal } = useModalStore();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin', 'users', page, name],
    queryFn: () => adminApi.getUsers(page - 1, name || undefined),
  });

  const { mutate: updateStatus } = useMutation({
    mutationFn: (userId: number) => adminApi.updateUserStatus(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
    onError: (err) => {
      if (isAxiosError(err) && err.response?.status === 401) return;
      const message = isAxiosError(err) ? err.response?.data?.message : undefined;
      openModal({
        title: '상태 변경 실패',
        description: message ?? '오류가 발생했습니다.',
        buttons: [{ label: '확인', onClick: closeModal }],
      });
    },
  });

  const totalCount = data?.totalCount ?? 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE) || 1;
  const currentGroup = Math.ceil(page / GROUP_SIZE);
  const startPage = (currentGroup - 1) * GROUP_SIZE + 1;
  const endPage = Math.min(currentGroup * GROUP_SIZE, totalPages);
  const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  const items = data?.items ?? [];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setName(inputValue);
      setPage(1);
    }
  };

  if (isLoading) {
    return <p className="text-muted-foreground">불러오는 중...</p>;
  }

  if (isError) {
    return <p className="text-red-500">유저 목록을 불러오지 못했습니다.</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">유저 관리 페이지</h1>

      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="닉네임으로 검색"
        className="max-w-md mb-8 rounded-full"
      />

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border">
            <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground w-1/5">
              유저명
            </th>
            <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground w-1/5">
              상태
            </th>
            <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground w-1/5">
              작성글
            </th>
            <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground w-1/5">
              작성댓글
            </th>
            <th className="py-3 px-4 w-1/5" />
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-8 text-center text-sm text-muted-foreground opacity-40">
                유저 목록이 없습니다
              </td>
            </tr>
          ) : (
            items.map((user) => (
              <tr key={user.id} className="border-b border-border hover:bg-muted/40">
                <td className="py-3 px-4 text-sm text-center">{user.nickname}</td>
                <td className="py-3 px-4 text-center">
                  {user.status === 'BAN' ? (
                    <span className="inline-flex items-center rounded-full bg-red-500 px-3 py-1 text-xs font-medium text-white">
                      영구 정지
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
                      활동중
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 text-sm text-center">
                  <Link href={`/admin/users/${user.id}/boards`} className="text-muted-foreground hover:underline">
                    작성글 확인
                  </Link>
                </td>
                <td className="py-3 px-4 text-sm text-center">
                  <Link href={`/admin/users/${user.id}/comments`} className="text-muted-foreground hover:underline">
                    작성댓글 확인
                  </Link>
                </td>
                <td className="py-3 px-4 text-center">
                  {user.status === 'BAN' ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full px-5 cursor-pointer"
                      onClick={() => updateStatus(user.id)}
                    >
                      정지 해제
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="rounded-full px-5 bg-red-500 hover:bg-red-600 text-white border-0 cursor-pointer"
                      onClick={() =>
                        openModal({
                          title: '정말로 정지 시키겠습니까?',
                          buttons: [
                            { label: '취소', onClick: closeModal },
                            { label: '네', onClick: () => { closeModal(); updateStatus(user.id); } },
                          ],
                        })
                      }
                    >
                      정지
                    </Button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <CommonPagination
          page={page}
          totalPages={totalPages}
          pageNumbers={pageNumbers}
          onPageChange={setPage}
          onNext={() => setPage((p) => Math.min(p + 1, totalPages))}
          onPrev={() => setPage((p) => Math.max(p - 1, 1))}
        />
      )}
    </div>
  );
}
