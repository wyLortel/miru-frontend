// 'NOTICE' | 'GENERAL' 로 자동완성을 제공하면서, 추후 새 타입이 추가되어도 string으로 허용
export type PostType = 'NOTICE' | 'GENERAL' | (string & {});

export interface Post {
  id: number;
  type: PostType;
  title: string;
  writer: string;
  likeCount: number;
  commentCount: number;
  viewCount: number;
  createdAt: string;
}

export interface Reply {
  id: number;
  writer: string;
  content: string;
  createdAt: string;
}

export interface Comment {
  id: number;
  writer: string;
  content: string;
  createdAt: string;
  replies: Reply[];
}

export interface PostDetail extends Post {
  content: string;
  isLiked: boolean;
  comments: Comment[];
}
