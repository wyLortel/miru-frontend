import { useState } from 'react';

export const usePagination = (totalCount: number, pageSize = 10, groupSize = 10) => {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(totalCount / pageSize) || 1;
  const currentGroup = Math.ceil(page / groupSize);
  const startPage = (currentGroup - 1) * groupSize + 1;
  const endPage = Math.min(currentGroup * groupSize, totalPages);

  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i,
  );

  return {
    page,
    setPage,
    totalPages,
    pageNumbers,
    goToNext: () => setPage((p) => Math.min(p + 1, totalPages)),
    goToPrev: () => setPage((p) => Math.max(p - 1, 1)),
  };
};
