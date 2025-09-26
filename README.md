# Aldur frontend build

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/pedroj9821-8802s-projects/v0-aldur-frontend-build)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/pEZIVe4gxrv)

## Overview

This repository will stay in sync with your deployed chats on [v0.app](https://v0.app).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.app](https://v0.app).

## Deployment

Your project is live at:

**[https://vercel.com/pedroj9821-8802s-projects/v0-aldur-frontend-build](https://vercel.com/pedroj9821-8802s-projects/v0-aldur-frontend-build)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/projects/pEZIVe4gxrv](https://v0.app/chat/projects/pEZIVe4gxrv)**

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

## Pinecone Assistant quick test

The API route `app/api/chat/route.ts` calls Pinecone Assistants REST. It reads credentials from server env, but also includes a temporary server-only fallback in `lib/server-secrets.ts` for quick preview testing.

Warning: The fallback contains a secret and is for short-lived testing only. Remove it after validation.

### Local run

1. Install deps: `pnpm install`
2. Start dev: `pnpm dev`
3. Open the Chat page and send a message to hit `/api/chat`.

Optional: `.env.local`

```
PINECONE_API_KEY=your_key
PINECONE_ASSISTANT_NAME=aldur
```

### Push with GitHub Desktop

1. Open this repo folder.
2. Commit the updated files:
   - `app/api/chat/route.ts`
   - `app/chat/page.tsx`
   - `lib/server-secrets.ts`
3. Push to `main` and let V0/Vercel build the preview.

### Test in V0 preview

1. Open the preview URL from V0/Vercel
2. Go to Chat page and send a prompt.

### Clean up after testing

1. Delete `lib/server-secrets.ts`
2. Remove its import and fallback from `app/api/chat/route.ts`
3. Set env vars in your hosting (e.g., Vercel → Project Settings → Environment Variables) and redeploy.