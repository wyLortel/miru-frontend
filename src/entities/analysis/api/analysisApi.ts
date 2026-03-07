import { apiClient } from '@/shared/api/apiClient';
import type { AnalysisListResponse } from '../model/types';

export const fetchAllAnalysis = async (): Promise<AnalysisListResponse> => {
  const { data } = await apiClient.get('/api/analysis');
  return {
    totalCount: data.data.totalCount,
    items: data.data.items,
  };
};
