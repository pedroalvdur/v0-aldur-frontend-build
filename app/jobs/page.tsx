import { auth } from "@/auth"
import { redirect } from "next/navigation"
import JobsPageClient from "./jobs-page-client"

export default async function JobsPage() {
  const session = await auth()

  if (!session) {
    redirect("/login?callbackUrl=/jobs")
  }

  return <JobsPageClient />
}
