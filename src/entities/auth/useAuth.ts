import { useQuery } from '@tanstack/react-query';
import { authApi } from '@/shared/api/auth';
import axios from 'axios';

export function useAuth() {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      try {
        return await authApi.getMe();
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          return null;
        }
        throw error;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes - allows periodic refresh from server
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}
