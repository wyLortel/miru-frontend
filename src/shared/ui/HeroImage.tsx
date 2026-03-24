'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface HeroImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export function HeroImage({ src, alt, className, sizes, priority }: HeroImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={cn(className, 'transition-opacity duration-500', loaded ? 'opacity-100' : 'opacity-0')}
      sizes={sizes}
      priority={priority}
      onLoad={() => setLoaded(true)}
    />
  );
}
