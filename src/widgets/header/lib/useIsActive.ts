import { usePathname } from 'next/navigation';

export const useIsActive = (href: string): boolean => {
  const pathname = usePathname();
  return pathname === href;
};
