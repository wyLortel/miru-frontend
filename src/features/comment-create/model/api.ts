import { apiClient } from '@/shared/api/apiClient';

export const createComment = async (
  postId: string,
  content: string,
  parentId: number | null = null,
) => {
  const res = await apiClient.post(`/api/boards/${postId}/comment`, { content, parentId });
  return res.data;
};

export const deleteComment = async (commentId: number) => {
  const res = await apiClient.delete(`/api/comments/${commentId}`);
  return res.data;
};

export const editComment = async (commentId: number, content: string) => {
  const res = await apiClient.patch(`/api/comments/${commentId}`, { content });
  return res.data;
};
