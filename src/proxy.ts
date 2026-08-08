import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define public paths that don't need auth checks here
  const publicPaths = [
    "/admin/login", 
    "/api/admin/login", 
    "/login", 
    "/api/student/login",
    "/register",
    "/api/auth/logout"
  ];

  if (publicPaths.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // --- ADMIN ROUTES PROTECTION ---
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    const payload = await verifyToken(token);

    if (!payload || (payload.role !== "BOYS_ADMIN" && payload.role !== "GIRLS_ADMIN")) {
      // If a student tries to access admin, send them to their dashboard
      if (payload && payload.role === "STUDENT") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    return NextResponse.next();
  }

  // --- STUDENT ROUTES PROTECTION ---
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/api/student")) {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const payload = await verifyToken(token);

    if (!payload || payload.role !== "STUDENT") {
      // If an admin tries to access student dashboard, send them to admin portal
      if (payload && (payload.role === "BOYS_ADMIN" || payload.role === "GIRLS_ADMIN")) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

// Config to specify which routes this proxy applies to
export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/dashboard/:path*",
    "/api/student/:path*"
  ],
};

export default proxy;
