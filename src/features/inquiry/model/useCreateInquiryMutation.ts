import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createInquiry } from './api';

export const useCreateInquiryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { title: string; content: string }) =>
      createInquiry(payload),
    onSuccess: () => {
      // 문의글 목록 갱신
      queryClient.invalidateQueries({
        queryKey: ['inquiries-all'],
      });
    },
  });
};
