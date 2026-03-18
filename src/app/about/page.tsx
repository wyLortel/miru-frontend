import { AboutAnalysisHero } from '@/widgets/about-analysis/about-analysis-hero';
import { AboutAnalysisIntro } from '@/widgets/about-analysis/about-analysis-intro';
import { AboutAnalysisFeatures } from '@/widgets/about-analysis/about-analysis-features';
import { AboutAnalysisEmphasis } from '@/widgets/about-analysis/about-analysis-emphasis';
import { AboutAnalysisCta } from '@/widgets/about-analysis/about-analysis-cta';

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
