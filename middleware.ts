import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";

const signInRoutes = ["/login", "/register"];
const protectedRoutes = ["/dashboard", "/explore", "/session", "/profile"];

export default async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const { pathname } = request.nextUrl;

  const isSignInRoute = signInRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isRoot = pathname === "/";

  // If authenticated and on sign-in routes, redirect to dashboard
  if (sessionCookie && isSignInRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If not authenticated and on protected routes, redirect to login
  if (!sessionCookie && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If authenticated and on root, redirect to dashboard
  if (sessionCookie && isRoot) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Allow unauthenticated users to access the landing page (/)
  // Allow authenticated users to access other routes
  return NextResponse.next();
}

export const config = {
  // Run middleware on all routes except static assets and api routes
  matcher: ["/((?!.*\\..*|_next|api).*)"],
};
