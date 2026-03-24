"use client"

import { use, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Edit2, Save, X, ImagePlus, Calendar, Clock, FileText } from "lucide-react"
import useSWR from "swr"

export default function EntryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()

  const { data, mutate } = useSWR(`entry-${id}`, async () => {
    const supabase = createClient()
    const { data: entry } = await supabase
      .from("entries")
      .select("*, diaries(*)")
      .eq("id", id)
      .single()
    return entry
  })

  const entry = data
  const diary = data?.diaries

  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(entry?.title || "")
  const [content, setContent] = useState(entry?.content || "")
  const [images, setImages] = useState<string[]>(entry?.images || [])
  const [imageUrl, setImageUrl] = useState("")
  const [submitting, setSubmitting] = useState(false)

  // Update state when data loads
  if (entry && !isEditing && title === "" && content === "") {
    setTitle(entry.title || "")
    setContent(entry.content || "")
    setImages(entry.images || [])
  }

  if (!entry || !diary) {
    if (data === null) {
      return (
        <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4">
          <FileText className="mb-4 h-16 w-16 text-muted-foreground" />
          <h2 className="font-serif text-2xl font-semibold text-foreground mb-2">
            Pagina non trovata
          </h2>
          <p className="mb-6 text-muted-foreground">
            La pagina che stai cercando non esiste o è stata eliminata.
          </p>
          <Link href="/dashboard">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Torna alla Dashboard
            </Button>
          </Link>
        </div>
      )
    }
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("it-IT", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("it-IT", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleAddImage = () => {
    if (imageUrl.trim()) {
      setImages([...images, imageUrl.trim()])
      setImageUrl("")
    }
  }

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    setSubmitting(true)
    const supabase = createClient()
    
    await supabase
      .from("entries")
      .update({
        title: title || null,
        content,
        images,
        updated_at: new Date().toISOString(),
      })
      .eq("id", entry.id)

    // Update diary updated_at
    await supabase
      .from("diaries")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", entry.diary_id)

    await mutate()
    setIsEditing(false)
    setSubmitting(false)
  }

  const handleCancel = () => {
    setTitle(entry.title || "")
    setContent(entry.content)
    setImages(entry.images || [])
    setIsEditing(false)
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Back Link */}
      <Link href={`/diary/${diary.id}`} className="mb-6 inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Torna a {diary.title}
      </Link>

      <div className="rounded-xl border border-border bg-card p-6 md:p-8">
        {isEditing ? (
          /* Edit Mode */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl font-semibold text-foreground">
                Modifica Pagina
              </h2>
            </div>

            <div className="space-y-2">
              <Label htmlFor="editTitle">Titolo</Label>
              <Input
                id="editTitle"
                type="text"
                placeholder="Titolo della pagina..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="font-serif text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="editContent">Contenuto</Label>
              <Textarea
                id="editContent"
                placeholder="I tuoi pensieri..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                className="resize-none leading-relaxed"
                required
              />
            </div>

            {/* Images */}
            <div className="space-y-4">
              <Label>Immagini</Label>
              <div className="flex gap-2">
                <Input
                  type="url"
                  placeholder="Inserisci URL immagine..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddImage}
                  disabled={!imageUrl.trim()}
                  className="bg-transparent"
                >
                  <ImagePlus className="h-4 w-4" />
                </Button>
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((img, index) => (
                    <div key={index} className="group relative aspect-video rounded-lg overflow-hidden border border-border">
                      <Image
                        src={img || "/placeholder.svg"}
                        alt={`Immagine ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-foreground/70 text-background opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" className="flex-1 bg-transparent" onClick={handleCancel}>
                Annulla
              </Button>
              <Button 
                onClick={handleSave}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={submitting || !content.trim()}
              >
                <Save className="mr-2 h-4 w-4" />
                {submitting ? "Salvataggio..." : "Salva"}
              </Button>
            </div>
          </div>
        ) : (
          /* View Mode */
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="font-serif text-2xl font-bold text-foreground mb-2">
                  {entry.title || "Senza titolo"}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(entry.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{formatTime(entry.created_at)}</span>
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="bg-transparent">
                <Edit2 className="mr-2 h-4 w-4" />
                Modifica
              </Button>
            </div>

            {/* Content */}
            <div className="prose prose-neutral max-w-none">
              <p className="whitespace-pre-wrap leading-relaxed text-foreground">
                {entry.content}
              </p>
            </div>

            {/* Images */}
            {entry.images && entry.images.length > 0 && (
              <div className="mt-8 pt-6 border-t border-border">
                <h3 className="font-serif text-lg font-semibold text-foreground mb-4">
                  Immagini
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {entry.images.map((img: string, index: number) => (
                    <div key={index} className="relative aspect-video rounded-lg overflow-hidden border border-border">
                      <Image
                        src={img || "/placeholder.svg"}
                        alt={`Immagine ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Updated info */}
            {entry.updated_at !== entry.created_at && (
              <p className="mt-8 text-xs text-muted-foreground">
                Ultima modifica: {formatDate(entry.updated_at)} alle {formatTime(entry.updated_at)}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
