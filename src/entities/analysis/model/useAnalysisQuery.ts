import { useSuspenseQuery } from '@tanstack/react-query';
import { fetchAllAnalysis } from '../api/analysisApi';

export const useAnalysisQuery = () => {
  return useSuspenseQuery({
    queryKey: ['analysis-all'],
    queryFn: fetchAllAnalysis,
    staleTime: 1000 * 60 * 5,
  });
};
