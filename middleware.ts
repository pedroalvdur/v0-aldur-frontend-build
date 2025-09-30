import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(req: NextRequest) {
  // Get the token from the request
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  // If no token, redirect to login
  if (!token) {
    const loginUrl = new URL("/login", req.url)
    loginUrl.searchParams.set("callbackUrl", req.url)
    return NextResponse.redirect(loginUrl)
  }

  // User is authenticated, continue
  return NextResponse.next()
}

// Protect these routes
export const config = {
  matcher: ["/chat/:path*", "/jobs/:path*", "/api/chat/:path*", "/api/jobs/:path*"],
}
