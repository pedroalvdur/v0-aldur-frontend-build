"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function AuthConfigBanner() {
  if (process.env.NODE_ENV === "production") {
    return null
  }

  return (
    <Alert variant="destructive" className="m-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Authentication Not Configured</AlertTitle>
      <AlertDescription>
        Google OAuth credentials are missing. Please set the following environment variables:
        <ul className="mt-2 list-inside list-disc">
          <li>GOOGLE_CLIENT_ID</li>
          <li>GOOGLE_CLIENT_SECRET</li>
          <li>NEXTAUTH_SECRET</li>
        </ul>
      </AlertDescription>
    </Alert>
  )
}
