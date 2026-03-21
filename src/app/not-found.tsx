import Image from 'next/image';

export default function NotfoundPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 flex flex-col items-center justify-center">
        <Image
          src="/notfound.webp"
          alt="404 에러 우주인"
          width={400}
          height={300}
          priority
          className="object-contain"
        />
        <h1 className="text-2xl text-gray-500 mt-8 mb-4">
          페이지를 찾을 수 없습니다
        </h1>
      </main>
    </div>
  );
}
