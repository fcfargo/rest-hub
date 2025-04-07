import { nanoid } from 'nanoid';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /**
   *  next-auth 및 정적 리소스 경로는 CSP 정책에서 제외
   * 이유: next-auth는 OAuth 플로우 중 inline script를 사용하므로
   * CSP 정책을 적용하면 인증 흐름이 중단될 수 있음.
   * 반면, 일반 클라이언트 컴포넌트는 Next.js가 외부 스크립트로 처리해주기 때문에
   * CSP를 위반하지 않고 안전하게 동작
   */
  if (
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/assets')
  ) {
    return NextResponse.next();
  }

  // nonce 생성
  const nonce = nanoid();
  const response = NextResponse.next();

  // CSP 헤더 설정
  response.headers.set(
    'Content-Security-Policy',
    `default-src 'self'; script-src 'self' 'nonce-${nonce}'; style-src 'self' 'unsafe-inline'; frame-src https://accounts.google.com;`,
  );

  // nonce를 쿠키에 저장 (클라이언트에서 Script 컴포넌트에 적용하려면 필요)
  response.cookies.set('nonce', nonce);

  return response;
}
