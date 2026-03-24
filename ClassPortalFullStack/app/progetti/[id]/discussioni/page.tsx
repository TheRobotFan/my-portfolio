"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MessageSquare, ThumbsUp, Send } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

const projectDiscussions = {
  1: {
    projectName: "Progetto Robotica - Mars Rover",
    discussions: [
      {
        id: 1,
        author: "Marco L.",
        date: "2 ore fa",
        content: "Come dovremmo collegare i sensori al microcontrollore?",
        likes: 12,
        replies: [
          {
            author: "Sofia R.",
            date: "1 ora fa",
            content: "Suggerisco di usare il protocollo I2C, è più affidabile per i sensori multipli.",
            likes: 5,
          },
          {
            author: "Andrea B.",
            date: "45 minuti fa",
            content: "D'accordo! Ho già trovato un tutorial su Arduino che spiega perfettamente come farlo.",
            likes: 3,
          },
        ],
      },
      {
        id: 2,
        author: "Luca M.",
        date: "1 giorno fa",
        content: "Il budget è sufficiente per acquistare i motori DC proposti?",
        likes: 8,
        replies: [
          {
            author: "Prof. Rossi",
            date: "23 ore fa",
            content: "Sì, rientra nel budget. Procedete pure con l'ordine.",
            likes: 7,
          },
        ],
      },
    ],
  },
  2: {
    projectName: "Progetto Letterario - Analisi Dante",
    discussions: [
      {
        id: 1,
        author: "Maria G.",
        date: "3 giorni fa",
        content: "Come dovremmo strutturare la tesi interpretativa?",
        likes: 6,
        replies: [],
      },
    ],
  },
  3: {
    projectName: "Progetto Scientifico - Energia Rinnovabile",
    discussions: [
      {
        id: 1,
        author: "Chiara L.",
        date: "5 giorni fa",
        content: "Quali materiali dobbiamo usare per il prototipo?",
        likes: 4,
        replies: [],
      },
    ],
  },
}

export default function ProggettoDiscussioniPage() {
  const params = useParams()
  const projectId = Number.parseInt(params.id as string)
  const projectData = projectDiscussions[projectId as keyof typeof projectDiscussions]
  const [newMessage, setNewMessage] = useState("")
  const [replyingTo, setReplyingTo] = useState<number | null>(null)

  if (!projectData) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Link href="/progetti">
            <Button variant="ghost" className="gap-2 mb-4">
              <ArrowLeft className="w-4 h-4" />
              Torna ai Progetti
            </Button>
          </Link>
          <Card className="p-8 text-center">
            <p className="text-lg text-foreground/60">Progetto non trovato</p>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <Link href="/progetti">
          <Button variant="ghost" className="gap-2 mb-6">
            <ArrowLeft className="w-4 h-4" />
            Torna ai Progetti
          </Button>
        </Link>

        <h1 className="text-3xl font-bold mb-2">Discussioni Progetto</h1>
        <p className="text-foreground/70 mb-8">{projectData.projectName}</p>

        {/* New Message Form */}
        <Card className="p-6 mb-8 bg-primary/5 border-primary/20">
          <h3 className="font-semibold mb-4">Aggiungi un Messaggio</h3>
          <Textarea
            placeholder="Condividi un'idea, una domanda o un suggerimento..."
            className="mb-4 resize-none"
            rows={4}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <div className="flex justify-end">
            <Button className="gap-2 bg-primary hover:bg-primary/90">
              <Send className="w-4 h-4" />
              Pubblica
            </Button>
          </div>
        </Card>

        {/* Discussions */}
        <div className="space-y-6">
          {projectData.discussions.length > 0 ? (
            projectData.discussions.map((discussion) => (
              <Card key={discussion.id} className="p-6 border-l-4 border-l-primary">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{discussion.content}</h3>
                    <p className="text-sm text-foreground/60">
                      {discussion.author} • {discussion.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <ThumbsUp className="w-4 h-4" />
                    <span>{discussion.likes}</span>
                  </div>
                </div>

                {/* Replies */}
                <div className="space-y-4 mb-4 pl-6 border-l border-border">
                  {discussion.replies.map((reply, idx) => (
                    <div key={idx} className="text-sm">
                      <p className="font-semibold">{reply.author}</p>
                      <p className="text-foreground/60 text-xs mb-2">{reply.date}</p>
                      <p className="text-foreground/70">{reply.content}</p>
                    </div>
                  ))}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-primary"
                  onClick={() => setReplyingTo(discussion.id)}
                >
                  <MessageSquare className="w-4 h-4" />
                  Rispondi
                </Button>

                {/* Reply Form */}
                {replyingTo === discussion.id && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <Textarea placeholder="Scrivi una risposta..." className="mb-2 resize-none" rows={2} />
                    <div className="flex gap-2">
                      <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90">
                        <Send className="w-3 h-3" />
                        Invia
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setReplyingTo(null)}>
                        Annulla
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            ))
          ) : (
            <Card className="p-8 text-center">
              <p className="text-foreground/60">Nessuna discussione ancora. Inizia tu!</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
