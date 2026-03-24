"use client"

import React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { 
  Calculator, 
  Car, 
  Zap, 
  Utensils, 
  ArrowRight, 
  Leaf, 
  TrendingDown, 
  TrendingUp, 
  Minus, 
  RotateCcw,
  TreePine,
  Share2,
  Download,
  Sparkles
} from "lucide-react"

interface Results {
  totalEmissions: number
  transportEmissions: number
  energyEmissions: number
  foodEmissions: number
  comparison: "below" | "average" | "above"
  suggestions: string[]
  treesNeeded: number
}

function calculateEmissions(
  km: number,
  energy: string,
  diet: string
): Results {
  // Transport: average car emits ~120g CO2/km
  const transportEmissions = km * 365 * 0.12 // kg CO2/year

  // Energy consumption
  const energyMap: Record<string, number> = {
    low: 800,
    medium: 1500,
    high: 2500,
  }
  const energyEmissions = energyMap[energy] || 1500

  // Diet
  const dietMap: Record<string, number> = {
    meat: 2500,
    balanced: 1700,
    vegetarian: 1200,
  }
  const foodEmissions = dietMap[diet] || 1700

  const totalEmissions = transportEmissions + energyEmissions + foodEmissions

  // Average Italian emissions per capita ~7000 kg CO2/year
  const average = 7000
  let comparison: "below" | "average" | "above"
  if (totalEmissions < average * 0.85) {
    comparison = "below"
  } else if (totalEmissions > average * 1.15) {
    comparison = "above"
  } else {
    comparison = "average"
  }

  const suggestions: string[] = []
  
  if (km > 20) {
    suggestions.push("Considera l'uso di mezzi pubblici o la bicicletta per i tuoi spostamenti quotidiani")
  }
  if (km > 10 && km <= 20) {
    suggestions.push("Prova il carpooling o una e-bike per ridurre le emissioni del trasporto")
  }
  if (energy === "high") {
    suggestions.push("Spegni i dispositivi in standby e usa elettrodomestici a basso consumo energetico")
  }
  if (energy === "medium") {
    suggestions.push("Passa a lampadine LED e ottimizza l'uso del riscaldamento")
  }
  if (diet === "meat") {
    suggestions.push("Prova a ridurre il consumo di carne rossa introducendo piu pasti vegetariani")
  }
  if (suggestions.length === 0) {
    suggestions.push("Ottimo lavoro! Continua cosi e considera di condividere le tue abitudini sostenibili con amici e familiari")
  }

  // Trees needed to offset (1 tree absorbs ~20kg CO2/year)
  const treesNeeded = Math.ceil(totalEmissions / 20)

  return {
    totalEmissions: Math.round(totalEmissions),
    transportEmissions: Math.round(transportEmissions),
    energyEmissions,
    foodEmissions,
    comparison,
    suggestions,
    treesNeeded,
  }
}

function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const duration = 1500
    const steps = 60
    const increment = value / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setDisplayValue(value)
        clearInterval(timer)
      } else {
        setDisplayValue(Math.round(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [value])

  return <>{displayValue.toLocaleString("it-IT")}{suffix}</>
}

export default function CalcolatorePage() {
  const [km, setKm] = useState("")
  const [energy, setEnergy] = useState("")
  const [diet, setDiet] = useState("")
  const [results, setResults] = useState<Results | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [step, setStep] = useState(1)
  const [showResults, setShowResults] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsCalculating(true)
    
    // Simulate calculation delay for better UX
    setTimeout(() => {
      const calculated = calculateEmissions(
        Number.parseFloat(km) || 0,
        energy,
        diet
      )
      setResults(calculated)
      setIsCalculating(false)
      setTimeout(() => setShowResults(true), 100)
    }, 1000)
  }

  const handleReset = () => {
    setKm("")
    setEnergy("")
    setDiet("")
    setResults(null)
    setStep(1)
    setShowResults(false)
  }

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3))
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1))

  const canProceed = () => {
    if (step === 1) return km !== ""
    if (step === 2) return energy !== ""
    if (step === 3) return diet !== ""
    return false
  }

  const getComparisonInfo = (comparison: "below" | "average" | "above") => {
    switch (comparison) {
      case "below":
        return {
          label: "Sotto la media!",
          description: "Le tue emissioni sono inferiori alla media italiana di 7.000 kg/anno",
          icon: TrendingDown,
          color: "text-primary",
          bgColor: "bg-primary/10",
          emoji: "🌿"
        }
      case "average":
        return {
          label: "Nella media",
          description: "Le tue emissioni sono in linea con la media italiana",
          icon: Minus,
          color: "text-accent",
          bgColor: "bg-accent/10",
          emoji: "📊"
        }
      case "above":
        return {
          label: "Sopra la media",
          description: "Le tue emissioni superano la media italiana - hai margine per migliorare!",
          icon: TrendingUp,
          color: "text-destructive",
          bgColor: "bg-destructive/10",
          emoji: "⚠️"
        }
    }
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-20 left-10 w-80 h-80 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="py-12 lg:py-20 relative">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-10 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
                <Calculator className="w-4 h-4" />
                Calcolatore CO2
                <Sparkles className="w-4 h-4" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
                Calcola la tua impronta di carbonio
              </h1>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                Rispondi a poche semplici domande per scoprire quanta CO2 produci ogni anno e come puoi ridurla.
              </p>
            </div>

            {!results ? (
              <div className="animate-fade-in-up delay-100">
                {/* Progress Bar */}
                <div className="mb-8">
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>Progresso</span>
                    <span>Passo {step} di 3</span>
                  </div>
                  <Progress value={(step / 3) * 100} className="h-2" />
                </div>

                <Card className="border-none shadow-2xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
                    <CardTitle className="text-2xl">Le tue abitudini quotidiane</CardTitle>
                    <CardDescription>
                      Compila tutti i campi per ottenere una stima delle tue emissioni annuali.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-8">
                    <form onSubmit={handleSubmit}>
                      {/* Step 1: Transport */}
                      {step === 1 && (
                        <div className="space-y-6 animate-fade-in-up">
                          <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                              <Car className="w-8 h-8 text-primary" />
                            </div>
                            <div>
                              <h3 className="text-xl font-semibold text-foreground">Trasporto</h3>
                              <p className="text-muted-foreground">Quanti chilometri percorri in auto al giorno?</p>
                            </div>
                          </div>
                          
                          <div className="relative">
                            <Input
                              id="km"
                              type="number"
                              min="0"
                              placeholder="Inserisci i km giornalieri..."
                              value={km}
                              onChange={(e) => setKm(e.target.value)}
                              className="h-14 text-lg pl-4 pr-16"
                              required
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                              km/giorno
                            </span>
                          </div>

                          <div className="grid grid-cols-3 gap-3 mt-4">
                            {[
                              { value: "0", label: "0 km", desc: "Non uso l auto" },
                              { value: "15", label: "15 km", desc: "Uso moderato" },
                              { value: "40", label: "40 km", desc: "Pendolare" },
                            ].map((option) => (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => setKm(option.value)}
                                className={`p-4 rounded-xl border-2 text-left transition-all hover:border-primary/50 ${
                                  km === option.value ? "border-primary bg-primary/5" : "border-input"
                                }`}
                              >
                                <div className="font-semibold text-foreground">{option.label}</div>
                                <div className="text-xs text-muted-foreground">{option.desc}</div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Step 2: Energy */}
                      {step === 2 && (
                        <div className="space-y-6 animate-fade-in-up">
                          <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center">
                              <Zap className="w-8 h-8 text-accent" />
                            </div>
                            <div>
                              <h3 className="text-xl font-semibold text-foreground">Consumo elettrico</h3>
                              <p className="text-muted-foreground">Come descriveresti il tuo consumo mensile?</p>
                            </div>
                          </div>
                          
                          <RadioGroup value={energy} onValueChange={setEnergy} className="grid gap-4">
                            {[
                              { value: "low", label: "Basso", desc: "Attento al risparmio, uso limitato di elettrodomestici", icon: "💡" },
                              { value: "medium", label: "Medio", desc: "Uso normale di elettrodomestici e riscaldamento", icon: "🔌" },
                              { value: "high", label: "Alto", desc: "Molti elettrodomestici, climatizzazione frequente", icon: "⚡" },
                            ].map((option) => (
                              <div key={option.value}>
                                <RadioGroupItem
                                  value={option.value}
                                  id={`energy-${option.value}`}
                                  className="peer sr-only"
                                />
                                <Label
                                  htmlFor={`energy-${option.value}`}
                                  className="flex items-center gap-4 rounded-xl border-2 border-input bg-card p-5 cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 transition-all hover:border-primary/50"
                                >
                                  <span className="text-3xl">{option.icon}</span>
                                  <div className="flex-1">
                                    <div className="font-semibold text-foreground">{option.label}</div>
                                    <div className="text-sm text-muted-foreground">{option.desc}</div>
                                  </div>
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                      )}

                      {/* Step 3: Diet */}
                      {step === 3 && (
                        <div className="space-y-6 animate-fade-in-up">
                          <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                              <Utensils className="w-8 h-8 text-primary" />
                            </div>
                            <div>
                              <h3 className="text-xl font-semibold text-foreground">Alimentazione</h3>
                              <p className="text-muted-foreground">Come descriveresti la tua dieta?</p>
                            </div>
                          </div>
                          
                          <RadioGroup value={diet} onValueChange={setDiet} className="grid gap-4">
                            {[
                              { value: "meat", label: "Ricca di carne", desc: "Carne rossa o bianca quasi ogni giorno", icon: "🥩", impact: "Alto impatto" },
                              { value: "balanced", label: "Equilibrata", desc: "Mix di carne, pesce e verdure", icon: "🥗", impact: "Impatto medio" },
                              { value: "vegetarian", label: "Vegetariana/Vegana", desc: "Poca o nessuna carne", icon: "🌱", impact: "Basso impatto" },
                            ].map((option) => (
                              <div key={option.value}>
                                <RadioGroupItem
                                  value={option.value}
                                  id={`diet-${option.value}`}
                                  className="peer sr-only"
                                />
                                <Label
                                  htmlFor={`diet-${option.value}`}
                                  className="flex items-center gap-4 rounded-xl border-2 border-input bg-card p-5 cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 transition-all hover:border-primary/50"
                                >
                                  <span className="text-3xl">{option.icon}</span>
                                  <div className="flex-1">
                                    <div className="font-semibold text-foreground">{option.label}</div>
                                    <div className="text-sm text-muted-foreground">{option.desc}</div>
                                  </div>
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    option.value === "vegetarian" ? "bg-primary/10 text-primary" :
                                    option.value === "balanced" ? "bg-accent/10 text-accent" :
                                    "bg-destructive/10 text-destructive"
                                  }`}>
                                    {option.impact}
                                  </span>
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                      )}

                      {/* Navigation Buttons */}
                      <div className="flex gap-4 mt-8 pt-6 border-t border-border">
                        {step > 1 && (
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={prevStep}
                            className="gap-2 bg-transparent"
                          >
                            Indietro
                          </Button>
                        )}
                        
                        {step < 3 ? (
                          <Button 
                            type="button"
                            onClick={nextStep}
                            disabled={!canProceed()}
                            className="gap-2 ml-auto"
                          >
                            Continua
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button 
                            type="submit" 
                            size="lg" 
                            className="gap-2 ml-auto h-12 px-8"
                            disabled={!canProceed() || isCalculating}
                          >
                            {isCalculating ? (
                              <>
                                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                Calcolo in corso...
                              </>
                            ) : (
                              <>
                                <Calculator className="w-5 h-5" />
                                Calcola le mie emissioni
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className={`space-y-6 ${showResults ? "animate-fade-in-up" : "opacity-0"}`}>
                {/* Results Card */}
                <Card className="border-none shadow-2xl overflow-hidden">
                  <div className="bg-gradient-to-br from-primary via-primary to-accent text-primary-foreground p-8 md:p-12 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtNi42MjcgMC0xMiA1LjM3My0xMiAxMnM1LjM3MyAxMiAxMiAxMiAxMi01LjM3MyAxMi0xMi01LjM3My0xMi0xMi0xMnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-20" />
                    <p className="text-sm opacity-80 mb-2 relative">Le tue emissioni annuali stimate</p>
                    <div className="text-6xl md:text-7xl font-bold mb-2 relative">
                      <AnimatedNumber value={results.totalEmissions} />
                    </div>
                    <p className="text-xl opacity-90 relative">kg CO2 / anno</p>
                    
                    {/* Comparison Badge */}
                    {(() => {
                      const info = getComparisonInfo(results.comparison)
                      const Icon = info.icon
                      return (
                        <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary-foreground/20 backdrop-blur text-primary-foreground text-sm font-medium mt-6 relative`}>
                          <span className="text-lg">{info.emoji}</span>
                          <Icon className="w-4 h-4" />
                          {info.label}
                        </div>
                      )
                    })()}
                  </div>
                  
                  <CardContent className="p-6 md:p-8">
                    {/* Tree equivalent */}
                    <div className="bg-primary/5 rounded-2xl p-6 mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                          <TreePine className="w-7 h-7 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Per compensare le tue emissioni servirebbero</p>
                          <p className="text-2xl font-bold text-foreground">
                            <AnimatedNumber value={results.treesNeeded} /> alberi
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Breakdown */}
                    <h3 className="font-semibold text-foreground mb-4 text-lg">Dettaglio emissioni</h3>
                    
                    <div className="space-y-5">
                      {[
                        { label: "Trasporto", value: results.transportEmissions, icon: Car, color: "bg-primary" },
                        { label: "Energia", value: results.energyEmissions, icon: Zap, color: "bg-accent" },
                        { label: "Alimentazione", value: results.foodEmissions, icon: Utensils, color: "bg-primary" },
                      ].map((item) => {
                        const percentage = Math.round((item.value / results.totalEmissions) * 100)
                        return (
                          <div key={item.label} className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                                  <item.icon className="w-5 h-5 text-muted-foreground" />
                                </div>
                                <span className="font-medium text-foreground">{item.label}</span>
                              </div>
                              <div className="text-right">
                                <span className="font-semibold text-foreground">{item.value.toLocaleString("it-IT")} kg</span>
                                <span className="text-muted-foreground ml-2">({percentage}%)</span>
                              </div>
                            </div>
                            <div className="h-3 bg-secondary rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${item.color} rounded-full transition-all duration-1000 ease-out`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Suggestions Card */}
                <Card className="border-none shadow-xl">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Leaf className="w-7 h-7 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">Suggerimenti personalizzati</CardTitle>
                        <CardDescription>Ecco come puoi ridurre il tuo impatto ambientale</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      {results.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start gap-4 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors">
                          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-bold text-primary-foreground">{index + 1}</span>
                          </div>
                          <p className="text-foreground leading-relaxed pt-1">{suggestion}</p>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Share Section */}
                <Card className="border-none shadow-xl bg-gradient-to-r from-primary/5 to-accent/5">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Condividi i tuoi risultati</h3>
                        <p className="text-sm text-muted-foreground">Ispira altri a calcolare il proprio impatto</p>
                      </div>
                      <div className="flex gap-3">
                        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                          <Share2 className="w-4 h-4" />
                          Condividi
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                          <Download className="w-4 h-4" />
                          Scarica PDF
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button variant="outline" onClick={handleReset} className="gap-2 flex-1 h-12 bg-transparent hover:scale-105 transition-all">
                    <RotateCcw className="w-4 h-4" />
                    Ricalcola
                  </Button>
                  <Button asChild className="gap-2 flex-1 h-12 hover:scale-105 transition-all">
                    <Link href="/agisci">
                      Scopri come ridurre le emissioni
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
