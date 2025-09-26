"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sidebar } from "@/components/sidebar"
import { ChatBubble } from "@/components/chat-bubble"
import { Send, Loader2 } from "lucide-react"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hola, soy Aldur Bot. ¿En qué puedo ayudarte hoy?",
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input.trim() }),
      })

      if (!response.ok) {
        const text = await response.text()
        throw new Error(text || "Error en la respuesta")
      }

      const data = (await response.json()) as { message?: string }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data?.message ?? "(Sin contenido de respuesta)",
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Chat error:", error)
      let details = ""
      if (error instanceof Error && error.message) {
        try {
          const parsed = JSON.parse(error.message)
          const attempts = Array.isArray(parsed?.attempts) ? parsed.attempts : []
          const first = attempts?.[0]
          details = [
            parsed?.note ? `Nota: ${parsed.note}` : "",
            parsed?.assistantName ? `assistantName: ${parsed.assistantName}` : "",
            parsed?.assistantId ? `assistantId: ${parsed.assistantId}` : "",
            parsed?.baseUrl ? `baseUrl: ${parsed.baseUrl}` : "",
            parsed?.keySource ? `keySource: ${parsed.keySource}` : "",
            attempts?.length ? `intentos: ${attempts.length}` : "",
            first ? `primer intento: {url: ${first.url}, auth: ${first.auth}, status: ${first.status}}` : "",
          ]
            .filter(Boolean)
            .join("\n")
        } catch (_) {
          details = error.message?.slice(0, 1000)
        }
      }
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Ha ocurrido un error al consultar Pinecone.\n${details || "Revisa la consola para más información."}`,
        role: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-h-0">
        {/* Chat Header */}
        <div className="border-b border-border p-4 flex-shrink-0">
          <h1 className="text-xl font-semibold">Chat con Aldur Bot</h1>
          <p className="text-sm text-muted-foreground">Haz preguntas y obtén respuestas inteligentes</p>
        </div>

        <div className="flex-1 min-h-0 overflow-hidden">
          <ScrollArea className="h-full p-4">
            <div className="space-y-4 max-w-4xl mx-auto">
              {messages.map((message) => (
                <ChatBubble key={message.id} message={message} />
              ))}
              {isLoading && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Cargando...</span>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        <div className="border-t border-border p-4 flex-shrink-0">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu mensaje..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading || !input.trim()}>
                <Send className="h-4 w-4" />
                <span className="sr-only">Enviar</span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
