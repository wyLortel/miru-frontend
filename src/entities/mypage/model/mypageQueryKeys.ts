// Hierarchical query key factory for mypage
export const mypageQueryKeys = {
  all: ['mypage'] as const,
  profile: () => ['mypage', 'profile'] as const,
  posts: () => ['mypage', 'posts'] as const,
  postsList: (page: number) => ['mypage', 'posts', page] as const,
  comments: () => ['mypage', 'comments'] as const,
  commentsList: (page: number) => ['mypage', 'comments', page] as const,
};
