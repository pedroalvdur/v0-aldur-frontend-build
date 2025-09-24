"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, FileText, Clock, CheckCircle, XCircle } from "lucide-react"

interface Job {
  id: string
  name: string
  displayName: string
  lastRun: Date | null
  status: "success" | "error" | "never-run"
  logs: string[]
}

interface JobCardProps {
  job: Job
  onRun: () => void
  onViewLogs: () => void
}

export function JobCard({ job, onRun, onViewLogs }: JobCardProps) {
  const getStatusIcon = () => {
    switch (job.status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusText = () => {
    switch (job.status) {
      case "success":
        return "Éxito"
      case "error":
        return "Error"
      default:
        return "Sin ejecutar"
    }
  }

  const getStatusVariant = () => {
    switch (job.status) {
      case "success":
        return "default" as const
      case "error":
        return "destructive" as const
      default:
        return "secondary" as const
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{job.displayName}</CardTitle>
          <div className="flex items-center gap-1">
            {getStatusIcon()}
            <Badge variant={getStatusVariant()}>{getStatusText()}</Badge>
          </div>
        </div>
        <CardDescription>
          {job.lastRun ? (
            <>
              Última ejecución:{" "}
              {job.lastRun.toLocaleString("es-ES", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </>
          ) : (
            "Nunca ejecutado"
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Button onClick={onRun} className="flex-1">
            <Play className="h-4 w-4 mr-2" />
            Ejecutar
          </Button>
          <Button onClick={onViewLogs} variant="outline" disabled={!job.logs.length}>
            <FileText className="h-4 w-4 mr-2" />
            Ver registros
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
