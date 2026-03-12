export interface AdminInquiry {
  id: number;
  status: 'WAITING' | 'COMPLETED';
  writer: string;
  title: string;
  createdAt: string;
}

export interface AdminInquiriesResponse {
  totalCount: number;
  items: AdminInquiry[];
}

export interface AdminUser {
  id: number;
  nickname: string;
  status: 'ACTIVE' | 'BAN';
  createdAt: string;
}

export interface AdminUsersResponse {
  totalCount: number;
  items: AdminUser[];
}

export interface AdminUserBoard {
  id: number;
  title: string;
  createdAt: string;
}

export interface AdminUserBoardsResponse {
  targetNickname: string;
  totalCount: number;
  items: AdminUserBoard[];
}

export interface AdminUserComment {
  id: number;
  boardId: number;
  boardTitle: string;
  content: string;
  createdAt: string;
}

export interface AdminUserCommentsResponse {
  targetNickname: string;
  totalCount: number;
  items: AdminUserComment[];
}

export interface AdminInquiryDetail {
  id: number;
  title: string;
  writer: string;
  createdAt: string;
  status: 'WAITING' | 'COMPLETED';
  content: string;
  answerContent: string | null;
}
