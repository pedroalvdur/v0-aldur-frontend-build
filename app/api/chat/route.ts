import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Mensaje requerido" }, { status: 400 })
    }

    const apiKey = process.env.PINECONE_API_KEY
    const assistantName = process.env.PINECONE_ASSISTANT_NAME

    if (!apiKey || !assistantName) {
      console.error("[v0] Missing required environment variables")
      return NextResponse.json({ error: "Configuración del servidor incompleta" }, { status: 500 })
    }

    const baseUrl = "https://prod-1-data.ke.pinecone.io"
    const url = `${baseUrl}/assistant/chat/${encodeURIComponent(assistantName)}`

    const payload = {
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    }

    console.log("[v0] Attempting Pinecone request to:", url)
    console.log("[v0] Using assistant name:", assistantName)

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Api-Key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      console.log("[v0] Response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.log("[v0] Error response:", errorText)

        return NextResponse.json(
          {
            error: "Error de Pinecone",
            details: `Status ${response.status}: ${errorText}`,
            assistantName,
            url,
          },
          { status: response.status },
        )
      }

      const data = await response.json()
      console.log("[v0] Success response received")

      const assistantContent =
        data?.message?.content || data?.choices?.[0]?.message?.content || data?.content || "Sin respuesta del asistente"

      return NextResponse.json({
        message: assistantContent,
        timestamp: new Date().toISOString(),
      })
    } catch (fetchError: any) {
      console.log("[v0] Fetch error:", fetchError.message)

      return NextResponse.json(
        {
          error: "Error de conexión con Pinecone",
          details: fetchError.message,
          assistantName,
          url,
        },
        { status: 502 },
      )
    }
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
