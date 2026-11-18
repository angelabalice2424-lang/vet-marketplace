import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes = ['/dashboard'];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));

  if (isProtectedRoute) {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    // Token verification is optional here - we just check if it exists
    // Full validation happens on the page level if needed
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
