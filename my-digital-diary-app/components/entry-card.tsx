"use client"

import React from "react"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Calendar, Clock, ImageIcon } from "lucide-react"

interface EntryCardProps {
  entry: {
    id: string
    diaryId: string
    title: string | null
    content: string
    images: string[]
    createdAt: string
  }
}

export function EntryCard({ entry }: EntryCardProps) {
  const router = useRouter()

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

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (confirm("Sei sicuro di voler eliminare questa pagina?")) {
      const supabase = createClient()
      await supabase.from("entries").delete().eq("id", entry.id)
      router.refresh()
    }
  }

  const getPreviewText = (content: string) => {
    return content.slice(0, 150) + (content.length > 150 ? "..." : "")
  }

  return (
    <Link href={`/entry/${entry.id}`}>
      <Card className="group transition-all duration-300 hover:shadow-lg hover:border-primary/30 cursor-pointer overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {entry.images.length > 0 && (
            <div className="relative h-40 w-full md:h-auto md:w-48 shrink-0">
              <Image
                src={entry.images[0] || "/placeholder.svg"}
                alt={entry.title || "Immagine"}
                fill
                className="object-cover"
              />
              {entry.images.length > 1 && (
                <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-foreground/70 px-2 py-1 text-xs text-background">
                  <ImageIcon className="h-3 w-3" />
                  <span>+{entry.images.length - 1}</span>
                </div>
              )}
            </div>
          )}
          <div className="flex-1">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <CardTitle className="font-serif text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">
                  {entry.title || "Senza titolo"}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive shrink-0"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(entry.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{formatTime(entry.createdAt)}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="line-clamp-3 leading-relaxed">
                {getPreviewText(entry.content) || "Nessun contenuto"}
              </CardDescription>
            </CardContent>
          </div>
        </div>
      </Card>
    </Link>
  )
}
