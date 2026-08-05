import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Paths that do not require authentication
  if (pathname.startsWith("/admin/login") || pathname.startsWith("/api/admin/login")) {
    return NextResponse.next();
  }

  // Check if we are trying to access protected admin routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    const payload = await verifyToken(token);

    if (!payload || payload.role !== "ADMIN") {
      // If token is invalid or user is not an ADMIN, redirect to login
      // We could also clear the cookie here if we wanted
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // Token is valid, allow the request to proceed
    return NextResponse.next();
  }

  return NextResponse.next();
}

// Config to specify which routes this middleware applies to
export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*"
  ],
};
