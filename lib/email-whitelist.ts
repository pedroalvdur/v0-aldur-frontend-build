// Email whitelist configuration
// Add allowed email addresses here or use environment variable

const WHITELIST_FROM_ENV = process.env.ALLOWED_EMAILS?.split(",").map((email) => email.trim().toLowerCase()) || []

const HARDCODED_WHITELIST = [
  "aldurbot@gmail.com",
  // Add more whitelisted emails here
]

export const ALLOWED_EMAILS = [...HARDCODED_WHITELIST, ...WHITELIST_FROM_ENV].map((email) => email.toLowerCase())

export function isEmailAllowed(email: string | null | undefined): boolean {
  if (!email) return false
  return ALLOWED_EMAILS.includes(email.toLowerCase())
}

export function getWhitelistCount(): number {
  return ALLOWED_EMAILS.length
}
