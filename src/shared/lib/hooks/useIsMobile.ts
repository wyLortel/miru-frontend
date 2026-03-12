'use client';

import { useEffect, useState } from 'react';

export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false); // SSR: false (server/client match)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check(); // After hydration, reflect actual value
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [breakpoint]);

  return isMobile;
}
