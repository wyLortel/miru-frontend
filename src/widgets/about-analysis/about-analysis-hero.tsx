import { PageHero } from '@/shared/ui/PageHero';

export function AboutAnalysisHero() {
  return (
    <PageHero
      title="자기분석의 중요한 이유"
      description="스펙 뒤에 숨겨진 진짜 당신을 찾는 여정"
      imageSrc="/assets/images/about-analysis-hero.png"
      imageAlt="자기분석 히어로 이미지"
      imageContainerClassName="relative size-52 shrink-0 max-[340px]:size-36 max-[318px]:size-28"
      imageClassName="object-contain"
    />
  );
}
