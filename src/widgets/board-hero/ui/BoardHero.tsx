import { PageHero } from '@/shared/ui/PageHero';

export function BoardHero() {
  return (
    <PageHero
      title="커뮤니티"
      description={
        <>
          근본 있는 <strong>취준생</strong> 들의아지트
        </>
      }
      imageSrc="/assets/images/board-hero.png"
      imageAlt="커뮤니티 히어로 이미지"
    />
  );
}
