import { apiClient } from '@/shared/api/apiClient';
import type { AnalysisStatus } from '@/entities/analysis/model/types';

export interface SubmitAnswerPayload {
  answerContext: string;
  status: Extract<AnalysisStatus, 'IN_PROGRESS' | 'COMPLETED'>;
}

export const analysisAnswerApi = {
  submit: async (id: number, payload: SubmitAnswerPayload) => {
    const { data } = await apiClient.post(`/api/analysis/${id}`, payload);
    return data;
  },
  delete: async (id: number) => {
    const { data } = await apiClient.delete(`/api/analysis/${id}`);
    return data;
  },
};
