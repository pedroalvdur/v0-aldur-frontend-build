import { cookies } from "next/headers"
import type { NextRequest } from "next/server"

export interface User {
  id: string
  email: string
  name: string
  role: "owner" | "worker"
}

export interface AuthSession {
  user: User
  token: string
  expiresAt: number
}

// Mock user database - in production, this would be a real database
const MOCK_USERS: Record<string, { password: string; user: User }> = {
  "admin@aldur.com": {
    password: "admin123",
    user: {
      id: "1",
      email: "admin@aldur.com",
      name: "Administrador",
      role: "owner",
    },
  },
  "worker@aldur.com": {
    password: "worker123",
    user: {
      id: "2",
      email: "worker@aldur.com",
      name: "Trabajador",
      role: "worker",
    },
  },
}

export async function validateCredentials(email: string, password: string): Promise<User | null> {
  const userRecord = MOCK_USERS[email]
  if (!userRecord || userRecord.password !== password) {
    return null
  }
  return userRecord.user
}

export function generateToken(user: User): string {
  // In production, use a proper JWT library with secret key
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  }
  return btoa(JSON.stringify(payload))
}

export function verifyToken(token: string): User | null {
  try {
    const payload = JSON.parse(atob(token))
    if (payload.exp < Date.now()) {
      return null // Token expired
    }
    return {
      id: payload.userId,
      email: payload.email,
      name: MOCK_USERS[payload.email]?.user.name || "Unknown",
      role: payload.role,
    }
  } catch {
    return null
  }
}

export async function getServerSession(): Promise<User | null> {
  const cookieStore = cookies()
  const token = cookieStore.get("auth-token")?.value

  if (!token) {
    return null
  }

  return verifyToken(token)
}

export function getSessionFromRequest(request: NextRequest): User | null {
  const token = request.cookies.get("auth-token")?.value

  if (!token) {
    return null
  }

  return verifyToken(token)
}
