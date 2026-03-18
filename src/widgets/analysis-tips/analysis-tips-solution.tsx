import { Badge } from '@/shared/ui/badge';
import { Container } from '@/shared/ui/container';
import { Card } from '@/shared/ui/card';
import { QuestionBox } from './question-box';

export function AnalysisTipsSolution() {
  const solutions = [
    {
      number: '1',
      title: '행동',
      subtitle: '실제로 어떤 행동을 했나요?',
      description:
        '팀 프로젝트에서 의견이 엇갈린 팀원에게 먼저 대화를 제안하고, 서로의 생각을 정리하는 시간을 만들었다.',
    },
    {
      number: '2',
      title: '이유',
      subtitle: '왜 그런 선택을 했나요?',
      description:
        '갈등을 그대로 두면 팀 분위기뿐 아니라 결과물의 완성도에도 영향을 줄 수 있다고 판단했기 때문이다.',
    },
    {
      number: '3',
      title: '가치관',
      subtitle: '어떤 배움을 얻었나요?',
      description:
        '이 경험을 통해, 불편한 문제일수록 피하기보다 직접 마주하고 조율하는 태도가 팀에도, 나 자신에게도 더 좋은 결과를 만든다는 기준을 갖게 되었다.',
    },
  ];

  return (
    <section className="py-16 md:py-24">
      <Container>
        <div className="space-y-8 md:space-y-12">
          {/* Header */}
          <div className="space-y-8 text-center">
            <Badge variant="default" className="px-6 py-2 text-base">
              핵심 솔루션
            </Badge>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground md:text-4xl">
                자기분석 3단계
              </h2>
              <p className="mx-auto max-w-2xl text-sm text-muted-foreground md:text-base leading-relaxed">
                단순히 ‘무엇을 했다’에서 멈추지 마세요. ‘왜 그렇게 행동했나요?’
                ‘그 선택의 기준은 무엇이었나요?’를
                <br /> 세 번 이상 파고들어야 진짜 당신의 모습이 나옵니다.
              </p>
            </div>
            {/* Team Problem Question */}
            <div className="mt-2 pt-2  border-gray-200">
              <QuestionBox question="팀 프로젝트에서 문제가 생겼을 때 어떻게 해결했나요?" />
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid gap-6 md:grid-cols-3">
            {solutions.map((solution) => (
              <Card key={solution.number}>
                <div className="flex flex-col items-center text-center space-y-3 pt-8 px-6 pb-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white font-bold text-lg">
                    {solution.number}
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bold text-foreground text-2xl">
                      {solution.title}
                    </h3>
                    <p className="text-sm text-muted-foreground font-medium">
                      {solution.subtitle}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed  text-gray-500 mt-2">
                    {solution.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
