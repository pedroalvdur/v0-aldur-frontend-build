import NextAuth from "next-auth"
import { authOptions, isAuthConfigured } from "@/lib/auth-options"
import { NextResponse } from "next/server"

if (!isAuthConfigured) {
  console.warn(
    "[NextAuth] Running with incomplete configuration. Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and NEXTAUTH_SECRET environment variables.",
  )
}

const handler = NextAuth(authOptions)

async function wrappedHandler(req: Request, context: any) {
  try {
    return await handler(req, context)
  } catch (error) {
    console.error("[NextAuth] Handler error:", error)
    return NextResponse.json(
      {
        error: "Authentication service error",
        message: isAuthConfigured
          ? "An error occurred during authentication"
          : "Authentication is not properly configured. Please set required environment variables.",
      },
      { status: 500 },
    )
  }
}

export { wrappedHandler as GET, wrappedHandler as POST }
