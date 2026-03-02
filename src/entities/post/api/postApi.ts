import { apiClient } from '@/shared/api/apiClient';
import type { Post } from '@/entities/post/model/types';

export interface PostListResponse {
  posts: Post[];
  totalCount: number;
}

export interface CreatePostPayload {
  title: string;
  content: string;
}

export const postApi = {
  /** 게시글 목록 조회 (페이지당 10개) */
  getPosts: async (page: number): Promise<PostListResponse> => {
    const { data } = await apiClient.get('/api/board/posting', {
      params: { page, size: 10 },
    });
    // 백엔드 응답의 items 필드를 프론트 컨벤션인 posts로 변환
    return { posts: data.items, totalCount: data.totalCount };
  },

  /** 게시글 상세 조회 */
  getPost: async (postId: number): Promise<Post> => {
    const { data } = await apiClient.get(`/api/board/${postId}`);
    return data;
  },

  /** 게시글 작성 */
  createPost: async (payload: CreatePostPayload): Promise<Post> => {
    const { data } = await apiClient.post('/api/board/posting', payload);
    return data;
  },
};
