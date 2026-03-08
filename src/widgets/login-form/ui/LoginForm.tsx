'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ConsentSection } from '../_components/ConsentSection';
import { GoogleButton } from '../_components/SocialButtons';
import { useModalStore } from '@/app/store/useModalStore';
import { startSocialLogin } from '@/features/auth/model/login';

export default function LoginForm() {
  const [checkedItems, setCheckedItems] = useState({
    consent1: false,
    consent2: false,
  });

  const { openModal, closeModal } = useModalStore();
  const searchParams = useSearchParams();

  // 로그인 후 돌아갈 URL을 로컬스토리지에 저장
  useEffect(() => {
    const redirect = searchParams.get('redirect');
    if (redirect) {
      localStorage.setItem('redirectAfterLogin', redirect);
    }
  }, [searchParams]);

  const handleLogin = (provider: string) => {
    const missing = [];
    if (!checkedItems.consent1) missing.push('개인정보 처리방침');
    if (!checkedItems.consent2) missing.push('서비스 이용약관');

    if (missing.length > 0) {
      openModal({
        title: '필수 동의 필요',
        description: `${missing.join(', ')}에 동의하셔야\n서비스 이용이 가능합니다.`,
        buttons: [
          {
            label: '확인',
            onClick: closeModal,
            variant: 'primary',
            bgColor: '#4A90E2',
            textColor: '#FFFFFF',
          },
        ],
      });
      return;
    }
    startSocialLogin(provider);
  };

  return (
    <section className="flex flex-col gap-5 w-full max-w-[500px] px-4 mx-auto mb-16">
      <GoogleButton onClick={() => handleLogin('google')} />

      <ConsentSection
        checkedItems={checkedItems}
        onChange={(id, val) =>
          setCheckedItems((prev) => ({ ...prev, [id]: val }))
        }
      />
    </section>
  );
}
