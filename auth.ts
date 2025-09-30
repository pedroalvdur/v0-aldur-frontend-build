import NextAuth from "next-auth"
import { NeonAdapter } from "@auth/neon-adapter"
import EmailProvider from "next-auth/providers/email"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

// Whitelist of allowed emails
const ALLOWED_EMAILS = process.env.ALLOWED_EMAILS?.split(",").map((email) => email.trim()) || ["aldurbot@gmail.com"]

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: NeonAdapter(sql),
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  pages: {
    signIn: "/login",
    verifyRequest: "/verify-request",
    error: "/auth/error",
  },
  callbacks: {
    async signIn({ user }) {
      // Check if email is in whitelist
      if (user.email && ALLOWED_EMAILS.includes(user.email)) {
        return true
      }
      // Reject sign-in if email is not whitelisted
      return false
    },
    async session({ session, user }) {
      // Add user id to session
      if (session.user) {
        session.user.id = user.id
      }
      return session
    },
  },
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
})
