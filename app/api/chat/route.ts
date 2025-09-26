import { type NextRequest, NextResponse } from "next/server"
import { serverSecrets } from "@/lib/server-secrets"

// Relax typing for process in environments without Node types
declare const process: any

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Mensaje requerido" }, { status: 400 })
    }

    const apiKey = process.env.PINECONE_API_KEY || serverSecrets.pineconeApiKey
    const assistantName = process.env.PINECONE_ASSISTANT_NAME || serverSecrets.pineconeAssistantName
    const assistantId = process.env.PINECONE_ASSISTANT_ID || ""
    const baseUrl = (process.env.PINECONE_BASE_URL || "https://api.pinecone.io").replace(/\/$/, "")
    const projectId = process.env.PINECONE_PROJECT_ID || ""

    // Note: apiKey may come from serverSecrets fallback for quick testing

    // Try a few likely Pinecone Assistants REST endpoints (non-streaming)
    const nameTargets = assistantName
      ? [
          `/assistant/assistants/${encodeURIComponent(assistantName)}/chat/completions`,
          `/assistants/${encodeURIComponent(assistantName)}/chat/completions`,
          `/assistant/v1/assistants/${encodeURIComponent(assistantName)}/chat/completions`,
          `/v1/assistants/${encodeURIComponent(assistantName)}/chat/completions`,
          `/assistant/assistants/${encodeURIComponent(assistantName)}/chat`,
          `/assistants/${encodeURIComponent(assistantName)}/chat`,
        ]
      : []

    const idTargets = assistantId
      ? [
          `/assistant/assistants/${encodeURIComponent(assistantId)}/chat/completions`,
          `/assistants/${encodeURIComponent(assistantId)}/chat/completions`,
          `/assistant/v1/assistants/${encodeURIComponent(assistantId)}/chat/completions`,
          `/v1/assistants/${encodeURIComponent(assistantId)}/chat/completions`,
          `/assistant/assistants/${encodeURIComponent(assistantId)}/chat`,
          `/assistants/${encodeURIComponent(assistantId)}/chat`,
        ]
      : []

    const pluginNameTargets = assistantName
      ? [
          `/plugins/assistant/assistants/${encodeURIComponent(assistantName)}/chat/completions`,
          `/plugins/assistant/v1/assistants/${encodeURIComponent(assistantName)}/chat/completions`,
          `/plugins/assistant/assistants/${encodeURIComponent(assistantName)}/chat`,
          `/plugins/assistant/v1/assistants/${encodeURIComponent(assistantName)}/chat`,
        ]
      : []

    const pluginIdTargets = assistantId
      ? [
          `/plugins/assistant/assistants/${encodeURIComponent(assistantId)}/chat/completions`,
          `/plugins/assistant/v1/assistants/${encodeURIComponent(assistantId)}/chat/completions`,
          `/plugins/assistant/assistants/${encodeURIComponent(assistantId)}/chat`,
          `/plugins/assistant/v1/assistants/${encodeURIComponent(assistantId)}/chat`,
        ]
      : []

    const candidateUrls = [...pluginIdTargets, ...pluginNameTargets, ...idTargets, ...nameTargets].map(
      (p) => `${baseUrl}${p}`,
    )

    const payload = {
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    }

    const attemptResults: Array<{
      url: string
      status: number
      body: string
      auth: "api-key" | "bearer" | "x-pinecone" | "x-api-key"
    }> = []
    let data: any = null

    for (const url of candidateUrls) {
      // Try with Api-Key and with Authorization: Bearer to be safe
      const headerVariants: Array<{
        auth: "api-key" | "bearer" | "x-pinecone" | "x-api-key"
        headers: Record<string, string>
      }> = [
        {
          auth: "api-key",
          headers: { "Api-Key": apiKey, "Content-Type": "application/json" },
        },
        {
          auth: "bearer",
          headers: { Authorization: `Bearer ${apiKey}` as string, "Content-Type": "application/json" },
        },
        {
          auth: "x-pinecone",
          headers: { "x-pinecone-api-key": apiKey, "Content-Type": "application/json" },
        },
        {
          auth: "x-api-key",
          headers: { "x-api-key": apiKey, "Content-Type": "application/json" },
        },
      ]

      // If a project id is provided, add it to all header variants
      if (projectId) {
        for (const hv of headerVariants) {
          hv.headers["x-project-id"] = projectId
        }
      }

      for (const hv of headerVariants) {
        try {
          const resp = await fetch(url, {
            method: "POST",
            headers: hv.headers,
            body: JSON.stringify(payload),
          })

          if (resp.ok) {
            data = await resp.json()
            attemptResults.push({ url, status: resp.status, body: "OK", auth: hv.auth })
            break
          } else {
            const body = await resp.text()
            attemptResults.push({ url, status: resp.status, body: body.slice(0, 2000), auth: hv.auth })
          }
        } catch (err: any) {
          attemptResults.push({ url, status: 0, body: String(err).slice(0, 1000), auth: hv.auth })
        }
      }

      if (data) break
    }

    if (!data) {
      return NextResponse.json(
        {
          error: "Error de Pinecone",
          note:
            "Todas las URL candidatas fallaron. Revisa assistantName/assistantId, baseUrl, ruta del endpoint y permisos del API key.",
          assistantName,
          assistantId: assistantId || null,
          baseUrl,
          keySource: process.env.PINECONE_API_KEY ? "env" : "fallback",
          attempts: attemptResults,
        },
        { status: 502 },
      )
    }

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
