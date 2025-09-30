import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h2 className="text-xl font-semibold text-foreground">Aldur</h2>
            </div>
            <Link href="/login">
              <Button variant="outline" size="sm">
                Iniciar Sesión
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-20">
          <div className="text-center space-y-8 max-w-4xl">
            {/* Main headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-tight text-balance">
              Herramienta de operaciones internas
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-pretty">
              Accede al chat con Aldur Bot y gestiona trabajos del sistema desde una interfaz unificada
            </p>

            {/* CTA Button */}
            <div className="pt-4">
              <Link href="/login">
                <Button size="lg" className="text-base px-8 py-6 gap-2 group">
                  Comenzar
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mt-24 max-w-4xl w-full">
            <div className="space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-foreground">Chat Inteligente</h3>
              <p className="text-muted-foreground leading-relaxed">
                Haz preguntas y obtén respuestas inteligentes del sistema RAG con contexto completo de conversación
              </p>
            </div>

            <div className="space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-foreground">Gestión de Trabajos</h3>
              <p className="text-muted-foreground leading-relaxed">
                Ejecuta y monitorea trabajos de Devueltos y Bajas desde un dashboard centralizado
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
