import { Dispatch, SetStateAction } from 'react';

/**
 * 서버 사이드 페이지네이션 계산 훅
 * page 상태는 호출하는 쪽에서 관리하고, 이 훅은 계산과 이동 함수만 담당합니다.
 *
 * @example
 * const [page, setPage] = useState(1);
 * const { data } = usePostsQuery(page);
 * const { totalPages, pageNumbers, goToNext, goToPrev } =
 *   useServerPagination(page, setPage, data?.totalCount ?? 0);
 */
export const useServerPagination = (
  page: number,
  setPage: Dispatch<SetStateAction<number>>,
  totalCount: number,
  pageSize = 10,
  groupSize = 10,
) => {
  const totalPages = Math.ceil(totalCount / pageSize) || 1;
  const currentGroup = Math.ceil(page / groupSize);
  const startPage = (currentGroup - 1) * groupSize + 1;
  const endPage = Math.min(currentGroup * groupSize, totalPages);

  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i,
  );

  return {
    totalPages,
    pageNumbers,
    goToNext: () => setPage((p) => Math.min(p + 1, totalPages)),
    goToPrev: () => setPage((p) => Math.max(p - 1, 1)),
  };
};
