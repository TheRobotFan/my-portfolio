"use client"

import { Navbar } from "@/components/navbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Search } from "lucide-react"
import { useState } from "react"

const allExercises = [
  {
    id: 1,
    title: "Quiz di Matematica - Equazioni di secondo grado",
    subject: "Matematica",
    difficulty: "Medio",
    likes: 24,
  },
  { id: 2, title: "Problemi di Fisica - Cinematica", subject: "Fisica", difficulty: "Difficile", likes: 18 },
  { id: 3, title: "Esercizi Inglese - Present Perfect", subject: "Inglese", difficulty: "Facile", likes: 32 },
  { id: 4, title: "Storia - Rivoluzione Francese", subject: "Storia", difficulty: "Medio", likes: 15 },
  { id: 5, title: "Biologia - Cellular Structure", subject: "Biologia", difficulty: "Facile", likes: 28 },
  { id: 6, title: "Informatica - Algoritmi di Sorting", subject: "Informatica", difficulty: "Difficile", likes: 21 },
]

export default function EsploraPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("Tutti")

  const subjects = ["Tutti", "Matematica", "Fisica", "Inglese", "Storia", "Biologia", "Informatica"]

  const filteredExercises = allExercises.filter((ex) => {
    const matchesSearch = ex.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSubject = selectedSubject === "Tutti" || ex.subject === selectedSubject
    return matchesSearch && matchesSubject
  })

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Esplora Esercizi</h1>
          <p className="text-foreground/60">Scopri tutti gli esercizi disponibili per la tua classe</p>
        </div>

        {/* Search and Filter */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cerca esercizi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="md:col-span-2 flex gap-2 flex-wrap">
            {subjects.map((subject) => (
              <Button
                key={subject}
                variant={selectedSubject === subject ? "default" : "outline"}
                onClick={() => setSelectedSubject(subject)}
                size="sm"
              >
                {subject}
              </Button>
            ))}
          </div>
        </div>

        {/* Exercises Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExercises.map((exercise) => (
            <Card key={exercise.id} className="p-6 hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs px-2 py-1 bg-secondary/10 text-secondary rounded">{exercise.difficulty}</span>
              </div>
              <h3 className="font-semibold mb-2">{exercise.title}</h3>
              <div className="flex justify-between items-center text-sm">
                <span className="text-foreground/60">{exercise.subject}</span>
                <span className="text-foreground/60">❤️ {exercise.likes}</span>
              </div>
              <Button className="w-full mt-4 bg-primary hover:bg-primary/90">Risolvi</Button>
            </Card>
          ))}
        </div>

        {filteredExercises.length === 0 && (
          <div className="text-center py-12">
            <p className="text-foreground/60">Nessun esercizio trovato</p>
          </div>
        )}
      </div>
    </div>
  )
}
