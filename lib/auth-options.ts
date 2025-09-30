import GoogleProvider from "next-auth/providers/google"
import type { NextAuthOptions, User as NextAuthUser } from "next-auth"

// Normalize emails to compare reliably
function normalizeEmail(email: string | null | undefined): string {
  return (email || "").trim().replace(/\r|\n/g, "").toLowerCase()
}

// Static allowlist for initial testing; can be extended with env vars
const TEST_ADMIN_EMAILS = [normalizeEmail("aldurbot@gmail.com")]
const TEST_USER_EMAILS = [normalizeEmail("pedroj.98.21@gmail.com")]

function envList(name: string): string[] {
  const raw = process.env[name]
  if (!raw) return []
  return raw
    .split(",")
    .map((s) => normalizeEmail(s))
    .filter(Boolean)
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user }) {
      const email = normalizeEmail(user?.email)

      // Build allowlists from env + test entries
      const adminList = new Set<string>([...envList("ALLOWED_ADMINS"), ...TEST_ADMIN_EMAILS])
      const userList = new Set<string>([...envList("ALLOWED_USERS"), ...TEST_USER_EMAILS, ...adminList])

      // Only allow users explicitly in either list
      return adminList.has(email) || userList.has(email)
    },
    async jwt({ token, user }) {
      // On initial sign-in, set role from allowlists
      if (user) {
        const email = normalizeEmail((user as NextAuthUser).email)
        const adminList = new Set<string>([...envList("ALLOWED_ADMINS"), ...TEST_ADMIN_EMAILS])
        const role = adminList.has(email) ? "admin" : "user"
        token.role = role
        token.email = email
      }
      return token
    },
    async session({ session, token }) {
      // Expose role on the session for client-side checks
      if (session.user) {
        ;(session.user as any).role = (token as any).role || "user"
        session.user.email = token.email as string | undefined
      }
      return session
    },
  },
}

export type AppRole = "admin" | "user"


