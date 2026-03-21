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
        description="일본 취업의 시작, 꼭 필요한 자기분석 질문"
        imageSrc="/assets/images/analysis-hero.webp"
        imageAlt="자기분석 히어로 이미지"
        imageContainerClassName="relative size-52 shrink-0 max-[340px]:size-36"
        imageClassName="object-contain"
      />
      <AnalysisMain />
    </>
  );
}
