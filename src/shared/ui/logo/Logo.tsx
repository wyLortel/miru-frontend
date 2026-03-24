import Link from 'next/link';

export const Logo = () => {
  return (
    <Link href="/analysis">
      <img
        src="/miru_logo.webp"
        alt="MIRU 로고"
        width={120}
        height={40}
      />
    </Link>
  );
};
