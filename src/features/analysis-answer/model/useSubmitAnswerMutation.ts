import { useMutation, useQueryClient } from '@tanstack/react-query';
import { analysisAnswerApi, type SubmitAnswerPayload } from '../api/analysisAnswerApi';

export const useSubmitAnswerMutation = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SubmitAnswerPayload) => analysisAnswerApi.submit(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analysis-all'] });
    },
  });
};
