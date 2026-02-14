import { useQuery } from '@tanstack/react-query';
import { authApi } from '@/shared/api/auth';

export function useAuth() {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authApi.getMe,
    retry: false,
    staleTime: Infinity,
  });
}
