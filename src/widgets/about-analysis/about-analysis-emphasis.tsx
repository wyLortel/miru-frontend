'use client';

import Link from 'next/link';
import { Button } from '@/shared/ui/button';
import { Container } from '@/shared/ui/container';

export function AboutAnalysisEmphasis() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <div className="flex flex-col items-center justify-center gap-4 text-center">
            <p className="text-base font-medium text-blue-600 md:text-lg">
              지금 바로 시작하세요
            </p>
            <h2 className="text-2xl font-black text-foreground md:text-5xl tracking-tight">
              당신의 진정한 가치를 발견하는 여정
            </h2>
            <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg leading-relaxed mt-4">
              자기분석은 일시적인 준비가 아닙니다.{' '}
              <br className="hidden md:block" />
              이것은 당신의 커리어 전체를 위한{' '}
              <strong className="font-semibold text-foreground">
                든든한 토대
              </strong>
              를 마련하는 과정입니다.
            </p>
            <Button asChild className="mt-8">
              <Link href="/tips">
                <span className="font-bold text-lg">필독</span>
                <span className="font-bold text-lg">자기분석 팁 바로 읽기!</span>
              </Link>
            </Button>
        </div>
      </Container>
    </section>
  );
}
