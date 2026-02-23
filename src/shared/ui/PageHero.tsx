import Image from 'next/image';
import { Container } from '@/shared/ui/container';

interface PageHeroProps {
  title: string;
  /** 강조(bold) 텍스트가 필요하면 ReactNode로 넘기세요.
   *  예) description={<>근본 있는 <strong>취준생</strong> 들의아지트</>}
   */
  description: React.ReactNode;
  imageSrc: string;
  imageAlt?: string;
}

export function PageHero({
  title,
  description,
  imageSrc,
  imageAlt = '',
}: PageHeroProps) {
  return (
    <section className="py-12">
      <Container>
        <div className="flex items-center justify-between">
          {/* 텍스트 영역 */}
          <div className="flex flex-col gap-3">
            <h1 className="text-4xl font-black tracking-tight text-foreground">
              {title}
            </h1>
            <p className="text-base text-muted-foreground [&_strong]:font-bold [&_strong]:text-foreground">
              {description}
            </p>
          </div>

          {/* 이미지 영역 */}
          <div className="relative size-52 shrink-0 overflow-hidden rounded-full bg-muted">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
