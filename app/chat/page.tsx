import { auth } from "@/auth"
import { redirect } from "next/navigation"
import ChatPageClient from "./chat-page-client"

export default async function ChatPage() {
  const session = await auth()

  if (!session) {
    redirect("/login?callbackUrl=/chat")
  }

  return <ChatPageClient />
}
