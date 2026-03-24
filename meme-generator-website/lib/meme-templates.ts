export interface MemeTemplate {
  id: string
  name: string
  category: string
  bgColor: string
}

export const memeTemplates: MemeTemplate[] = [
  { id: "1", name: "Classico Blu", category: "classico", bgColor: "#3b82f6" },
  { id: "2", name: "Classico Verde", category: "classico", bgColor: "#22c55e" },
  { id: "3", name: "Classico Arancione", category: "classico", bgColor: "#f97316" },
  { id: "4", name: "Classico Rosa", category: "classico", bgColor: "#ec4899" },
  { id: "5", name: "Classico Giallo", category: "classico", bgColor: "#eab308" },
  { id: "6", name: "Classico Ciano", category: "classico", bgColor: "#06b6d4" },
  { id: "7", name: "Classico Rosso", category: "classico", bgColor: "#ef4444" },
  { id: "8", name: "Classico Indaco", category: "classico", bgColor: "#6366f1" },
  { id: "9", name: "Tramonto", category: "sfumato", bgColor: "linear-gradient(135deg, #f97316 0%, #ec4899 100%)" },
  { id: "10", name: "Oceano", category: "sfumato", bgColor: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)" },
  { id: "11", name: "Foresta", category: "sfumato", bgColor: "linear-gradient(135deg, #22c55e 0%, #06b6d4 100%)" },
  { id: "12", name: "Notte", category: "sfumato", bgColor: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)" },
]

export const categories = [
  { id: "tutti", name: "Tutti" },
  { id: "classico", name: "Classici" },
  { id: "sfumato", name: "Sfumati" },
]
