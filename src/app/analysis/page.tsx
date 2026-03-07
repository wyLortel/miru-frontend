import { PageHero } from '@/shared/ui/PageHero';
import { AnalysisMain } from '@/widgets/analysis-main';

export default function AnalysisPage() {
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
