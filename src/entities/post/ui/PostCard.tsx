'use client';

import { Heart, MessageCircle } from 'lucide-react';

import { Badge } from '@/shared/ui/badge';
import { Card, CardContent } from '@/shared/ui/card';
import { RelativeTime } from '@/shared/ui/RelativeTime';
import type { Post } from '@/entities/post/model/types';

interface PostCardProps {
  post: Post;
  isSelected?: boolean;
  onClick?: () => void;
}

export function PostCard({ post, isSelected = false, onClick }: PostCardProps) {
  if (post.type === 'NOTICE') {
    return (
      <Card
        variant="soft"
        onClick={onClick}
        className={`cursor-pointer flex-row items-center gap-3 py-4 ${
          isSelected ? 'ring-2 ring-ring' : ''
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
        isSelected ? 'ring-2 ring-ring' : ''
      }`}
      variant="soft"
    >
      <CardContent className="flex flex-col gap-1.5">
        <div className="flex items-start justify-between gap-4">
          <p className="line-clamp-1 font-bold text-gray-800 mb-3 ">
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
          <span className="text-xs">
            <span className="font-medium text-foreground">{post.writer}</span>
            <span className="text-muted-foreground">
              &nbsp; | &nbsp;
              <RelativeTime isoString={post.createdAt} />
            </span>
          </span>
          <span className="text-xs text-muted-foreground">
            조회수 {post.viewCount}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
