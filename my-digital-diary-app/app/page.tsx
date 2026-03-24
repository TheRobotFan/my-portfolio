import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { BookOpen, PenLine, Lock, Sparkles } from "lucide-react"

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <nav className="relative mx-auto flex max-w-6xl items-center justify-between px-4 py-6">
          <div className="flex items-center gap-2">
            <BookOpen className="h-7 w-7 text-primary" />
            <span className="font-serif text-2xl font-semibold text-foreground">MyDigitalDiary</span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost" className="text-foreground">Accedi</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Registrati</Button>
            </Link>
          </div>
        </nav>

        <div className="relative mx-auto max-w-4xl px-4 pb-24 pt-16 text-center">
          <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl text-balance">
            Il tuo spazio personale per pensieri e ricordi
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed text-pretty">
            Crea il tuo diario digitale privato. Scrivi i tuoi pensieri, aggiungi immagini e conserva i tuoi ricordi in un luogo sicuro e organizzato.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/register">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8">
                Inizia a Scrivere
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="px-8 bg-transparent">
                Ho già un account
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="text-center font-serif text-3xl font-semibold text-foreground mb-12">
          Tutto ciò di cui hai bisogno
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-6 text-center transition-all hover:shadow-md hover:border-primary/30">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <PenLine className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-foreground mb-2">Scrivi Liberamente</h3>
            <p className="text-muted-foreground leading-relaxed">
              Un editor pulito e minimale per catturare i tuoi pensieri senza distrazioni.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 text-center transition-all hover:shadow-md hover:border-primary/30">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-foreground mb-2">Completamente Privato</h3>
            <p className="text-muted-foreground leading-relaxed">
              I tuoi diari sono solo tuoi. Ogni utente vede solo i propri contenuti.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 text-center transition-all hover:shadow-md hover:border-primary/30">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-foreground mb-2">Aggiungi Immagini</h3>
            <p className="text-muted-foreground leading-relaxed">
              Arricchisci i tuoi ricordi con foto e immagini per renderli indimenticabili.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-8">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="font-serif text-lg font-semibold text-foreground">MyDigitalDiary</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Il tuo diario personale digitale
          </p>
        </div>
      </footer>
    </div>
  )
}
