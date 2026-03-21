import type { Metadata } from 'next';
import { AboutAnalysisHero } from '@/widgets/about-analysis/about-analysis-hero';
import { AboutAnalysisIntro } from '@/widgets/about-analysis/about-analysis-intro';
import { AboutAnalysisFeatures } from '@/widgets/about-analysis/about-analysis-features';
import { AboutAnalysisEmphasis } from '@/widgets/about-analysis/about-analysis-emphasis';
import { AboutAnalysisCta } from '@/widgets/about-analysis/about-analysis-cta';

export const metadata: Metadata = {
  title: '자기분석이란 | miru',
  description: '일본 취업의 필수 과정, 자기분석이 무엇인지 알아보고 체계적으로 시작해보세요. miru와 함께 자신을 분석하세요.',
};

export default function AboutAnalysisPage() {
  return (
    <>
      <AboutAnalysisHero />
      <AboutAnalysisIntro />
      <AboutAnalysisFeatures />
      <AboutAnalysisEmphasis />
      <AboutAnalysisCta />
    </>
  );
}
