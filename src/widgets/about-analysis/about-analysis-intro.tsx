'use client';

import { Container } from '@/shared/ui/container';
import { AboutAnalysisInfoCard } from '@/shared/ui/AboutAnalysisInfoCard';

export function AboutAnalysisIntro() {
  return (
    <section className="bg-main py-16 md:py-24">
      <Container>
        <div className="space-y-12 md:space-y-16">
          {/* 텍스트 영역 */}
          <div className="space-y-4 text-center">
            <h2 className="text-2xl font-bold text-white md:text-4xl">
              일본 취업은, 생각보다 다릅니다
            </h2>
            <p className="mx-auto max-w-2xl text-white text-base text-muted-foreground md:text-lg leading-relaxed">
              많은 사람들이 일본 취업을 “언어 + 스펙 + 기술력”의 싸움이라고
              생각합니다. 하지만 직접 취업 활동(취활)을 하며 느낀 것은
              달랐습니다.일본 기업이 가장 먼저 보는 것은 당신의 점수가 아니라,
              당신이라는 사람이었습니다.
            </p>
          </div>

          {/* 카드 영역 */}
          <div className="grid gap-6 md:grid-cols-2">
            <AboutAnalysisInfoCard
              iconSrc="/assets/icons/about-target.png"
              iconAlt="일본 취업의 본질 아이콘"
              title="일본 취업의 본질"
              description="일본 기업은 무엇을 보고 있을까?
              일본 기업은 지원자를 평가할 때 역량과 소프트 스킬을 비교적 명확하게 나누어 봅니다.
              그리고 그중에서도 특히 중요하게 여기는 것은 단 하나.
              이 사람이 우리 조직과 함께할 수 있는 사람인가.
              무엇을 할 수 있는가보다,어떤 사람인가를 깊이 바라봅니다."
            />
            <AboutAnalysisInfoCard
              iconSrc="/assets/icons/about-chat.png"
              iconAlt="면접의 진짜 목적 아이콘"
              title="면접의 진짜 목적"
              description="면접은 시험이 아닙니다
                면접은 정답 맞히기 게임이 아닙니다.
                면접관은 당신이 얼마나 대단한지보다,
                “당신이라는 사람이 우리 회사와 어울리는가”
                를 알고 싶어 합니다.
                남들의 합격 후기를 따라 하는 순간,당신만의 이야기는 사라집니다."
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
