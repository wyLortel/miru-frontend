import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = [
  '/mypage',
  '/write',
  '/boards/:id/edit',
  '/inquiries/write',
  '/about-analysis',
  '/admin',
  '/terms',
];

export function middleware(req: NextRequest) {
  if (process.env.NODE_ENV === 'development') return NextResponse.next();

  const pathname = req.nextUrl.pathname;

  const isProtected = protectedRoutes.some((p) => {
    if (p.includes(':id')) {
      // Match pattern like /boards/123/edit
      return pathname.match(/^\/boards\/\d+\/edit(\/|$)/);
    }
    return pathname.startsWith(p);
  });

  /* ⭐ Spring 세션 쿠키 */

  const session = req.cookies.get('JSESSIONID');

  if (isProtected && !session) {
    const redirectUrl = `/login?redirect=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(new URL(redirectUrl, req.url));
  }

  return NextResponse.next();
}

// 특정 경로에 대해서만 미들웨어가 실행되도록 설정합니다
export const config = {
  matcher: [
    '/mypage/:path*',
    '/write/:path*',
    '/boards/:id/edit',
    '/inquiries/:path*',
    '/about-analysis/:path*',
    '/admin/:path*',
    '/terms',
  ],
};
