import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteInquiry } from './api';

export const useDeleteInquiryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteInquiry(id),
    onSuccess: () => {
      // 문의글 목록 갱신
      queryClient.invalidateQueries({
        queryKey: ['inquiries-all'],
      });
    },
  });
};
