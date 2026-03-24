import Link from "next/link"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { EntryCard } from "@/components/entry-card"
import { DiaryEditDialog } from "@/components/diary-edit-dialog"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus, FileText, Calendar } from "lucide-react"

export default async function DiaryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  // Redirect to the correct route if someone manually types /diary/new
  if (id === "new") {
    notFound()
  }
  
  const supabase = await createClient()

  const { data: diary } = await supabase
    .from("diaries")
    .select("*")
    .eq("id", id)
    .single()

  if (!diary) {
    notFound()
  }

  const { data: entries } = await supabase
    .from("entries")
    .select("*")
    .eq("diary_id", id)
    .order("created_at", { ascending: false })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("it-IT", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Back Link */}
      <Link href="/dashboard" className="mb-6 inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Torna alla Dashboard
      </Link>

      {/* Diary Header */}
      <div className="mb-8 rounded-xl border border-border bg-card p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
              {diary.title}
            </h1>
            {diary.description && (
              <p className="text-muted-foreground mb-4 leading-relaxed">
                {diary.description}
              </p>
            )}
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Creato il {formatDate(diary.created_at)}</span>
            </div>
          </div>
          <DiaryEditDialog diary={diary} />
        </div>
      </div>

      {/* Entries Section */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-serif text-xl font-semibold text-foreground">
          Pagine ({entries?.length || 0})
        </h2>
        <Link href={`/diary/${diary.id}/entry/new`}>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Nuova Pagina
          </Button>
        </Link>
      </div>

      {!entries || entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-card/50 py-16">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
            Nessuna pagina ancora
          </h3>
          <p className="mb-6 text-center text-muted-foreground max-w-sm">
            Scrivi la tua prima pagina e inizia a documentare i tuoi pensieri.
          </p>
          <Link href={`/diary/${diary.id}/entry/new`}>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Scrivi la prima pagina
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <EntryCard 
              key={entry.id} 
              entry={{
                id: entry.id,
                diaryId: entry.diary_id,
                title: entry.title,
                content: entry.content,
                images: entry.images || [],
                createdAt: entry.created_at,
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
