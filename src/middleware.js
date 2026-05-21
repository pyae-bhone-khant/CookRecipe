import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // If request is for Next.js internals, continue
  if (pathname.startsWith("/_next") || pathname.startsWith("/public")) {
    return NextResponse.next();
  }

   if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }
   if (pathname.startsWith("/api/users")) {
    return NextResponse.next();
  }

  // Public page: "/" is public only
  if (pathname === "/") {
    return NextResponse.next();
  }

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.redirect(new URL("/users/sign-in", request.url));
  }

  // For /admin routes, check if token.role is "admin"
  if (pathname.startsWith("/admin") && token.role !== "admin") {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // All other routes that are matched here require authentication
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/home/:path*",
    "/recipes/:path*",
    "/about/:path*",
    "/contact/:path*",
    "/admin/:path*",
    "/api/:path*",
  ],
};
