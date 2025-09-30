import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail } from "lucide-react"

export default function VerifyRequestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Mail className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Revisa tu correo</CardTitle>
          <CardDescription>Te hemos enviado un enlace de acceso</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-sm text-muted-foreground">
            Hemos enviado un enlace mágico a tu correo electrónico. Haz clic en el enlace para acceder a tu cuenta.
          </p>
          <p className="text-xs text-muted-foreground">
            Si no ves el correo, revisa tu carpeta de spam o correo no deseado.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
