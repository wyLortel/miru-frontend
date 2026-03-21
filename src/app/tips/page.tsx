import type { Metadata } from 'next';
import { AnalysisTipsHero } from '@/widgets/analysis-tips/analysis-tips-hero';
import { AnalysisTipsSolution } from '@/widgets/analysis-tips/analysis-tips-solution';
import { AnalysisTipsExample } from '@/widgets/analysis-tips/analysis-tips-example';
import { AnalysisTipsCta } from '@/widgets/analysis-tips/analysis-tips-cta';

export const metadata: Metadata = {
  title: '자기분석 팁 | miru',
  description: '자기분석을 효과적으로 하기 위한 실용적인 팁과 예시를 확인해보세요. miru의 전문가 조언을 통해 완벽한 자기분석을 완성하세요.',
};

export default function AnalysisTipsPage() {
  return (
    <>
      <AnalysisTipsHero />
      <AnalysisTipsSolution />
      <AnalysisTipsExample />
      <AnalysisTipsCta />
    </>
  );
}
