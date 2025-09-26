import { type NextRequest, NextResponse } from "next/server"
import { serverSecrets } from "@/lib/server-secrets"

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Mensaje requerido" }, { status: 400 })
    }

    const apiKey = process.env.PINECONE_API_KEY || serverSecrets.pineconeApiKey
    const assistantName = process.env.PINECONE_ASSISTANT_NAME || serverSecrets.pineconeAssistantName

    // Note: apiKey may come from serverSecrets fallback for quick testing

    // Call Pinecone Assistants REST API (non-streaming)
    const url = `https://api.pinecone.io/assistant/assistants/${encodeURIComponent(
      assistantName,
    )}/chat/completions`

    const pcResponse = await fetch(url, {
      method: "POST",
      headers: {
        "Api-Key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
      }),
    })

    if (!pcResponse.ok) {
      const text = await pcResponse.text()
      return NextResponse.json(
        { error: "Error de Pinecone", status: pcResponse.status, details: text },
        { status: 502 },
      )
    }

    const data = (await pcResponse.json()) as any

    // Try to normalize likely shapes
    const assistantContent =
      data?.message?.content ??
      data?.choices?.[0]?.message?.content ??
      data?.messages?.[0]?.content ??
      (typeof data === "string" ? data : null)

    return NextResponse.json({
      message: assistantContent ?? "(Sin contenido de respuesta)",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
