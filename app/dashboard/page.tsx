"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { usePermissions } from "@/hooks/use-permissions"

export default function DashboardPage() {
  const { user } = useAuth()
  const { canChat, canViewJobs } = usePermissions()

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-xl w-full space-y-6 text-center">
        <h1 className="text-2xl font-semibold">Bienvenido{user?.name ? `, ${user.name}` : ""}</h1>
        <p className="text-muted-foreground">Selecciona una opción para comenzar</p>
        <div className="flex gap-3 justify-center">
          {canChat() && (
            <Link href="/chat">
              <Button>Ir al Chat</Button>
            </Link>
          )}
          {canViewJobs() && (
            <Link href="/jobs">
              <Button variant="outline" className="bg-transparent">Gestionar Trabajos</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
