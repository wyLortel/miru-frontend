import { Badge } from '@/shared/ui/badge';
import { Container } from '@/shared/ui/container';

export function AnalysisTipsHero() {
  return (
    <section className="bg-main py-16 md:py-24 mt-10">
      <Container>
        <div className="space-y-8 text-center">
          {/* Badge */}
          <div className="inline-block rounded-full bg-white/10 px-4 py-2">
            <span className="text-base font-semibold text-white">
              Miru - 일본취업자기분석 가이드
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-white md:text-4xl leading-relaxed">
            당신의 자기분석
            <br />
            일본 면접관도 그렇게 생각할까요?
          </h1>

          {/* Description Box */}
          <div className="mx-auto max-w-2xl rounded-xl bg-white/10 p-8 text-white/60">
            <p className="text-base leading-relaxed md:text-lg">
              일본어 교수님, 현직 인사담당자, 취업 에이전트분들과 상담하며
              공통적으로 들었던 말이 있습니다. 많은 지원자가 자기분석을
              ‘끝냈다’고 생각하지만, 실제 면접에서는 그 깊이가 드러납니다.
              겉핥기식으로 정리된 답변만으로는 일본 기업이 보고 싶은 사람다움과
              사고의 깊이를 충분히 전달하기 어렵습니다.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
