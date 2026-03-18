'use client';

import Link from 'next/link';
import { Container } from '@/shared/ui/container';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';

export function AnalysisTipsCta() {
  const questions = [
    {
      title:
        '내답변에 열심히 , 최선을 다해 , 소통 같은 추상적인 단어가 3개 이상 있나요?',
      description: '있다면 구체적인 에피소드로 바꾸세요!',
    },
    {
      title:
        '나의 행동에 대한 이유(왜?)가 적혀있나요? 3번 이상 왜? 라고 물어보았을때 대답 하실수 있으신가요?',
      description: '추상적인 교훈이 아닌, 당신만의 구체적인 기준을 제시하세요!',
    },
    {
      title:
        '그 경험을 통해 얻은 나만의 가치관 이나 깨달음이 한문장으로 정리되었나요?',
      description: '겪은 일보다, 그 경험을 어떻게 해석했는지가 더 중요합니다.',
    },
    {
      title: '면접관이 "이 사람과 함께 일하고 싶다"고 느끼게 할 수 있을까?',
      description:
        '면접은 능력을 보여주는 자리이면서, 함께 일할 사람을 만나는 자리이기도 합니다.',
    },
  ];

  return (
    <section className="bg-primary/10 py-16 md:py-24">
      <Container>
        <div className="space-y-8 md:space-y-12">
          {/* Header */}
          <div className="space-y-4 text-center">
            <h2 className="text-2xl font-bold text-foreground md:text-4xl">
              지금 당장 내글에 적용해 보기
            </h2>
            <p className="mx-auto max-w-2xl text-sm text-muted-foreground md:text-base leading-relaxed">
              아래 체크리스트로 내 답변을 점검해세요
            </p>
          </div>

          {/* Questions Container */}
          <Card className="bg-primary/15 border-0">
            <CardContent className="pt-8 pb-8 space-y-4">
              {/* Questions List */}
              <div className="space-y-3">
                {questions.map((item, index) => (
                  <Card key={index} className="bg-white border-0 shadow-sm">
                    <CardContent className="pt-4 pb-4">
                      <p className="text-sm font-semibold text-foreground mb-1">
                        {item.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* CTA Button */}
              <div className="flex justify-center pt-4">
                <Link href="/analysis">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 cursor-pointer"
                  >
                    자기분석 하러가기
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </section>
  );
}
