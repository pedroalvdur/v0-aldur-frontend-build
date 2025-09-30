import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// We will validate session via next-auth cookies presence and rely on server route checks as well
function isAuthenticated(request: NextRequest): boolean {
  // NextAuth sets different cookie names depending on environment/strategy
  // We only do a soft check here; definitive checks happen in route handlers
  const hasSession = Boolean(
    request.cookies.get("next-auth.session-token") ||
      request.cookies.get("__Secure-next-auth.session-token") ||
      request.cookies.get("next-auth.callback-url"),
  )
  return hasSession
}

// Define protected routes
const protectedRoutes = ["/chat", "/jobs", "/dashboard"]
const authRoutes = ["/login"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const authed = isAuthenticated(request)

  if (authed && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  if (!authed && protectedRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Admin-only guard for jobs will be handled in the page and API route for defense-in-depth
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
