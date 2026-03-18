'use client';

import { Container } from '@/shared/ui/container';
import { Check, ThumbsUp } from 'lucide-react';

export function AboutAnalysisFeatures() {
  const leftItems = [
    {
      title: '본질',
      description:
        '스펙은 서류 통과용 입장권일 뿐, 합격은 당신의 논리가 결정합니다',
    },
    {
      title: '과정',
      description: '결과보다는 당신이 문제를 해결하던 그 과정을 듣고싶어합니다',
    },
    {
      title: '3번의 질문',
      description:
        '스스로에게 던진 왜 가 부족하면, 면접관의 세 번째 질문에서 무너집니다.',
    },
    {
      title: '동료의 조건',
      description:
        '회사는  단순히 일잘하는 사람이 아닌, 오래도록 함께 성장할 동료를 찾습니다',
    },
  ];

  const rightItems = [
    '커뮤니케이션 스킬',
    '기업의 비전과의 공감',
    '성장 마인드셋',
    '팀 협력 능력',
    '문제 해결 접근 방식 ',
  ];

  return (
    <section className="py-16 md:py-24">
      <Container>
        <div className="space-y-8 md:space-y-16">
          {/* 두 개의 박스 영역 */}
          <div className="grid gap-6 md:grid-cols-2 md:gap-8">
            {/* 왼쪽 박스 */}
            <div className="rounded-xl bg-secondary p-8 shadow-sm">
              <h3 className="mb-6 text-lg font-bold text-foreground">
                일본 취업에 필요한 본질
              </h3>
              <div className="space-y-6">
                {leftItems.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div>
                      <h4 className="font-bold text-foreground">
                        {item.title}
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 오른쪽 박스 */}
            <div className="rounded-xl bg-primary p-8 shadow-sm">
              <div className="mb-10 flex items-center gap-4">
                <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-white/20">
                  <ThumbsUp className="size-8 text-white" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    일본 취업에서 진짜 중요한 것
                  </h3>
                  <p className="text-sm text-white/70">
                    당신의 인간성을 증명하는 5가지 키워드
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                {rightItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Check
                      className="size-5 shrink-0 text-white"
                      strokeWidth={3}
                    />
                    <span className="text-white text-base">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
