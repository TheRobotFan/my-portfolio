import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { Mail } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CheckEmailPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4">
        <Card className="w-full max-w-md p-8 bg-card/80 backdrop-blur">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Controlla la tua email</CardTitle>
            <CardDescription>Ti abbiamo inviato un link di conferma</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-foreground/70">
              Controlla la tua casella di posta e clicca sul link di conferma per attivare il tuo account.
            </p>
            <p className="text-xs text-foreground/50">
              Non hai ricevuto l'email? Controlla la cartella spam o riprova tra qualche minuto.
            </p>
            <Link href="/auth/login">
              <Button variant="outline" className="w-full mt-4 bg-transparent">
                Torna al Login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
