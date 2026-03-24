import { PageHero } from '@/shared/ui/PageHero';

export function BoardHero() {
  return (
    <PageHero
      title="커뮤니티"
      description={
        <>
          자기분석을 나누는 <strong>취준생 </strong> 커뮤니티
        </>
      }
      imageSrc="/assets/images/board-hero.webp"
      imageAlt="커뮤니티 히어로 이미지"
      priority
    />
  );
}
