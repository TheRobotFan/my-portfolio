"use client"

import { Navbar } from "@/components/navbar"
import { Card } from "@/components/ui/card"
import { Search } from "lucide-react"
import { useState } from "react"

export default function CentroAiutoPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const faqs = [
    {
      question: "Come recupero la mia password?",
      answer: "Vai alla pagina di login e clicca su 'Password dimenticata'. Riceverai un email con le istruzioni.",
    },
    {
      question: "Come posso contattare un insegnante?",
      answer: "Puoi usare la sezione Forum per fare domande pubbliche o visitare la pagina Contatti per email dirette.",
    },
    {
      question: "Come funziona il sistema di XP?",
      answer: "Guadagni XP partecipando attivamente: completando esercizi, creando discussioni e condividendo appunti.",
    },
    {
      question: "Posso eliminare il mio account?",
      answer: "Contatta gli amministratori tramite la pagina Contatti per richiedere l'eliminazione dell'account.",
    },
  ]

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-4">Centro Aiuto</h1>
        <p className="text-foreground/70 mb-8">Trova risposte alle domande più comuni.</p>

        <div className="mb-8 relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-foreground/40" />
          <input
            type="text"
            placeholder="Cerca una domanda..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="space-y-4">
          {filteredFaqs.map((faq, idx) => (
            <Card key={idx} className="p-6">
              <h3 className="font-bold text-lg mb-2">{faq.question}</h3>
              <p className="text-foreground/70">{faq.answer}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
