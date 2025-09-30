import NextAuth from "next-auth"
import NeonAdapter from "@auth/neon-adapter"
import { neon } from "@neondatabase/serverless"
import { createTransport } from "nodemailer"

const sql = neon(process.env.DATABASE_URL!)

// Whitelist of allowed emails
const ALLOWED_EMAILS = process.env.ALLOWED_EMAILS?.split(",").map((email) => email.trim()) || ["aldurbot@gmail.com"]

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: NeonAdapter(sql),
  providers: [
    {
      id: "email",
      type: "email",
      name: "Email",
      maxAge: 24 * 60 * 60, // 24 hours
      async sendVerificationRequest({ identifier: email, url, provider }) {
        const transport = createTransport({
          host: process.env.EMAIL_SERVER_HOST,
          port: Number(process.env.EMAIL_SERVER_PORT),
          auth: {
            user: process.env.EMAIL_SERVER_USER,
            pass: process.env.EMAIL_SERVER_PASSWORD,
          },
        })

        const result = await transport.sendMail({
          to: email,
          from: process.env.EMAIL_FROM,
          subject: "Sign in to Aldur Operations Tool",
          text: `Sign in to Aldur Operations Tool\n\nClick the link below to sign in:\n${url}\n\n`,
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
              </head>
              <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                  <h1 style="color: white; margin: 0; font-size: 28px;">Aldur Operations Tool</h1>
                </div>
                <div style="background: #f9f9f9; padding: 40px 30px; border-radius: 0 0 10px 10px;">
                  <h2 style="color: #333; margin-top: 0;">Sign in to your account</h2>
                  <p style="color: #666; font-size: 16px; margin-bottom: 30px;">Click the button below to securely sign in to Aldur Operations Tool:</p>
                  <div style="text-align: center; margin: 40px 0;">
                    <a href="${url}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 40px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; display: inline-block;">Sign In</a>
                  </div>
                  <p style="color: #999; font-size: 14px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd;">
                    If you didn't request this email, you can safely ignore it. This link will expire in 24 hours.
                  </p>
                </div>
              </body>
            </html>
          `,
        })

        const failed = result.rejected.concat(result.pending).filter(Boolean)
        if (failed.length) {
          throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`)
        }
      },
    },
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
