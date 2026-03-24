"use client"

import React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  BookOpen, 
  ExternalLink, 
  Globe, 
  Factory, 
  Thermometer, 
  AlertTriangle,
  TreePine,
  Waves,
  ArrowRight,
  Leaf,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Zap,
  Users,
  Clock,
  TrendingUp
} from "lucide-react"

interface Topic {
  id: string
  title: string
  icon: React.ElementType
  color: string
  content: string[]
}

const topics: Topic[] = [
  {
    id: "what-is",
    title: "Cos e il cambiamento climatico?",
    icon: Thermometer,
    color: "bg-destructive/10 text-destructive",
    content: [
      "Il cambiamento climatico e la variazione a lungo termine delle temperature e dei modelli meteorologici del nostro pianeta. Mentre piccole fluttuazioni sono naturali, dagli anni 50 le attivita umane sono diventate il principale motore del riscaldamento globale.",
      "L effetto serra e un fenomeno naturale: i gas presenti nell atmosfera trattengono parte del calore del sole, rendendo la Terra abitabile. Tuttavia, le attivita umane hanno aumentato drasticamente la concentrazione di questi gas, causando un riscaldamento eccessivo.",
      "La temperatura media globale e aumentata di circa 1,1 gradi celsius rispetto all era pre-industriale. Potrebbe sembrare poco, ma questo cambiamento ha conseguenze enormi su ecosistemi, meteo e vita quotidiana.",
    ],
  },
  {
    id: "why-problem",
    title: "Perche e un problema globale?",
    icon: Globe,
    color: "bg-accent/10 text-accent",
    content: [
      "Il clima non conosce confini. Le emissioni prodotte in un paese influenzano il clima di tutto il pianeta. Per questo motivo, affrontare il cambiamento climatico richiede una cooperazione internazionale senza precedenti.",
      "Gli effetti del riscaldamento globale sono gia visibili: eventi meteorologici estremi piu frequenti, innalzamento del livello del mare, scioglimento dei ghiacciai, perdita di biodiversita e impatti sulla produzione alimentare.",
      "I paesi piu vulnerabili sono spesso quelli che hanno contribuito meno al problema. Piccole isole, regioni costiere e aree gia soggette a siccita sono le piu colpite, creando disuguaglianze e potenziali conflitti per le risorse.",
    ],
  },
  {
    id: "causes",
    title: "Quali sono le principali cause?",
    icon: Factory,
    color: "bg-primary/10 text-primary",
    content: [
      "La combustione di combustibili fossili (carbone, petrolio e gas naturale) per energia, trasporti e industria e la principale fonte di emissioni di gas serra, responsabile di circa il 75% delle emissioni globali.",
      "La deforestazione contribuisce al problema in due modi: elimina alberi che assorbirebbero CO2 e rilascia in atmosfera il carbonio immagazzinato nelle piante e nel suolo.",
      "L agricoltura intensiva e l allevamento producono metano (dalle risaie e dalla digestione del bestiame) e protossido di azoto (dai fertilizzanti), gas serra ancora piu potenti della CO2.",
      "I processi industriali, la produzione di cemento e acciaio, e la gestione dei rifiuti completano il quadro delle principali fonti di emissioni.",
    ],
  },
]

const consequences = [
  {
    title: "Eventi estremi",
    description: "Ondate di calore, alluvioni, siccita e uragani sempre piu frequenti e intensi che causano danni per miliardi.",
    icon: AlertTriangle,
    stat: "+50%",
    statLabel: "disastri dal 1980",
    color: "from-destructive/20 to-destructive/5"
  },
  {
    title: "Innalzamento del mare",
    description: "Lo scioglimento dei ghiacci fa salire il livello del mare, minacciando 680 milioni di persone nelle zone costiere.",
    icon: Waves,
    stat: "3.6mm",
    statLabel: "all anno",
    color: "from-accent/20 to-accent/5"
  },
  {
    title: "Perdita di biodiversita",
    description: "Un milione di specie rischia l estinzione. Gli ecosistemi collassano a un ritmo mai visto prima.",
    icon: TreePine,
    stat: "1M",
    statLabel: "specie a rischio",
    color: "from-primary/20 to-primary/5"
  },
  {
    title: "Crisi alimentare",
    description: "Siccita e inondazioni riducono i raccolti, minacciando la sicurezza alimentare di miliardi di persone.",
    icon: Zap,
    stat: "-25%",
    statLabel: "raccolti entro 2050",
    color: "from-destructive/20 to-destructive/5"
  },
  {
    title: "Migrazioni forzate",
    description: "Centinaia di milioni di persone saranno costrette a spostarsi a causa di condizioni climatiche insostenibili.",
    icon: Users,
    stat: "216M",
    statLabel: "migranti entro 2050",
    color: "from-accent/20 to-accent/5"
  },
  {
    title: "Il tempo sta scadendo",
    description: "Abbiamo meno di un decennio per dimezzare le emissioni ed evitare i peggiori scenari climatici.",
    icon: Clock,
    stat: "2030",
    statLabel: "scadenza critica",
    color: "from-primary/20 to-primary/5"
  },
]

const timeline = [
  { year: "1850", event: "Inizio era industriale", desc: "Le emissioni di CO2 iniziano ad aumentare" },
  { year: "1988", event: "Nasce l IPCC", desc: "Il panel scientifico ONU sul clima" },
  { year: "1997", event: "Protocollo di Kyoto", desc: "Primo accordo globale sulle emissioni" },
  { year: "2015", event: "Accordo di Parigi", desc: "Obiettivo: limitare il riscaldamento a 1.5 gradi celsius" },
  { year: "2030", event: "Scadenza critica", desc: "Dimezzare le emissioni globali" },
  { year: "2050", event: "Net Zero", desc: "Obiettivo emissioni nette zero" },
]

const sources = [
  {
    title: "ONU - Azione per il Clima",
    description: "La risorsa ufficiale delle Nazioni Unite sul cambiamento climatico e gli accordi internazionali.",
    url: "https://www.un.org/en/climatechange",
    domain: "un.org",
    color: "from-blue-500/10 to-blue-500/5"
  },
  {
    title: "IPCC - Panel Intergovernativo",
    description: "Rapporti scientifici autorevoli sullo stato del clima e le proiezioni future.",
    url: "https://www.ipcc.ch/",
    domain: "ipcc.ch",
    color: "from-primary/10 to-primary/5"
  },
  {
    title: "NASA Climate",
    description: "Dati, visualizzazioni e ricerche sul clima dalla NASA.",
    url: "https://climate.nasa.gov/",
    domain: "climate.nasa.gov",
    color: "from-accent/10 to-accent/5"
  },
  {
    title: "European Climate Foundation",
    description: "Iniziative e risorse per la transizione verso un Europa a zero emissioni.",
    url: "https://europeanclimate.org/",
    domain: "europeanclimate.org",
    color: "from-green-500/10 to-green-500/5"
  },
]

export default function ImparaPage() {
  const [expandedTopic, setExpandedTopic] = useState<string | null>("what-is")

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-40 right-10 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-40 left-10 w-80 h-80 rounded-full bg-accent/5 blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/climate-action.jpg"
            alt="Cambiamento climatico"
            fill
            className="object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
              <BookOpen className="w-4 h-4" />
              Contenuti educativi
              <Sparkles className="w-4 h-4" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
              Impara di piu sul{" "}
              <span className="bg-gradient-to-r from-destructive via-accent to-primary bg-clip-text text-transparent animate-gradient">
                cambiamento climatico
              </span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
              Comprendere il problema e il primo passo per risolverlo. Ecco tutto quello che devi sapere.
            </p>
          </div>
        </div>
      </section>

      <div className="py-12 lg:py-16 relative">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Main Topics - Accordion Style */}
          <div className="max-w-4xl mx-auto mb-20">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
              Capire il problema
            </h2>
            <div className="space-y-4">
              {topics.map((topic, index) => {
                const Icon = topic.icon
                const isExpanded = expandedTopic === topic.id
                return (
                  <Card 
                    key={topic.id} 
                    className={`border-2 shadow-lg overflow-hidden transition-all duration-300 ${
                      isExpanded ? "border-primary" : "border-transparent hover:border-primary/30"
                    }`}
                  >
                    <button
                      type="button"
                      className="w-full text-left"
                      onClick={() => setExpandedTopic(isExpanded ? null : topic.id)}
                    >
                      <CardHeader className={`transition-colors ${isExpanded ? "bg-primary/5" : ""}`}>
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 rounded-2xl ${topic.color} flex items-center justify-center flex-shrink-0`}>
                              <Icon className="w-7 h-7" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">Sezione {index + 1}</p>
                              <CardTitle className="text-xl">{topic.title}</CardTitle>
                            </div>
                          </div>
                          <div className={`w-10 h-10 rounded-full bg-secondary flex items-center justify-center transition-transform ${isExpanded ? "rotate-180" : ""}`}>
                            <ChevronDown className="w-5 h-5 text-muted-foreground" />
                          </div>
                        </div>
                      </CardHeader>
                    </button>
                    
                    <div className={`grid transition-all duration-300 ${isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                      <div className="overflow-hidden">
                        <CardContent className="pt-6 pb-8">
                          <div className="space-y-4 pl-[4.5rem]">
                            {topic.content.map((paragraph, pIndex) => (
                              <p key={pIndex} className="text-muted-foreground leading-relaxed">
                                {paragraph}
                              </p>
                            ))}
                          </div>
                        </CardContent>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Consequences Grid */}
          <div className="max-w-6xl mx-auto mb-20">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 text-destructive text-sm font-medium mb-4">
                <AlertTriangle className="w-4 h-4" />
                Conseguenze reali
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4 text-balance">
                Gli effetti che vediamo gia oggi
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Il cambiamento climatico non e una minaccia futura. E una realta che stiamo vivendo adesso.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
              {consequences.map((item, index) => {
                const Icon = item.icon
                return (
                  <Card key={index} className="border-none shadow-lg overflow-hidden group hover:-translate-y-2 transition-all duration-300">
                    <div className={`h-2 bg-gradient-to-r ${item.color}`} />
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                          <div className="flex items-baseline gap-1 mt-1">
                            <span className="text-2xl font-bold text-primary">{item.stat}</span>
                            <span className="text-xs text-muted-foreground">{item.statLabel}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Timeline */}
          <div className="max-w-4xl mx-auto mb-20">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
                <Clock className="w-4 h-4" />
                La storia
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Una corsa contro il tempo
              </h2>
            </div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-destructive -translate-x-1/2 hidden md:block" />
              
              <div className="space-y-8 md:space-y-0">
                {timeline.map((item, index) => (
                  <div 
                    key={index} 
                    className={`relative flex items-center gap-6 md:gap-0 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                  >
                    <div className={`flex-1 ${index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                      <div className={`bg-card rounded-xl p-5 shadow-lg border-2 border-transparent hover:border-primary/30 transition-all ${index % 2 === 0 ? "animate-slide-in-left" : "animate-slide-in-right"}`} style={{ animationDelay: `${index * 100}ms` }}>
                        <div className="text-2xl font-bold text-primary mb-1">{item.year}</div>
                        <div className="font-semibold text-foreground mb-1">{item.event}</div>
                        <div className="text-sm text-muted-foreground">{item.desc}</div>
                      </div>
                    </div>
                    
                    {/* Center dot */}
                    <div className="w-4 h-4 rounded-full bg-primary border-4 border-background shadow-lg z-10 hidden md:block" />
                    
                    <div className="flex-1 hidden md:block" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sources Section */}
          <div className="max-w-4xl mx-auto mb-20">
            <Card className="border-none shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 p-8 md:p-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <ExternalLink className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground">Fonti e approfondimenti</h2>
                    <p className="text-muted-foreground">Risorse autorevoli per saperne di piu</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sources.map((source, index) => (
                    <a
                      key={index}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group bg-card rounded-xl p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden relative`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${source.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                      <div className="relative">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {source.title}
                          </h3>
                          <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0 group-hover:text-primary transition-colors" />
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{source.description}</p>
                        <p className="text-xs text-primary font-medium">{source.domain}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="text-center relative">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
            </div>
            
            <div className="relative">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6 animate-pulse-glow">
                <Leaf className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
                Pronto a fare la differenza?
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-lg mx-auto">
                Ora che sai di piu sul cambiamento climatico, e il momento di agire. Scopri cosa puoi fare ogni giorno.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="gap-2 h-14 px-8 text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                  <Link href="/calcolatore">
                    Calcola il tuo impatto
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="gap-2 h-14 px-8 text-lg bg-transparent hover:scale-105 transition-all">
                  <Link href="/agisci">
                    Scopri le azioni
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
