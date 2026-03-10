import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/mypage', '/write', '/board/:id/edit', '/inquiry/write'];

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  const isProtected = protectedRoutes.some((p) => {
    if (p.includes(':id')) {
      // Match pattern like /board/123/edit
      return pathname.match(/^\/board\/\d+\/edit(\/|$)/);
    }
    return pathname.startsWith(p);
  });

  /* ⭐ Spring 세션 쿠키 */

  const session = req.cookies.get('JSESSIONID');

  if (isProtected && !session) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

// 특정 경로에 대해서만 미들웨어가 실행되도록 설정합니다
export const config = {
  matcher: ['/mypage/:path*', '/write/:path*', '/board/:id/edit', '/inquiry/:path*'],
};
