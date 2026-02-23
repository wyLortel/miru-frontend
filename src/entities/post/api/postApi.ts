import { apiClient } from '@/shared/api/apiClient';
import { Post } from '@/entities/post/ui/PostCard';

export interface PostListResponse {
  posts: Post[];
  totalCount: number;
}

export const postApi = {
  /** 게시글 목록 조회 (페이지당 10개) */
  getPosts: async (page: number): Promise<PostListResponse> => {
    const { data } = await apiClient.get('/api/board/posting', {
      params: { page, size: 10 },
    });
    return data;
  },

  /** 게시글 상세 조회 */
  getPost: async (postId: number): Promise<Post> => {
    const { data } = await apiClient.get(`/api/board/${postId}`);
    return data;
  },

  /** 조회수 +1 */
  incrementViewCount: async (postId: number): Promise<void> => {
    await apiClient.post(`/api/board/${postId}/view`);
  },
};
