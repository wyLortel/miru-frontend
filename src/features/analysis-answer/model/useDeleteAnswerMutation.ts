import { useMutation, useQueryClient } from '@tanstack/react-query';
import { analysisAnswerApi } from '../api/analysisAnswerApi';

export const useDeleteAnswerMutation = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => analysisAnswerApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analysis-all'] });
    },
  });
};
