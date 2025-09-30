"use client"

import type React from "react"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSearchParams } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/chat"

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn("email", {
        email,
        callbackUrl,
        redirect: false,
      })

      if (result?.error) {
        console.error("Error al iniciar sesión:", result.error)
        alert("Error al enviar el enlace mágico. Por favor, verifica tu correo electrónico.")
      } else {
        setIsSubmitted(true)
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Ocurrió un error. Por favor, intenta de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Revisa tu correo</CardTitle>
            <CardDescription>Te hemos enviado un enlace mágico para iniciar sesión</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-sm text-muted-foreground">
              <p>Hemos enviado un enlace de inicio de sesión a:</p>
              <p className="font-medium text-foreground mt-2">{email}</p>
              <p className="mt-4">Haz clic en el enlace del correo para acceder a tu cuenta.</p>
            </div>
            <Button
              variant="outline"
              className="w-full bg-transparent"
              onClick={() => {
                setIsSubmitted(false)
                setEmail("")
              }}
            >
              Usar otro correo
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Aldur Adeslas</CardTitle>
          <CardDescription>Inicia sesión con tu correo electrónico</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Enviando..." : "Enviar enlace mágico"}
            </Button>
          </form>

          <div className="text-center text-xs text-muted-foreground">
            <p>Te enviaremos un enlace seguro para iniciar sesión sin contraseña.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
