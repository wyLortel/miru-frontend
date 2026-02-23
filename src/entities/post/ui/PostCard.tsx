'use client';

import { Heart, MessageCircle } from 'lucide-react';

import { Badge } from '@/shared/ui/badge';
import { Card, CardContent } from '@/shared/ui/card';

export interface Post {
  id: number;
  title: string;
  author: string;
  createdAt: string;
  likeCount: number;
  commentCount: number;
  viewCount: number;
  isNotice: boolean;
}

interface PostCardProps {
  post: Post;
  isSelected?: boolean;
  onClick?: () => void;
}

export function PostCard({ post, isSelected = false, onClick }: PostCardProps) {
  if (post.isNotice) {
    return (
      <Card
        variant="soft"
        onClick={onClick}
        className={`cursor-pointer flex-row items-center gap-3 py-4 ${
          isSelected ? 'ring-2 ring-blue-500' : ''
        }`}
      >
        <CardContent className="flex items-center gap-3 py-0">
          <Badge
            variant="destructive"
            className="shrink-0 rounded-md px-2 py-0.5 text-xs"
          >
            공지
          </Badge>
          <span className="font-semibold text-foreground">{post.title}</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      onClick={onClick}
      className={`cursor-pointer gap-0 py-4 ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
      variant="soft"
    >
      <CardContent className="flex flex-col gap-1.5">
        <div className="flex items-start justify-between gap-4">
          <p className="line-clamp-1 font-medium text-foreground mb-3 ">
            {post.title}
          </p>
          <div className="flex shrink-0 items-center gap-3 text-muted-foreground">
            <span className="flex items-center gap-1 text-sm ">
              <Heart className="size-6" />
              {post.likeCount}
            </span>
            <span className="flex items-center gap-1 text-sm">
              <MessageCircle className="size-5" />
              {post.commentCount}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {post.author}&nbsp;&nbsp;{post.createdAt}
          </span>
          <span className="text-xs text-muted-foreground">
            조회수 {post.viewCount}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

// 공지 목업 (항상 1페이지 상단에 고정)
export const MOCK_NOTICES: Post[] = [
  {
    id: 101,
    title: '게시판 작성전 반드시 확인해주세요!',
    author: '관리자',
    createdAt: '09:00',
    likeCount: 0,
    commentCount: 0,
    viewCount: 0,
    isNotice: true,
  },
  {
    id: 102,
    title: '욕설·비방 게시글은 즉시 삭제 및 이용 정지 처리됩니다.',
    author: '관리자',
    createdAt: '09:05',
    likeCount: 0,
    commentCount: 0,
    viewCount: 0,
    isNotice: true,
  },
];

// 일반 유저 글 목업 (페이지네이션 대상)
export const MOCK_REGULAR_POSTS: Post[] = [
  {
    id: 1,
    title: 'Next.js 13 app router 사용하면서 생긴 이슈 공유합니다',
    author: '김민준',
    createdAt: '14:05',
    likeCount: 82,
    commentCount: 23,
    viewCount: 4120,
    isNotice: false,
  },
  {
    id: 2,
    title: 'Tailwind CSS v4 써보신 분 계신가요? 마이그레이션 어떠셨어요?',
    author: '이서연',
    createdAt: '13:48',
    likeCount: 55,
    commentCount: 17,
    viewCount: 2980,
    isNotice: false,
  },
  {
    id: 3,
    title: 'TanStack Query v5 breaking change 정리해봤습니다',
    author: '박도현',
    createdAt: '13:22',
    likeCount: 140,
    commentCount: 41,
    viewCount: 8750,
    isNotice: false,
  },
  {
    id: 4,
    title: '취준생인데 포트폴리오 피드백 부탁드려도 될까요?',
    author: '최지우',
    createdAt: '12:55',
    likeCount: 34,
    commentCount: 58,
    viewCount: 3310,
    isNotice: false,
  },
  {
    id: 5,
    title: 'Zustand vs Jotai 실무에서 어떤 거 쓰시나요?',
    author: '정승훈',
    createdAt: '12:30',
    likeCount: 97,
    commentCount: 62,
    viewCount: 6200,
    isNotice: false,
  },
  {
    id: 6,
    title: '이 코드가 왜 무한 렌더링이 일어나는지 모르겠어요 ㅠ',
    author: '한예림',
    createdAt: '11:58',
    likeCount: 21,
    commentCount: 35,
    viewCount: 1890,
    isNotice: false,
  },
  {
    id: 7,
    title: 'React Server Component 개념 이해하는 데 도움된 자료 공유',
    author: '오준혁',
    createdAt: '11:33',
    likeCount: 203,
    commentCount: 29,
    viewCount: 11400,
    isNotice: false,
  },
  {
    id: 8,
    title: '프리랜서로 전향하신 분들 초기 영업은 어떻게 하셨나요?',
    author: '신다은',
    createdAt: '10:47',
    likeCount: 66,
    commentCount: 88,
    viewCount: 5540,
    isNotice: false,
  },
  {
    id: 9,
    title: 'prisma ORM 사용 중인데 N+1 문제 해결법 아시는 분?',
    author: '윤재원',
    createdAt: '10:20',
    likeCount: 48,
    commentCount: 19,
    viewCount: 2760,
    isNotice: false,
  },
  {
    id: 10,
    title: 'jest 설정 계속 실패하는데 혹시 같은 증상 경험하신 분요',
    author: '임소희',
    createdAt: '09:55',
    likeCount: 12,
    commentCount: 27,
    viewCount: 1430,
    isNotice: false,
  },
  {
    id: 11,
    title: '2페이지 - Docker 입문하려는데 추천 자료 있나요?',
    author: '강태양',
    createdAt: '어제',
    likeCount: 77,
    commentCount: 14,
    viewCount: 3900,
    isNotice: false,
  },
  {
    id: 12,
    title: '2페이지 - TypeScript 제네릭 이게 맞게 쓰는 건지 모르겠어요',
    author: '조하늘',
    createdAt: '어제',
    likeCount: 33,
    commentCount: 22,
    viewCount: 2100,
    isNotice: false,
  },
  {
    id: 13,
    title: '2페이지 - GraphQL 실무 도입 경험 있으신 분 계신가요?',
    author: '백승민',
    createdAt: '어제',
    likeCount: 58,
    commentCount: 31,
    viewCount: 4670,
    isNotice: false,
  },
];
