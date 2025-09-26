import { NextResponse } from "next/server"
import { getServerSession } from "@/lib/auth"

export async function GET() {
  try {
    const user = await getServerSession()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Session check error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
