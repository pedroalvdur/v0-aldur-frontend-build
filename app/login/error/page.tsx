"use client"

import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "AccessDenied":
        return "Tu correo electrónico no está autorizado para acceder a esta aplicación."
      case "Verification":
        return "El enlace de verificación ha expirado o ya ha sido utilizado."
      case "Configuration":
        return "Hay un problema con la configuración del servidor."
      default:
        return "Ocurrió un error durante la autenticación. Por favor intenta de nuevo."
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold">Error de autenticación</CardTitle>
          <CardDescription>No pudimos completar tu inicio de sesión</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertDescription>{getErrorMessage(error)}</AlertDescription>
          </Alert>

          <div className="flex flex-col gap-2">
            <Button asChild className="w-full">
              <Link href="/login">Volver a intentar</Link>
            </Button>
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/">Ir al inicio</Link>
            </Button>
          </div>

          {error === "AccessDenied" && (
            <p className="text-xs text-center text-muted-foreground">
              Si crees que deberías tener acceso, contacta al administrador del sistema.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
