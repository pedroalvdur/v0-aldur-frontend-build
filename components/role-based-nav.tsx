"use client"

import { usePermissions } from "@/hooks/use-permissions"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { MessageSquare, Settings, Users, Shield } from "lucide-react"

export function RoleBasedNav() {
  const { user, canChat, canViewJobs, canExecuteJobs, canManageUsers, isOwner } = usePermissions()

  if (!user) return null

  return (
    <nav className="space-y-2">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm font-medium">Bienvenido, {user.name}</span>
        <Badge variant={isOwner ? "default" : "secondary"} className="text-xs">
          {isOwner ? "Owner" : "Worker"}
        </Badge>
      </div>

      {canChat() && (
        <Link href="/chat">
          <Button variant="ghost" className="w-full justify-start gap-2">
            <MessageSquare className="h-4 w-4" />
            Chat con Aldur Bot
          </Button>
        </Link>
      )}

      {canViewJobs() && (
        <Link href="/jobs">
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Settings className="h-4 w-4" />
            {canExecuteJobs() ? "Gestionar Trabajos" : "Ver Trabajos"}
          </Button>
        </Link>
      )}

      {canManageUsers() && (
        <Link href="/admin/users">
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Users className="h-4 w-4" />
            Gestión de Usuarios
          </Button>
        </Link>
      )}

      {isOwner && (
        <Link href="/admin">
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Shield className="h-4 w-4" />
            Panel de Administración
          </Button>
        </Link>
      )}
    </nav>
  )
}
