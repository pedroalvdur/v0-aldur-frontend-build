"use client"

import type React from "react"
import { createContext, useContext, useMemo } from "react"
import { SessionProvider, signIn, signOut, useSession } from "next-auth/react"

export interface AppUser {
  id?: string
  name?: string | null
  email?: string | null
  role?: "admin" | "user"
}

interface AuthContextType {
  user: AppUser | null
  loading: boolean
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  isAdmin: boolean
  isUser: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function InnerAuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()

  const value = useMemo<AuthContextType>(() => {
    const user = (session?.user as AppUser) || null
    const role = user?.role || "user"
    return {
      user,
      loading: status === "loading",
      loginWithGoogle: async () => {
        await signIn("google")
      },
      logout: async () => {
        await signOut({ callbackUrl: "/" })
      },
      isAdmin: role === "admin",
      isUser: role === "user",
    }
  }, [session, status])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <InnerAuthProvider>{children}</InnerAuthProvider>
    </SessionProvider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
