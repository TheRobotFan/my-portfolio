import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { DiaryCard } from "@/components/diary-card"
import { Button } from "@/components/ui/button"
import { Plus, BookOpen } from "lucide-react"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: diaries } = await supabase
    .from("diaries")
    .select("*, entries(count)")
    .order("updated_at", { ascending: false })

  const displayName = user?.user_metadata?.name || user?.email?.split("@")[0] || "Utente"

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground">
          Ciao, {displayName}!
        </h1>
        <p className="mt-2 text-muted-foreground">
          Benvenuto nel tuo spazio personale. Cosa vuoi scrivere oggi?
        </p>
      </div>

      {/* Diaries Section */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-serif text-xl font-semibold text-foreground">I tuoi Diari</h2>
        <Link href="/diary/new">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Nuovo Diario
          </Button>
        </Link>
      </div>

      {!diaries || diaries.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-card/50 py-16">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
          <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
            Nessun diario ancora
          </h3>
          <p className="mb-6 text-center text-muted-foreground max-w-sm">
            Inizia a creare il tuo primo diario per conservare i tuoi pensieri e ricordi.
          </p>
          <Link href="/diary/new">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Crea il tuo primo Diario
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {diaries.map((diary) => (
            <DiaryCard 
              key={diary.id} 
              diary={{
                id: diary.id,
                title: diary.title,
                description: diary.description,
                createdAt: diary.created_at,
                entriesCount: diary.entries?.[0]?.count || 0,
              }} 
            />
          ))}
        </div>
      )}
    </div>
  )
}
