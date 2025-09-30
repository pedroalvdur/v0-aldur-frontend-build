import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { hasPermission } from "@/lib/permissions"

export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user as { role?: "admin" | "user" } | undefined
    if (!user || !hasPermission({ role: user.role }, "jobs:execute")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    // TODO: Implement actual Bajas job execution
    // This would typically involve:
    // 1. Validating permissions/authentication
    // 2. Triggering the actual job process
    // 3. Logging the execution
    // 4. Returning status and logs

    // Simulate job execution
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock execution (sometimes fails for demo)
    const shouldFail = Math.random() < 0.3 // 30% chance of failure

    if (shouldFail) {
      return NextResponse.json(
        {
          jobId: "bajas",
          status: "error",
          startTime: new Date().toISOString(),
          endTime: new Date().toISOString(),
          error: "Timeout en conexión a base de datos",
          logs: [
            `${new Date().toLocaleString("es-ES")} - Iniciando proceso de bajas`,
            `${new Date().toLocaleString("es-ES")} - ERROR: Timeout en conexión a base de datos`,
            `${new Date().toLocaleString("es-ES")} - Proceso terminado con errores`,
          ],
        },
        { status: 500 },
      )
    }

    // Mock successful execution
    const result = {
      jobId: "bajas",
      status: "success",
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      logs: [
        `${new Date().toLocaleString("es-ES")} - Iniciando proceso de bajas`,
        `${new Date().toLocaleString("es-ES")} - Conectando a base de datos`,
        `${new Date().toLocaleString("es-ES")} - Procesando registros...`,
        `${new Date().toLocaleString("es-ES")} - Proceso completado exitosamente`,
      ],
      recordsProcessed: Math.floor(Math.random() * 100) + 20,
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Bajas job error:", error)
    return NextResponse.json(
      {
        jobId: "bajas",
        status: "error",
        error: "Error ejecutando trabajo de bajas",
        logs: [`${new Date().toLocaleString("es-ES")} - Error: ${error}`],
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    // TODO: Implement job status retrieval, guard allows viewing only for admin
    const session = await getServerSession(authOptions)
    const user = session?.user as { role?: "admin" | "user" } | undefined
    if (!user || !hasPermission({ role: user.role }, "jobs:view")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const status = {
      jobId: "bajas",
      lastRun: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      status: "error",
      nextScheduledRun: null, // Manual job
    }

    return NextResponse.json(status)
  } catch (error) {
    console.error("Get bajas status error:", error)
    return NextResponse.json({ error: "Error obteniendo estado del trabajo" }, { status: 500 })
  }
}
