'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/entities/auth/useAuth';
import { PageHero } from '@/shared/ui/PageHero';
import { AnalysisMain } from '@/widgets/analysis-main';
import { isValidRedirectUrl } from '@/shared/lib/validateUrl';

export default function AnalysisPage() {
  const router = useRouter();
  const { data: user } = useAuth();

  useEffect(() => {
    if (user) {
      // 로그인 완료 시 localStorage에서 redirect URL 읽기
      const redirectUrl = localStorage.getItem('redirectAfterLogin');
      if (redirectUrl && isValidRedirectUrl(redirectUrl)) {
        localStorage.removeItem('redirectAfterLogin');
        router.push(redirectUrl);
      } else if (redirectUrl) {
        localStorage.removeItem('redirectAfterLogin');
      }
    }
  }, [user, router]);

  return (
    <>
      <PageHero
        title="자기분석"
        description="너의 근본 부터 탈탈 털어줄게"
        imageSrc="/assets/images/analysis-hero.png"
        imageAlt="자기분석 히어로 이미지"
        imageContainerClassName="relative size-52 shrink-0"
        imageClassName="object-contain"
      />
      <AnalysisMain />
    </>
  );
}
