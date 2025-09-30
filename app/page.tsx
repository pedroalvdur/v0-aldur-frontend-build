import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { MessageSquare, Settings, LogIn } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { RoleBasedNav } from "@/components/role-based-nav"

export default function HomePage() {
  const { user, loginWithGoogle } = useAuth()
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Aldur</h1>
          <p className="text-xl text-muted-foreground">Herramienta de operaciones internas</p>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Accede al chat con Aldur Bot y gestiona trabajos del sistema desde una interfaz unificada
          </p>
        </div>

        {/* Feature Cards */}
        {user ? (
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Chat con Aldur Bot
                </CardTitle>
                <CardDescription>Haz preguntas y obtén respuestas inteligentes del sistema RAG</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/chat">
                  <Button className="w-full">Ir al Chat</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  Dashboard de Trabajos
                </CardTitle>
                <CardDescription>Ejecuta y monitorea trabajos de Devueltos y Bajas</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/jobs">
                  <Button className="w-full">Ver Trabajos</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LogIn className="h-5 w-5 text-primary" />
                Inicia sesión para continuar
              </CardTitle>
              <CardDescription>Usa tu cuenta de Google para acceder</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => loginWithGoogle()}>Acceder con Google</Button>
            </CardContent>
          </Card>
        )}

        {!user && (
          <div className="text-center">
            <Link href="/login">
              <Button variant="outline" className="gap-2 bg-transparent">
                <LogIn className="h-4 w-4" />
                Iniciar Sesión
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
