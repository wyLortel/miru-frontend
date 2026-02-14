'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/entities/auth/useAuth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const qc = useQueryClient();

  useAuth();

  /* 세션 만료 시 auth 캐시 제거 */

  useEffect(() => {
    const handler = () => {
      qc.removeQueries({ queryKey: ['auth', 'me'] });
    };

    window.addEventListener('auth:logout', handler);

    return () => window.removeEventListener('auth:logout', handler);
  }, [qc]);

  return <>{children}</>;
}
