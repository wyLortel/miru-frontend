import Image from 'next/image';
import Link from 'next/link';

export const Logo = () => {
  return (
    <Link href="/analysis">
      <Image
        src="/miru_logo.webp" // public/logo.webp를 가리킵니다.
        alt="MIRU 로고"
        width={120}
        height={40}
      />
    </Link>
  );
};
