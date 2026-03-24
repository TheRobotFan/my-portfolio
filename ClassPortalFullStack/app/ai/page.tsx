"use client"

import type React from "react"

import { useState } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { Navbar } from "@/components/navbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, Send, Loader2, BookOpen, Calculator, Atom, Dna } from "lucide-react"

export default function AIPage() {
  const [input, setInput] = useState("")

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/ai/chat" }),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    sendMessage({ text: input })
    setInput("")
  }

  const suggestions = [
    {
      icon: Calculator,
      text: "Spiegami le equazioni di secondo grado con esempi",
      category: "Matematica",
    },
    {
      icon: Dna,
      text: "Come funziona la fotosintesi clorofilliana?",
      category: "Biologia",
    },
    {
      icon: Atom,
      text: "Cos'è la tavola periodica e come si legge?",
      category: "Chimica",
    },
    {
      icon: BookOpen,
      text: "Quali sono le migliori tecniche di studio?",
      category: "Studio",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Assistente IA - ChatGPT</h1>
          </div>
          <p className="text-foreground/60">
            Chiedi aiuto con i compiti, spiegazioni di concetti, o consigli di studio. Powered by GPT-4o
          </p>
        </div>

        {/* Chat Container */}
        <Card className="p-6 mb-4 min-h-[500px] max-h-[600px] overflow-y-auto flex flex-col">
          {messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Sparkles className="w-16 h-16 mx-auto mb-4 text-primary/30" />
                <h3 className="text-lg font-semibold mb-2">Inizia una conversazione con l'IA</h3>
                <p className="text-sm text-foreground/60 mb-6">
                  Fai una domanda su qualsiasi argomento scolastico e riceverai spiegazioni dettagliate
                </p>
                <div className="grid gap-3 max-w-2xl mx-auto">
                  {suggestions.map((suggestion, index) => {
                    const Icon = suggestion.icon
                    return (
                      <Button
                        key={index}
                        variant="outline"
                        onClick={() => {
                          setInput(suggestion.text)
                          sendMessage({ text: suggestion.text })
                        }}
                        className="text-left justify-start h-auto py-3 px-4"
                      >
                        <Icon className="w-5 h-5 mr-3 flex-shrink-0 text-primary" />
                        <div className="flex-1">
                          <div className="font-medium">{suggestion.text}</div>
                          <div className="text-xs text-foreground/50 mt-1">{suggestion.category}</div>
                        </div>
                      </Button>
                    )
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-lg p-4 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground border border-border"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border/50">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-xs font-semibold text-primary">Assistente IA</span>
                      </div>
                    )}
                    {message.parts.map((part, index) => {
                      if (part.type === "text") {
                        return (
                          <div key={index} className="whitespace-pre-wrap leading-relaxed">
                            {part.text}
                          </div>
                        )
                      }
                      return null
                    })}
                  </div>
                </div>
              ))}
              {status === "in_progress" && (
                <div className="flex justify-start">
                  <div className="bg-muted border border-border rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-primary" />
                      <span className="text-sm text-foreground/60">L'IA sta pensando...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Scrivi la tua domanda... (es: Come si risolve un'equazione?)"
            disabled={status === "in_progress"}
            className="flex-1 px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <Button
            type="submit"
            disabled={status === "in_progress" || !input.trim()}
            className="gap-2 bg-primary hover:bg-primary/90 px-6"
          >
            {status === "in_progress" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Invia
          </Button>
        </form>

        {/* Info Footer */}
        <div className="mt-4 text-center text-xs text-foreground/50">
          <p>💡 Suggerimento: Sii specifico nelle tue domande per ottenere risposte più dettagliate e utili</p>
        </div>
      </div>
    </div>
  )
}
