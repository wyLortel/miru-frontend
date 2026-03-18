export interface MyPageInfo {
  nickname: string;
  analysisStats: { inProgressCount: number; completedCount: number };
  postStats: { articleCount: number; commentCount: number };
}

export interface MyPost {
  id: number;
  title: string;
  createdAt: string;
}

export interface MyComment {
  boardId: number;
  boardTitle: string;
  content: string;
  createdAt: string;
}

export interface MyPostListResponse {
  items: MyPost[];
  totalCount: number;
}

export interface MyCommentListResponse {
  items: MyComment[];
  totalCount: number;
}
