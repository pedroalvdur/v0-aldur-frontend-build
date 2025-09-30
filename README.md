# Aldur - Herramienta de Operaciones Internas

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/pedroj9821-8802s-projects/v0-aldur-frontend-build)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/pEZIVe4gxrv)

## Overview

Herramienta interna de operaciones con chat RAG (Retrieval-Augmented Generation) y dashboard de trabajos. Incluye autenticación segura con enlaces mágicos por correo electrónico y lista blanca de usuarios autorizados.

## Features

- **Chat RAG**: Interfaz de chat con Pinecone Assistant para consultas inteligentes
- **Dashboard de Trabajos**: Gestión y visualización de trabajos con filtros y búsqueda
- **Autenticación Segura**: Sistema de autenticación passwordless con NextAuth.js
- **Email Whitelist**: Control de acceso mediante lista blanca de correos electrónicos
- **Protección de Rutas**: Middleware para proteger rutas sensibles

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Authentication**: NextAuth.js con Email Provider
- **Database**: Vercel Postgres con Prisma ORM
- **AI/RAG**: Pinecone Assistant
- **UI**: Tailwind CSS + shadcn/ui
- **Deployment**: Vercel

## Setup

### 1. Install Dependencies

\`\`\`bash
pnpm install
\`\`\`

### 2. Configure Environment Variables

Create a `.env.local` file with the following variables:

\`\`\`env
# Database (Vercel Postgres)
POSTGRES_PRISMA_URL=your_postgres_prisma_url
POSTGRES_URL_NON_POOLING=your_postgres_url_non_pooling

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here

# Email Server (SMTP)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your_email@gmail.com
EMAIL_SERVER_PASSWORD=your_app_password
EMAIL_FROM=noreply@aldur.com

# Email Whitelist (comma-separated)
ALLOWED_EMAILS=aldurbot@gmail.com,user2@example.com

# Pinecone
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_ASSISTANT_NAME=aldur
PINECONE_BASE_URL=your_pinecone_base_url
\`\`\`

### 3. Setup Database

Run the Prisma migrations to create the necessary tables:

\`\`\`bash
pnpm prisma generate
pnpm prisma db push
\`\`\`

Or run the SQL initialization script in the `scripts` folder.

### 4. Configure Email Provider

For Gmail SMTP:
1. Enable 2-factor authentication on your Google account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the App Password as `EMAIL_SERVER_PASSWORD`

### 5. Generate NextAuth Secret

\`\`\`bash
openssl rand -base64 32
\`\`\`

Use the output as your `NEXTAUTH_SECRET`.

### 6. Run Development Server

\`\`\`bash
pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Authentication Flow

1. User enters their email on the login page
2. System checks if email is in the whitelist
3. If authorized, a magic link is sent to the user's email
4. User clicks the magic link to authenticate
5. Session is created and stored in the database
6. User can access protected routes (/chat, /jobs)

## Managing Email Whitelist

Add authorized emails in two ways:

1. **Hardcoded** (for permanent users): Edit `lib/email-whitelist.ts`
2. **Environment Variable** (for flexible deployment): Add to `ALLOWED_EMAILS` in `.env.local`

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add all environment variables in Vercel Project Settings
4. Deploy

**Live Deployment**: [https://vercel.com/pedroj9821-8802s-projects/v0-aldur-frontend-build](https://vercel.com/pedroj9821-8802s-projects/v0-aldur-frontend-build)

### Environment Variables in Production

Make sure to set all environment variables in Vercel:
- Go to Project Settings → Environment Variables
- Add all variables from `.env.local`
- Update `NEXTAUTH_URL` to your production URL

## Project Structure

\`\`\`
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/  # NextAuth API routes
│   │   ├── chat/                # Chat API endpoints
│   │   └── jobs/                # Jobs API endpoints
│   ├── chat/                    # Chat page (protected)
│   ├── jobs/                    # Jobs dashboard (protected)
│   ├── login/                   # Login pages
│   └── page.tsx                 # Landing page
├── components/
│   ├── ui/                      # shadcn/ui components
│   ├── header.tsx               # App header with auth
│   └── providers.tsx            # NextAuth SessionProvider
├── lib/
│   ├── auth.ts                  # NextAuth configuration
│   ├── auth-helpers.ts          # Auth utility functions
│   ├── email-whitelist.ts       # Email whitelist logic
│   └── prisma.ts                # Prisma client
├── prisma/
│   └── schema.prisma            # Database schema
└── middleware.ts                # Route protection
\`\`\`

## Development

Continue building your app on [v0.app](https://v0.app/chat/projects/pEZIVe4gxrv)

## Support

For issues or questions, contact the development team or open an issue in the repository.
