"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, Save, ArrowLeft } from "lucide-react"
import { createQuiz, addQuizQuestion } from "@/lib/actions/quiz"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"

type Question = {
  question: string
  options: string[]
  correct_answer: string
  explanation: string
}

export function CreateQuizClient() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [difficulty, setDifficulty] = useState("Facile")
  const [timeLimit, setTimeLimit] = useState<number | undefined>(undefined)
  const [passingScore, setPassingScore] = useState(60)
  const [subjectId, setSubjectId] = useState("")
  const [subjects, setSubjects] = useState<Array<{ id: string; name: string }>>([])
  const [questions, setQuestions] = useState<Question[]>([
    { question: "", options: ["", "", "", ""], correct_answer: "", explanation: "" },
  ])
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

  function addQuestion() {
    setQuestions([...questions, { question: "", options: ["", "", "", ""], correct_answer: "", explanation: "" }])
  }

  function removeQuestion(index: number) {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index))
    }
  }

  function updateQuestion(index: number, field: keyof Question, value: any) {
    const updated = [...questions]
    updated[index] = { ...updated[index], [field]: value }
    setQuestions(updated)
  }

  function updateOption(questionIndex: number, optionIndex: number, value: string) {
    const updated = [...questions]
    updated[questionIndex].options[optionIndex] = value
    setQuestions(updated)
  }

  async function handleSave() {
    // Validation
    if (!title || !description || !subjectId) {
      toast({
        title: "Errore",
        description: "Compila tutti i campi obbligatori",
        variant: "destructive",
      })
      return
    }

    const invalidQuestions = questions.filter(
      (q) => !q.question || q.options.some((opt) => !opt) || !q.correct_answer || !q.options.includes(q.correct_answer),
    )

    if (invalidQuestions.length > 0) {
      toast({
        title: "Errore",
        description: "Completa tutte le domande e assicurati che la risposta corretta sia tra le opzioni",
        variant: "destructive",
      })
      return
    }

    setSaving(true)

    try {
      // Create quiz
      const quiz = await createQuiz({
        title,
        description,
        difficulty,
        time_limit: timeLimit,
        passing_score: passingScore,
        subject_id: subjectId,
      })

      // Add questions
      for (const question of questions) {
        await addQuizQuestion(quiz.id, question)
      }

      toast({
        title: "Quiz creato!",
        description: "Il quiz è stato creato con successo",
      })

      router.push("/quiz")
    } catch (error) {
      toast({
        title: "Errore",
        description: "Impossibile creare il quiz",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/quiz">
          <Button variant="ghost" className="gap-2 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Torna ai Quiz
          </Button>
        </Link>
        <h1 className="text-3xl font-bold mb-2">Crea Nuovo Quiz</h1>
        <p className="text-foreground/60">Crea un quiz interattivo per gli studenti</p>
      </div>

      <div className="space-y-6">
        {/* Quiz Info */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Informazioni Quiz</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Titolo *</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Es: Quiz di Matematica - Equazioni"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Descrizione *</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Breve descrizione del quiz..."
                rows={3}
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

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Tempo Limite (minuti)</label>
                <Input
                  type="number"
                  value={timeLimit || ""}
                  onChange={(e) => setTimeLimit(e.target.value ? Number.parseInt(e.target.value) : undefined)}
                  placeholder="Lascia vuoto per nessun limite"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Punteggio Minimo (%)</label>
                <Input
                  type="number"
                  value={passingScore}
                  onChange={(e) => setPassingScore(Number.parseInt(e.target.value))}
                  min={0}
                  max={100}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Questions */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Domande ({questions.length})</h2>
            <Button onClick={addQuestion} className="gap-2 bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4" />
              Aggiungi Domanda
            </Button>
          </div>

          {questions.map((question, qIndex) => (
            <Card key={qIndex} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-lg">Domanda {qIndex + 1}</h3>
                {questions.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeQuestion(qIndex)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Testo Domanda *</label>
                  <Textarea
                    value={question.question}
                    onChange={(e) => updateQuestion(qIndex, "question", e.target.value)}
                    placeholder="Scrivi la domanda..."
                    rows={2}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Opzioni di Risposta *</label>
                  <div className="space-y-2">
                    {question.options.map((option, oIndex) => (
                      <div key={oIndex} className="flex gap-2 items-center">
                        <span className="text-sm font-medium text-foreground/60 w-6">
                          {String.fromCharCode(65 + oIndex)}.
                        </span>
                        <Input
                          value={option}
                          onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                          placeholder={`Opzione ${String.fromCharCode(65 + oIndex)}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Risposta Corretta *</label>
                  <Select
                    value={question.correct_answer}
                    onValueChange={(value) => updateQuestion(qIndex, "correct_answer", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona la risposta corretta" />
                    </SelectTrigger>
                    <SelectContent>
                      {question.options
                        .filter((opt) => opt)
                        .map((option, idx) => (
                          <SelectItem key={idx} value={option}>
                            {String.fromCharCode(65 + idx)}. {option}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Spiegazione (opzionale)</label>
                  <Textarea
                    value={question.explanation}
                    onChange={(e) => updateQuestion(qIndex, "explanation", e.target.value)}
                    placeholder="Spiega perché questa è la risposta corretta..."
                    rows={2}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Save Button */}
        <div className="flex gap-4">
          <Button onClick={handleSave} disabled={saving} className="flex-1 gap-2 bg-primary hover:bg-primary/90">
            <Save className="w-4 h-4" />
            {saving ? "Salvataggio..." : "Salva Quiz"}
          </Button>
          <Link href="/quiz" className="flex-1">
            <Button variant="outline" className="w-full bg-transparent">
              Annulla
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
