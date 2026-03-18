'use client';

import { formatDate } from '@/shared/lib/formatDate';

interface RelativeTimeProps {
  isoString: string;
}

export function RelativeTime({ isoString }: RelativeTimeProps) {
  return <time dateTime={isoString}>{formatDate(isoString)}</time>;
}
