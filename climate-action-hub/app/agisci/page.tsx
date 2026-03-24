"use client"

import React from "react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Bike, 
  Utensils, 
  Power, 
  ShoppingBag, 
  Droplets, 
  Recycle,
  TreePine,
  Lightbulb,
  Home,
  Plane,
  ArrowRight,
  Leaf,
  Check,
  Sparkles,
  Target,
  TrendingDown,
  Star
} from "lucide-react"

interface Action {
  id: string
  title: string
  description: string
  impact: "low" | "medium" | "high"
  icon: React.ElementType
  tips: string[]
  savings: string
  difficulty: "easy" | "medium" | "hard"
}

const actions: Action[] = [
  {
    id: "transport",
    title: "Usa mezzi pubblici o bici",
    description: "Il trasporto e una delle principali fonti di emissioni. Scegli alternative sostenibili per i tuoi spostamenti quotidiani.",
    impact: "high",
    icon: Bike,
    tips: [
      "Usa la bici per tragitti sotto i 5 km",
      "Valuta il carpooling con colleghi",
      "Scegli i mezzi pubblici quando possibile",
      "Considera un e-bike per distanze maggiori",
    ],
    savings: "-2.4 ton/anno",
    difficulty: "medium",
  },
  {
    id: "food",
    title: "Riduci il consumo di carne",
    description: "L industria della carne produce enormi quantita di gas serra. Anche solo un giorno vegetariano a settimana fa la differenza.",
    impact: "high",
    icon: Utensils,
    tips: [
      "Prova il Meatless Monday",
      "Esplora ricette vegetariane gustose",
      "Scegli carne di qualita, locale e biologica",
      "Riduci lo spreco alimentare",
    ],
    savings: "-0.8 ton/anno",
    difficulty: "easy",
  },
  {
    id: "standby",
    title: "Spegni i dispositivi in standby",
    description: "I dispositivi in standby consumano energia anche quando non li usi. Spegnerli del tutto puo ridurre i consumi fino al 10%.",
    impact: "low",
    icon: Power,
    tips: [
      "Usa ciabatte con interruttore",
      "Spegni computer e monitor la sera",
      "Scollega i caricatori inutilizzati",
      "Attiva le modalita risparmio energetico",
    ],
    savings: "-0.2 ton/anno",
    difficulty: "easy",
  },
  {
    id: "local",
    title: "Acquista prodotti locali",
    description: "I prodotti locali viaggiano meno e hanno un impronta di carbonio inferiore. Inoltre, sostieni l economia del territorio.",
    impact: "medium",
    icon: ShoppingBag,
    tips: [
      "Frequenta i mercati contadini",
      "Scegli frutta e verdura di stagione",
      "Controlla la provenienza dei prodotti",
      "Riduci gli acquisti online non necessari",
    ],
    savings: "-0.4 ton/anno",
    difficulty: "easy",
  },
  {
    id: "water",
    title: "Riduci lo spreco d acqua",
    description: "L acqua e una risorsa preziosa. Ridurre gli sprechi aiuta l ambiente e anche il portafoglio.",
    impact: "medium",
    icon: Droplets,
    tips: [
      "Docce piu brevi (5 minuti max)",
      "Chiudi il rubinetto mentre ti lavi i denti",
      "Raccogli l acqua piovana per le piante",
      "Ripara eventuali perdite",
    ],
    savings: "-0.3 ton/anno",
    difficulty: "easy",
  },
  {
    id: "recycle",
    title: "Differenzia e ricicla",
    description: "Il riciclo riduce i rifiuti in discarica e permette di riutilizzare materiali preziosi, risparmiando energia e risorse.",
    impact: "medium",
    icon: Recycle,
    tips: [
      "Impara le regole della differenziata",
      "Composta i rifiuti organici",
      "Riduci gli imballaggi monouso",
      "Scegli prodotti riciclabili",
    ],
    savings: "-0.3 ton/anno",
    difficulty: "easy",
  },
  {
    id: "trees",
    title: "Pianta alberi",
    description: "Gli alberi assorbono CO2 e producono ossigeno. Anche un piccolo contributo alla riforestazione ha un grande impatto.",
    impact: "high",
    icon: TreePine,
    tips: [
      "Partecipa a iniziative locali di piantumazione",
      "Dona a organizzazioni di riforestazione",
      "Cura le piante nel tuo giardino o balcone",
      "Adotta un albero virtualmente",
    ],
    savings: "+0.02 ton/albero/anno",
    difficulty: "medium",
  },
  {
    id: "energy",
    title: "Passa all energia rinnovabile",
    description: "Se possibile, scegli un fornitore di energia verde o installa pannelli solari. E un investimento per il futuro.",
    impact: "high",
    icon: Lightbulb,
    tips: [
      "Confronta le offerte di energia verde",
      "Valuta l installazione di pannelli solari",
      "Usa lampadine LED a basso consumo",
      "Considera una pompa di calore",
    ],
    savings: "-1.5 ton/anno",
    difficulty: "hard",
  },
  {
    id: "home",
    title: "Migliora l efficienza della casa",
    description: "Una casa ben isolata consuma meno energia per riscaldamento e raffreddamento, riducendo emissioni e bollette.",
    impact: "medium",
    icon: Home,
    tips: [
      "Isola finestre e porte",
      "Abbassa il termostato di 1-2 gradi",
      "Usa elettrodomestici classe A+++",
      "Installa valvole termostatiche",
    ],
    savings: "-0.5 ton/anno",
    difficulty: "medium",
  },
  {
    id: "travel",
    title: "Viaggia in modo sostenibile",
    description: "L aereo e il mezzo piu inquinante. Quando possibile, scegli il treno o combina lavoro e vacanze per ridurre i viaggi.",
    impact: "high",
    icon: Plane,
    tips: [
      "Scegli il treno per viaggi sotto 1000 km",
      "Evita voli di breve durata",
      "Compensa le emissioni dei tuoi voli",
      "Esplora destinazioni vicine",
    ],
    savings: "-1.1 ton/volo",
    difficulty: "medium",
  },
]

const impactConfig = {
  low: { bg: "bg-secondary", text: "text-secondary-foreground", label: "Impatto basso", color: "border-secondary" },
  medium: { bg: "bg-accent/10", text: "text-accent", label: "Impatto medio", color: "border-accent" },
  high: { bg: "bg-primary/10", text: "text-primary", label: "Impatto alto", color: "border-primary" },
}

const difficultyConfig = {
  easy: { label: "Facile", stars: 1 },
  medium: { label: "Moderato", stars: 2 },
  hard: { label: "Impegnativo", stars: 3 },
}

export default function AgisciPage() {
  const [filter, setFilter] = useState<"all" | "high" | "medium" | "low">("all")
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set())

  const toggleComplete = (id: string) => {
    const newCompleted = new Set(completedActions)
    if (newCompleted.has(id)) {
      newCompleted.delete(id)
    } else {
      newCompleted.add(id)
    }
    setCompletedActions(newCompleted)
  }

  const filteredActions = filter === "all" 
    ? actions 
    : actions.filter(a => a.impact === filter)

  const totalSavings = actions
    .filter(a => completedActions.has(a.id))
    .reduce((acc, a) => {
      const num = Number.parseFloat(a.savings.replace(/[^-\d.]/g, ""))
      return acc + (Number.isNaN(num) ? 0 : Math.abs(num))
    }, 0)

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-40 left-10 w-72 h-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-40 right-10 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/nature-bg.jpg"
            alt="Natura"
            fill
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
              <Leaf className="w-4 h-4" />
              10 azioni concrete
              <Sparkles className="w-4 h-4" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
              Agisci per il clima,{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                ogni giorno
              </span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
              Ecco le azioni piu efficaci che puoi iniziare oggi per ridurre la tua impronta di carbonio.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      {completedActions.size > 0 && (
        <section className="py-4 bg-primary text-primary-foreground sticky top-16 z-40 animate-fade-in-up">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center justify-center gap-6 text-center">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5" />
                <span className="font-semibold">{completedActions.size} azioni completate</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5" />
                <span className="font-semibold">-{totalSavings.toFixed(1)} ton CO2/anno risparmiati</span>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="py-12 lg:py-16 relative">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {[
              { value: "all", label: "Tutte", count: actions.length },
              { value: "high", label: "Alto impatto", count: actions.filter(a => a.impact === "high").length },
              { value: "medium", label: "Medio impatto", count: actions.filter(a => a.impact === "medium").length },
              { value: "low", label: "Basso impatto", count: actions.filter(a => a.impact === "low").length },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value as typeof filter)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  filter === tab.value
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {tab.label}
                <span className="ml-2 opacity-70">({tab.count})</span>
              </button>
            ))}
          </div>

          {/* Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {filteredActions.map((action) => {
              const Icon = action.icon
              const impact = impactConfig[action.impact]
              const difficulty = difficultyConfig[action.difficulty]
              const isCompleted = completedActions.has(action.id)
              
              return (
                <Card 
                  key={action.id} 
                  className={`border-2 shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-2 overflow-hidden ${
                    isCompleted ? "border-primary bg-primary/5" : "border-transparent"
                  }`}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className={`w-14 h-14 rounded-2xl ${isCompleted ? "bg-primary" : "bg-primary/10"} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-all`}>
                        <Icon className={`w-7 h-7 ${isCompleted ? "text-primary-foreground" : "text-primary"}`} />
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        <Badge variant="secondary" className={`${impact.bg} ${impact.text}`}>
                          {impact.label}
                        </Badge>
                        <div className="flex items-center gap-1">
                          {[...Array(3)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3 h-3 ${i < difficulty.stars ? "text-accent fill-accent" : "text-muted"}`} 
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <CardTitle className="text-xl mt-4">{action.title}</CardTitle>
                    <CardDescription className="leading-relaxed">
                      {action.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {/* Savings Badge */}
                    <div className="bg-secondary/50 rounded-xl p-3 mb-4">
                      <div className="flex items-center gap-2">
                        <TrendingDown className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-foreground">Risparmio: </span>
                        <span className="text-sm font-bold text-primary">{action.savings}</span>
                      </div>
                    </div>

                    {/* Tips */}
                    <div className="space-y-2 mb-4">
                      <p className="text-sm font-medium text-foreground">Come iniziare:</p>
                      <ul className="space-y-1.5">
                        {action.tips.slice(0, 3).map((tip, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Complete Button */}
                    <Button 
                      variant={isCompleted ? "default" : "outline"}
                      className={`w-full gap-2 ${!isCompleted && "bg-transparent"}`}
                      onClick={() => toggleComplete(action.id)}
                    >
                      {isCompleted ? (
                        <>
                          <Check className="w-4 h-4" />
                          Completata!
                        </>
                      ) : (
                        <>
                          <Target className="w-4 h-4" />
                          Segna come obiettivo
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* CTA Section */}
          <div className="mt-20 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-3xl" />
            <div className="relative bg-card/80 backdrop-blur rounded-3xl p-8 md:p-12 text-center shadow-2xl">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4 text-balance">
                Vuoi sapere quanto emetti?
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-lg mx-auto">
                Usa il nostro calcolatore per scoprire la tua impronta di carbonio e ricevere suggerimenti personalizzati.
              </p>
              <Button asChild size="lg" className="gap-2 h-14 px-8 text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                <Link href="/calcolatore">
                  Calcola il tuo impatto
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
