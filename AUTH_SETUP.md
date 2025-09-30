# NextAuth.js Setup Guide

This application uses NextAuth.js v5 with Email Provider for passwordless authentication via magic links.

## Environment Variables Required

Add these to your Vercel project or `.env.local`:

\`\`\`env
# NextAuth
AUTH_SECRET=<generate-with-openssl-rand-base64-32>

# Email Server (SMTP)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=noreply@yourdomain.com

# Allowed Emails (comma-separated)
ALLOWED_EMAILS=aldurbot@gmail.com,user2@example.com,user3@example.com

# Database (already configured via Neon integration)
DATABASE_URL=<from-neon-integration>
\`\`\`

## How It Works

1. **Passwordless Login**: Users enter their email on `/login`
2. **Magic Link**: System sends an email with a secure login link
3. **Email Whitelist**: Only emails in `ALLOWED_EMAILS` can sign in
4. **Session Management**: Sessions stored in Neon database, valid for 30 days
5. **Route Protection**: `/chat` and `/jobs` routes require authentication

## Database Schema

The following tables are already set up in your Neon database:

- `users` - User accounts
- `accounts` - OAuth accounts (if needed later)
- `sessions` - Active user sessions
- `verification_tokens` - Magic link tokens

## Protected Routes

Routes are protected via middleware (`middleware.ts`):
- `/chat` - Requires authentication
- `/jobs` - Requires authentication
- `/login` - Redirects to `/chat` if already authenticated
- `/` - Public landing page

## Adding New Allowed Emails

Update the `ALLOWED_EMAILS` environment variable in Vercel:
\`\`\`
ALLOWED_EMAILS=aldurbot@gmail.com,newuser@example.com
\`\`\`

## SMTP Setup (Gmail Example)

1. Enable 2-factor authentication on your Google account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the app password as `EMAIL_SERVER_PASSWORD`

## Testing

1. Navigate to `/login`
2. Enter a whitelisted email
3. Check your inbox for the magic link
4. Click the link to sign in
5. You'll be redirected to `/chat`

## Security Features

- ✅ Email whitelist enforcement
- ✅ Secure session tokens stored in database
- ✅ CSRF protection via NextAuth
- ✅ HTTP-only cookies
- ✅ Automatic session expiration (30 days)
- ✅ Magic links expire after use
