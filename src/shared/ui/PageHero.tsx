import type { ReactNode } from 'react';
import Image from 'next/image';
import { Container } from '@/shared/ui/container';

interface PageHeroProps {
  title: string;
  /** 강조(bold) 텍스트가 필요하면 ReactNode로 넘기세요.
   *  예) description={<>근본 있는 <strong>취준생</strong> 들의아지트</>}
   */
  description: ReactNode;
  imageSrc: string;
  imageAlt?: string;
  /** 이미지 컨테이너 클래스 오버라이드. 기본값: 원형(rounded-full overflow-hidden) */
  imageContainerClassName?: string;
  /** Next.js Image 클래스 오버라이드. 기본값: object-cover */
  imageClassName?: string;
}

export function PageHero({
  title,
  description,
  imageSrc,
  imageAlt = '',
  imageContainerClassName,
  imageClassName,
}: PageHeroProps) {
  return (
    <section className="py-12">
      <Container>
        <div className="flex items-center justify-between">
          {/* 텍스트 영역 */}
          <div className="flex flex-col gap-3">
            <h1 className="text-4xl font-black tracking-tight text-foreground max-[340px]:text-2xl">
              {title}
            </h1>
            <p className="text-base text-muted-foreground [&_strong]:font-bold [&_strong]:text-foreground max-[340px]:text-sm">
              {description}
            </p>
          </div>

          {/* 이미지 영역 */}
          <div className={imageContainerClassName ?? 'relative size-52 shrink-0 overflow-hidden rounded-full bg-muted max-[340px]:size-36 max-[318px]:size-24'}>
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              className={imageClassName ?? 'object-cover'}
              sizes="(max-width: 340px) 144px, 208px"
              priority
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
