import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function VerifyRequestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Revisa tu correo</CardTitle>
          <CardDescription>Te hemos enviado un enlace mágico para iniciar sesión</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            <p>Hemos enviado un enlace de inicio de sesión a tu correo electrónico.</p>
            <p className="mt-4">Haz clic en el enlace del correo para acceder a tu cuenta.</p>
            <p className="mt-4 text-xs">Si no ves el correo, revisa tu carpeta de spam.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
