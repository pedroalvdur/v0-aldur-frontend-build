import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getSessionFromRequest } from "@/lib/auth"

// Define protected routes
const protectedRoutes = ["/chat", "/jobs", "/dashboard"]
const authRoutes = ["/login"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const user = getSessionFromRequest(request)

  // If user is authenticated and trying to access auth pages, redirect to dashboard
  if (user && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // If user is not authenticated and trying to access protected routes, redirect to login
  if (!user && protectedRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Allow the request to continue
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
