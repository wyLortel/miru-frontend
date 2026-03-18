import { Badge } from '@/shared/ui/badge';
import { Container } from '@/shared/ui/container';
import { Card, CardContent } from '@/shared/ui/card';
import { AnalysisTipCard } from './analysis-tip-card';

interface ContentPart {
  text: string;
  highlight: boolean;
}

type PointContent = string | ContentPart[];

interface TipData {
  badgeLabel: string;
  pointContent: PointContent;
  bottomContent: string;
}

export function AnalysisTipsExample() {
  const headerData = {
    badgeLabel: '좋은 태도',
    title: '같은 경험, 다른 깊이',
    description: '합격과 불합격은 여기서 갈립니다.',
    question: '대학시절 가장 열정을 쏟은 것은 무엇인가요?',
  };

  const failData: TipData = {
    badgeLabel: '아쉬운 분석',
    pointContent: [
      { text: '학생회 임원으로서 축제를 ', highlight: false },
      { text: '성공적으로', highlight: true },
      { text: ' 기획했습니다. 팀원들과 ', highlight: false },
      { text: '소통하며 열심히', highlight: true },
      {
        text: ' 준비했고, 많은 학우들이 참여해 보람을 느꼈습니다. 이 경험을 통해 ',
        highlight: false,
      },
      { text: '리더십과 소통의 중요성', highlight: true },
      { text: '을 배웠습니다.', highlight: false },
    ] as ContentPart[],
    bottomContent:
      '문제점: 추상적 단어 남발 (성공적, 열심히, 소통, 리더십)… → 구체적인 근거가 없고 누구나 쓸 수 있는 이야기.',
  };

  const passData: TipData = {
    badgeLabel: '좋은 분석',
    pointContent: [
      { text: '"작년 축제 당시, 예산 대비 ', highlight: false },
      { text: '30% 감소', highlight: true },
      {
        text: '한 환경 문제를 해결하기 위해 데이터 기반 테마 선정을 주도했습니다. (',
        highlight: false,
      },
      { text: 'Why 1: 왜 주도했나?', highlight: true },
      {
        text: ') 단순히 즐기는 축제보다, 학우들의 니즈를 반영하는 것이 학생회의 존재 이유라고 생각했기 때문입니다. 기존 방식은 그대로 유지하는 선택지도 있었지만, 200명의 설문 데이터를 분석해 지속가능성을 핵심 키워드로 결정했습니다. (',
        highlight: false,
      },
      { text: 'Why 2: 왜 설문했나?', highlight: true },
      {
        text: ') 결과적으로 단순 참여율이 아니라, 객관적 근거를 바탕으로 행사를 개선하기 때문입니다. ',
        highlight: false,
      },
      { text: '최종 참여율은 전년 대비 150% 상승', highlight: true },
      { text: '했습니다."', highlight: false },
    ] as ContentPart[],
    bottomContent:
      '장점: 구체적 수치 제시, 행동의 이유와 판단 기준이 명확히 드러남.',
  };

  return (
    <section className="bg-white py-16 md:py-24">
      <Container>
        <div className="space-y-8 md:space-y-12">
          {/* Header Section */}
          <div className="text-center space-y-3">
            <Badge className="px-6 py-2  text-base">
              {headerData.badgeLabel}
            </Badge>
            <div className="space-y-1">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                {headerData.title}
              </h2>
              <p className="text-sm text-muted-foreground">
                {headerData.description}
              </p>
            </div>
          </div>

          {/* Question Box */}
          <Card className="bg-white shadow-sm border border-gray-300">
            <CardContent className="pt-4 pb-4">
              <p className="text-center text-sm text-foreground font-medium">
                {headerData.question}
              </p>
            </CardContent>
          </Card>

          {/* Fail and Pass Cards */}
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
            {/* Fail Card */}
            <AnalysisTipCard
              type="fail"
              badgeLabel={failData.badgeLabel}
              pointTitle="탈락 포인트"
              pointContent={failData.pointContent}
              bottomTitle="문제점"
              bottomContent={failData.bottomContent}
            />

            {/* Pass Card */}
            <AnalysisTipCard
              type="pass"
              badgeLabel={passData.badgeLabel}
              pointTitle="합격 포인트"
              pointContent={passData.pointContent}
              bottomTitle="장점"
              bottomContent={passData.bottomContent}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
