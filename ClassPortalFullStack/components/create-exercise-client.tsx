"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, ArrowLeft } from "lucide-react"
import { createExercise } from "@/lib/actions/exercises"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"

export function CreateExerciseClient() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [hint, setHint] = useState("")
  const [difficulty, setDifficulty] = useState("Facile")
  const [subjectId, setSubjectId] = useState("")
  const [subjects, setSubjects] = useState<Array<{ id: string; name: string }>>([])
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    loadSubjects()
  }, [])

  async function loadSubjects() {
    const { data, error } = await supabase.from("subjects").select("id, name").order("name")
    if (!error && data) {
      setSubjects(data)
    }
  }

  async function handleSave() {
    // Validation
    if (!title || !question || !answer || !subjectId) {
      toast({
        title: "Errore",
        description: "Compila tutti i campi obbligatori",
        variant: "destructive",
      })
      return
    }

    setSaving(true)

    try {
      await createExercise({
        title,
        description,
        question,
        answer,
        hint: hint || undefined,
        difficulty,
        subject_id: subjectId,
      })

      toast({
        title: "Esercizio creato!",
        description: "L'esercizio è stato creato con successo",
      })

      router.push("/esercizi")
    } catch (error) {
      toast({
        title: "Errore",
        description: "Impossibile creare l'esercizio",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/esercizi">
          <Button variant="ghost" className="gap-2 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Torna agli Esercizi
          </Button>
        </Link>
        <h1 className="text-3xl font-bold mb-2">Crea Nuovo Esercizio</h1>
        <p className="text-foreground/60">Crea un esercizio con domanda, risposta e spiegazione dettagliata</p>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-2 block">Titolo *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Es: Equazioni di secondo grado"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Descrizione</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Breve descrizione dell'esercizio..."
              rows={2}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Materia *</label>
              <Select value={subjectId} onValueChange={setSubjectId}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona materia" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Difficoltà *</label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Facile">Facile</SelectItem>
                  <SelectItem value="Intermedio">Intermedio</SelectItem>
                  <SelectItem value="Difficile">Difficile</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Domanda *</label>
            <Textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Scrivi la domanda dell'esercizio..."
              rows={4}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Suggerimento (opzionale)</label>
            <Textarea
              value={hint}
              onChange={(e) => setHint(e.target.value)}
              placeholder="Fornisci un suggerimento per aiutare gli studenti..."
              rows={3}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Risposta e Spiegazione *</label>
            <Textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Scrivi la risposta completa con spiegazione dettagliata..."
              rows={6}
            />
            <p className="text-xs text-foreground/60 mt-1">
              Includi tutti i passaggi e la spiegazione per aiutare gli studenti a comprendere
            </p>
          </div>

          <div className="flex gap-4">
            <Button onClick={handleSave} disabled={saving} className="flex-1 gap-2 bg-primary hover:bg-primary/90">
              <Save className="w-4 h-4" />
              {saving ? "Salvataggio..." : "Salva Esercizio"}
            </Button>
            <Link href="/esercizi" className="flex-1">
              <Button variant="outline" className="w-full bg-transparent">
                Annulla
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  )
}
