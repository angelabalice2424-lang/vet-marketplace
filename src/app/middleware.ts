import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Public routes that don't need auth
  const publicRoutes = ["/login", "/signup"];
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Protected routes - require auth
  // Check if authjs session cookie exists (NextAuth v5 uses __Secure- prefix in production)
  const sessionCookie = request.cookies.get("authjs.session-token")?.value ||
                       request.cookies.get("__Secure-authjs.session-token")?.value;

  if (pathname.startsWith("/dashboard")) {
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|.*\\..*|api).*)", "/api/:path*"],
};
