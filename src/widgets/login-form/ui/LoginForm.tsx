'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { GoogleButton } from '../_components/SocialButtons';
import { startSocialLogin } from '@/features/auth/model/login';
import { isValidRedirectUrl } from '@/shared/lib/validateUrl';

export default function LoginForm() {
  const searchParams = useSearchParams();

  // 로그인 후 돌아갈 URL을 로컬스토리지에 저장
  useEffect(() => {
    const redirect = searchParams.get('redirect');
    if (redirect && isValidRedirectUrl(redirect)) {
      localStorage.setItem('redirectAfterLogin', redirect);
    }
  }, [searchParams]);

  return (
    <section className="flex flex-col gap-5 w-full max-w-[500px] px-4 mx-auto mb-16">
      <GoogleButton onClick={() => startSocialLogin('google')} />
    </section>
  );
}
