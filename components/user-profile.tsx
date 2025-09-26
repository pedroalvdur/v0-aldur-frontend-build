"use client"

import { useAuth } from "@/contexts/auth-context"
import { getRoleDisplayName, getRoleDescription } from "@/lib/permissions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, LogOut, Shield } from "lucide-react"

export function UserProfile() {
  const { user, logout, isOwner } = useAuth()

  if (!user) return null

  const handleLogout = async () => {
    await logout()
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Perfil de Usuario
        </CardTitle>
        <CardDescription>Información de tu cuenta</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Nombre:</span>
            <span className="text-sm">{user.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Email:</span>
            <span className="text-sm">{user.email}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Rol:</span>
            <Badge variant={isOwner ? "default" : "secondary"} className="gap-1">
              <Shield className="h-3 w-3" />
              {getRoleDisplayName(user.role)}
            </Badge>
          </div>
        </div>

        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground mb-3">{getRoleDescription(user.role)}</p>
          <Button onClick={handleLogout} variant="outline" className="w-full gap-2 bg-transparent">
            <LogOut className="h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
