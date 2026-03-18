import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Suspense } from 'react';
import './globals.css';
import TanStackProvider from './providers/TanStackProvider';
import { AuthProvider } from './providers/AuthProvider';
import { GlobalModal } from './providers/GlobalModal';
import { Header } from '@/widgets/header/ui/Header';
import { Footer } from '@/widgets/footer/ui/Footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'miru | 일본 취업 자기분석 서비스',
  description: '일본 취업을 준비하는 한국인을 위한 자기분석 서비스',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TanStackProvider>
          <Suspense>
            <AuthProvider>
              <Header />
              <main>{children}</main>
              <Footer />
              <GlobalModal />
            </AuthProvider>
          </Suspense>
        </TanStackProvider>
      </body>
    </html>
  );
}
