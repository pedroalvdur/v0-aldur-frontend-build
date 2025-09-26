import { type NextRequest, NextResponse } from "next/server"
import { validateCredentials, generateToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password, provider } = await request.json()

    if (provider === "google") {
      // TODO: Implement Google OAuth flow
      return NextResponse.json(
        {
          success: false,
          error: "Google login no implementado aún",
        },
        { status: 400 },
      )
    }

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "Email y contraseña requeridos",
        },
        { status: 400 },
      )
    }

    const user = await validateCredentials(email, password)

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Credenciales inválidas",
        },
        { status: 401 },
      )
    }

    // Generate JWT token
    const token = generateToken(user)

    // Create response with secure cookie
    const response = NextResponse.json({
      success: true,
      user,
      redirectUrl: "/dashboard",
    })

    // Set secure httpOnly cookie
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 24 hours
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Error interno del servidor",
      },
      { status: 500 },
    )
  }
}
