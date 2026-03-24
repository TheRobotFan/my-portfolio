"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, BookOpen } from "lucide-react"

export default function NewDiaryPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push("/login")
      return
    }

    const { data, error } = await supabase
      .from("diaries")
      .insert({
        title,
        description: description || null,
        user_id: user.id,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating diary:", error)
      setSubmitting(false)
      return
    }

    router.push(`/diary/${data.id}`)
    router.refresh()
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link href="/dashboard" className="mb-6 inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Torna alla Dashboard
      </Link>

      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="font-serif text-2xl text-foreground">Crea un Nuovo Diario</CardTitle>
          <CardDescription>
            Dai un nome al tuo diario e inizia a scrivere i tuoi pensieri
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Titolo del Diario</Label>
              <Input
                id="title"
                type="text"
                placeholder="Es: Il mio diario di viaggio"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="font-serif"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrizione (opzionale)</Label>
              <Textarea
                id="description"
                placeholder="Una breve descrizione del tuo diario..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex gap-3">
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
                disabled={submitting || !title.trim()}
              >
                {submitting ? "Creazione..." : "Crea Diario"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
