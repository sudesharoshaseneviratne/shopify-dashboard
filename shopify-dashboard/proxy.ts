import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_COOKIE_NAME = "prasanthi_admin_session";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Intercept all administrative paths except the admin login portal and auth callbacks
  if (
    pathname.startsWith("/admin") &&
    pathname !== "/admin/login" &&
    !pathname.startsWith("/admin/auth")
  ) {
    const adminSessionCookie = request.cookies.get(ADMIN_COOKIE_NAME)?.value;

    if (!adminSessionCookie) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const session = JSON.parse(adminSessionCookie);
      if (!session || session.role !== "admin") {
        const loginUrl = new URL("/admin/login", request.url);
        return NextResponse.redirect(loginUrl);
      }
    } catch {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
