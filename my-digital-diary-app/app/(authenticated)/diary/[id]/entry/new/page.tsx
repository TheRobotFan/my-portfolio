"use client"

import React from "react"

import { use, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, ImagePlus, X, Save } from "lucide-react"
import useSWR from "swr"

export default function NewEntryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: diaryId } = use(params)
  const router = useRouter()

  const { data: diary } = useSWR(`diary-${diaryId}`, async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from("diaries")
      .select("*")
      .eq("id", diaryId)
      .single()
    return data
  })

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [imageUrl, setImageUrl] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleAddImage = () => {
    if (imageUrl.trim()) {
      setImages([...images, imageUrl.trim()])
      setImageUrl("")
    }
  }

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push("/login")
      return
    }

    const { error } = await supabase.from("entries").insert({
      diary_id: diaryId,
      user_id: user.id,
      title: title || null,
      content,
      images,
    })

    if (error) {
      console.error("Error creating entry:", error)
      setSubmitting(false)
      return
    }

    // Update diary updated_at
    await supabase
      .from("diaries")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", diaryId)

    router.push(`/diary/${diaryId}`)
    router.refresh()
  }

  if (!diary) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Back Link */}
      <Link href={`/diary/${diaryId}`} className="mb-6 inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Torna a {diary.title}
      </Link>

      <div className="rounded-xl border border-border bg-card p-6 md:p-8">
        <h1 className="font-serif text-2xl font-bold text-foreground mb-6">
          Scrivi una Nuova Pagina
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Titolo (opzionale)</Label>
            <Input
              id="title"
              type="text"
              placeholder="Dai un titolo a questa pagina..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="font-serif text-lg"
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">I tuoi pensieri</Label>
            <Textarea
              id="content"
              placeholder="Scrivi qui i tuoi pensieri, riflessioni, ricordi..."
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
            
            {/* Image URL Input */}
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

            {/* Image Preview */}
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

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={() => router.back()}
            >
              Annulla
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={submitting || !content.trim()}
            >
              <Save className="mr-2 h-4 w-4" />
              {submitting ? "Salvataggio..." : "Salva Pagina"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
