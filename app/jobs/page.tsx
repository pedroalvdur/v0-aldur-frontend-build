"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { JobCard } from "@/components/job-card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { RefreshCw } from "lucide-react"

interface Job {
  id: string
  name: string
  displayName: string
  lastRun: Date | null
  status: "success" | "error" | "never-run"
  logs: string[]
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([
    {
      id: "devueltos",
      name: "devueltos",
      displayName: "Devueltos",
      lastRun: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      status: "success",
      logs: [
        "2024-01-15 14:30:00 - Iniciando proceso de devueltos",
        "2024-01-15 14:30:15 - Conectando a base de datos",
        "2024-01-15 14:30:20 - Procesando 150 registros",
        "2024-01-15 14:32:45 - Proceso completado exitosamente",
        "2024-01-15 14:32:46 - 150 registros procesados, 0 errores",
      ],
    },
    {
      id: "bajas",
      name: "bajas",
      displayName: "Bajas",
      lastRun: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      status: "error",
      logs: [
        "2024-01-14 09:15:00 - Iniciando proceso de bajas",
        "2024-01-14 09:15:10 - Conectando a base de datos",
        "2024-01-14 09:15:15 - ERROR: Timeout en conexión a base de datos",
        "2024-01-14 09:15:16 - Reintentando conexión...",
        "2024-01-14 09:15:30 - ERROR: Falló después de 3 reintentos",
        "2024-01-14 09:15:31 - Proceso terminado con errores",
      ],
    },
  ])

  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRunJob = async (jobId: string) => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: "POST",
      })

      if (!response.ok) throw new Error("Error ejecutando trabajo")

      // Update job status optimistically
      setJobs((prev) =>
        prev.map((job) =>
          job.id === jobId
            ? {
                ...job,
                lastRun: new Date(),
                status: "success" as const,
                logs: [
                  ...job.logs,
                  `${new Date().toLocaleString("es-ES")} - Trabajo ejecutado manualmente`,
                  `${new Date().toLocaleString("es-ES")} - Proceso completado exitosamente`,
                ],
              }
            : job,
        ),
      )
    } catch (error) {
      console.error("Error running job:", error)
      // Update with error status
      setJobs((prev) =>
        prev.map((job) =>
          job.id === jobId
            ? {
                ...job,
                lastRun: new Date(),
                status: "error" as const,
                logs: [...job.logs, `${new Date().toLocaleString("es-ES")} - Error ejecutando trabajo: ${error}`],
              }
            : job,
        ),
      )
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      // TODO: Replace with actual API call to refresh job statuses
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call
    } catch (error) {
      console.error("Error refreshing jobs:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">Dashboard de Trabajos</h1>
              <p className="text-sm text-muted-foreground">Ejecuta y monitorea trabajos del sistema</p>
            </div>
            <Button onClick={handleRefresh} disabled={isRefreshing} variant="outline" size="sm">
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              Actualizar
            </Button>
          </div>
        </div>

        {/* Jobs Grid */}
        <div className="flex-1 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onRun={() => handleRunJob(job.id)}
                onViewLogs={() => setSelectedJob(job)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Logs Modal */}
      <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Registros - {selectedJob?.displayName}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-96">
            <div className="space-y-1 font-mono text-sm">
              {selectedJob?.logs.map((log, index) => (
                <div
                  key={index}
                  className={`p-2 rounded ${
                    log.includes("ERROR")
                      ? "bg-destructive/10 text-destructive"
                      : log.includes("completado")
                        ? "bg-green-50 text-green-700"
                        : "bg-muted"
                  }`}
                >
                  {log}
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
}
