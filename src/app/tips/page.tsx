import { AnalysisTipsHero } from '@/widgets/analysis-tips/analysis-tips-hero';
import { AnalysisTipsSolution } from '@/widgets/analysis-tips/analysis-tips-solution';
import { AnalysisTipsExample } from '@/widgets/analysis-tips/analysis-tips-example';
import { AnalysisTipsCta } from '@/widgets/analysis-tips/analysis-tips-cta';

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
