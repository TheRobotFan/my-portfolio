"use client"

import React from "react"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Calendar, FileText } from "lucide-react"

interface DiaryCardProps {
  diary: {
    id: string
    title: string
    description: string | null
    createdAt: string
    entriesCount: number
  }
}

export function DiaryCard({ diary }: DiaryCardProps) {
  const router = useRouter()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("it-IT", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (confirm("Sei sicuro di voler eliminare questo diario? Tutte le pagine verranno eliminate.")) {
      const supabase = createClient()
      await supabase.from("diaries").delete().eq("id", diary.id)
      router.refresh()
    }
  }

  return (
    <Link href={`/diary/${diary.id}`}>
      <Card className="group h-full transition-all duration-300 hover:shadow-lg hover:border-primary/30 cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <CardTitle className="font-serif text-xl text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {diary.title}
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription className="line-clamp-2">
            {diary.description || "Nessuna descrizione"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(diary.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span>{diary.entriesCount} {diary.entriesCount === 1 ? "pagina" : "pagine"}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
