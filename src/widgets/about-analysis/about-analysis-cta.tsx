'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/shared/ui/container';
import { Button } from '@/shared/ui/button';

export function AboutAnalysisCta() {
  return (
    <section className="bg-primary/10 py-16 md:py-24">
      <Container>
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          {/* 별 아이콘 */}
          <div className="relative w-12 h-12 md:w-16 md:h-16">
            <Image
              src="/assets/icons/about-star.png"
              alt="별 아이콘"
              fill
              className="object-contain"
            />
          </div>

          {/* 제목 */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground md:text-4xl">
              그래서, 일본 취업에는
            </h2>
            <h2 className="text-2xl font-bold text-foreground md:text-4xl">
              자기분석이 필수입니다
            </h2>
          </div>

          {/* 설명 */}
          <p className="max-w-3xl text-sm md:text-base text-muted-foreground leading-loose">
            일본 취업에서 가장 중요한 것은 자신을 이해하고, 그것을 언어로
            설명하는 힘입니다. 자기분석은 단순한 성격 테스트가 아닙니다. 내가
            어떤 사람인지 어떤 환경에서 잘 성장하는지 어떤 팀과 잘 맞는지 이걸
            명확히 만드는 과정입니다. Miru는 당신이 스스로를 정리하고, 일본
            기업에 전달할 수 있도록 돕는 서비스입니다.멋진 스토리가 아니어도
            괜찮습니다. 투박해도, 진짜 당신이면 충분합니다.이제, 당신의 이야기를
            시작해보세요
          </p>
          {/* 버튼 */}
          <Link href="/analysis">
            <Button size="lg" className="mt-8 bg-primary hover:bg-primary/90">
              자기분석 하러 가기
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}
