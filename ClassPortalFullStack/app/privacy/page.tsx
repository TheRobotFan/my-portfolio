"use client"

import { Navbar } from "@/components/navbar"
import { Card } from "@/components/ui/card"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Politica della Privacy</h1>

        <div className="space-y-8">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">1. Introduzione</h2>
            <p className="text-foreground/70">
              Classe Portal rispetta la tua privacy e si impegna a proteggere i tuoi dati personali in conformità con la
              normativa sulla protezione dei dati.
            </p>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">2. Dati Raccolti</h2>
            <p className="text-foreground/70 mb-3">Raccogliamo i seguenti tipi di dati:</p>
            <ul className="list-disc list-inside text-foreground/70 space-y-2">
              <li>Informazioni di registrazione (nome, email, password)</li>
              <li>Profilo e preferenze utente</li>
              <li>Attività sul portale (esercizi, discussioni, contributi)</li>
              <li>Log di accesso e dati di sistema</li>
            </ul>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">3. Utilizzo dei Dati</h2>
            <p className="text-foreground/70">
              Utilizziamo i tuoi dati per fornire e migliorare i nostri servizi, personalizzare la tua esperienza,
              comunicare con te e garantire la sicurezza della piattaforma.
            </p>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">4. Diritti dell'Utente</h2>
            <p className="text-foreground/70 mb-3">Hai il diritto di:</p>
            <ul className="list-disc list-inside text-foreground/70 space-y-2">
              <li>Accedere ai tuoi dati personali</li>
              <li>Rettificare o aggiornare i tuoi dati</li>
              <li>Richiedere l'eliminazione dei tuoi dati</li>
              <li>Revocare il consenso al trattamento</li>
            </ul>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">5. Contatti</h2>
            <p className="text-foreground/70">
              Per domande sulla privacy o per esercitare i tuoi diritti, contattaci a privacy@classeportal.it
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
