"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Edit2 } from "lucide-react"

interface DiaryEditDialogProps {
  diary: {
    id: string
    title: string
    description: string | null
  }
}

export function DiaryEditDialog({ diary }: DiaryEditDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState(diary.title)
  const [description, setDescription] = useState(diary.description || "")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    const supabase = createClient()
    await supabase
      .from("diaries")
      .update({
        title,
        description: description || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", diary.id)

    setOpen(false)
    setSubmitting(false)
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="bg-transparent">
          <Edit2 className="mr-2 h-4 w-4" />
          Modifica
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">Modifica Diario</DialogTitle>
          <DialogDescription>
            Aggiorna il titolo e la descrizione del tuo diario
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="editTitle">Titolo</Label>
            <Input
              id="editTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="editDescription">Descrizione</Label>
            <Textarea
              id="editDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1 bg-transparent" onClick={() => setOpen(false)}>
              Annulla
            </Button>
            <Button type="submit" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90" disabled={submitting}>
              {submitting ? "Salvataggio..." : "Salva"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
