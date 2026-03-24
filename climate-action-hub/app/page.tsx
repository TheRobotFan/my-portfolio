"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  ArrowRight,
  Leaf,
  Calculator,
  BookOpen,
  Globe,
  Thermometer,
  Wind,
  Droplets,
  TreePine,
  Zap,
  Users,
  Target,
  TrendingDown,
  Sparkles,
  ChevronDown
} from "lucide-react"
import { useEffect, useState, useRef } from "react"

function AnimatedCounter({ end, suffix = "", duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    let startTime: number
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      setCount(Math.floor(progress * end))
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    requestAnimationFrame(animate)
  }, [isVisible, end, duration])

  return (
    <div ref={ref} className="text-4xl md:text-5xl font-bold text-primary">
      {count.toLocaleString("it-IT")}{suffix}
    </div>
  )
}

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="flex flex-col overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Parallax */}
        <div
          className="absolute inset-0 z-0"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        >
          <Image
            src="/images/hero-earth.jpg"
            alt="Vista aerea della natura"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-10 w-20 h-20 rounded-full bg-primary/20 animate-float delay-100" />
          <div className="absolute top-1/3 right-20 w-14 h-14 rounded-full bg-accent/20 animate-float delay-300" />
          <div className="absolute bottom-1/4 left-1/4 w-10 h-10 rounded-full bg-primary/15 animate-float delay-500" />
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass text-primary text-sm font-semibold mb-8 shadow-lg">
                <Globe className="w-4 h-4 animate-breathe" />
                Insieme per il pianeta
                <Sparkles className="w-4 h-4" />
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight animate-fade-in-up delay-100" style={{ fontFamily: 'var(--font-display)' }}>
              <span className="text-balance">Piccole azioni.</span>
              <br />
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient">
                Grande impatto sul clima.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto text-pretty animate-fade-in-up delay-200 font-medium">
              Scopri come le tue scelte quotidiane influenzano l&apos;ambiente e impara a ridurre la tua impronta di carbonio con semplici azioni concrete.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-300">
              <Button asChild size="lg" className="rounded-full gap-2 h-14 px-8 text-lg shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/40 transition-all hover:-translate-y-1">
                <Link href="/calcolatore">
                  <Calculator className="w-5 h-5" />
                  Calcola il tuo impatto
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full gap-2 h-14 px-8 text-lg bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 hover:-translate-y-1 transition-all">
                <Link href="/agisci">
                  Inizia ad agire
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-primary/30 flex items-start justify-center p-1">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-scroll-pill" />
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="py-8 bg-black/40 backdrop-blur-md border-y border-white/5 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 md:gap-24 text-center">
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Thermometer className="w-6 h-6 text-primary" />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-xl font-black">+1.1°C</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">dal 1880</span>
              </div>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Wind className="w-6 h-6 text-primary" />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-xl font-black">420+ ppm</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">CO2 ATMOSFERA</span>
              </div>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Droplets className="w-6 h-6 text-primary" />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-xl font-black">3.6mm</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">ANNO LIVELLO MARE</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is Climate Change */}
      <section className="py-32 bg-background relative overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="animate-fade-in-up relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest mb-8">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                La sfida del nostro tempo
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-8 leading-tight tracking-tighter" style={{ fontFamily: 'var(--font-display)' }}>
                Il pianeta si sta riscaldando. <span className="italic text-primary">E velocemente.</span>
              </h2>
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed font-medium">
                <p>
                  Il cambiamento climatico non è una minaccia futura: è una realtà che stiamo vivendo oggi. Temperature record, eventi meteorologici estremi e ecosistemi in crisi sono segnali che non possiamo ignorare.
                </p>
                <p>
                  La buona notizia? <span className="text-foreground font-bold">Abbiamo ancora tempo per agire.</span> Ogni tonnellata di CO2 che evitiamo di emettere fa la differenza. E insieme, possiamo costruire un futuro sostenibile.
                </p>
              </div>
              <div className="mt-12 flex gap-4">
                <Button asChild className="rounded-full gap-2 px-8 h-14 font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-primary/20">
                  <Link href="/impara">
                    <BookOpen className="w-4 h-4" />
                    Scopri di più
                  </Link>
                </Button>
                <Button asChild variant="ghost" className="rounded-full gap-2 px-8 h-14 font-black uppercase text-xs tracking-[0.2em] hover:bg-primary/5">
                  <Link href="/agisci">
                    I nostri obiettivi
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-[2.5rem] blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 ring-1 ring-white/5">
                <Image
                  src="/images/climate-action.jpg"
                  alt="Impatto del cambiamento climatico"
                  width={800}
                  height={600}
                  className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="glass-card p-6 rounded-2xl border-white/10 bg-black/40">
                    <p className="text-sm font-bold text-white leading-tight">
                      "La natura non è un posto da visitare. È casa nostra."
                      <span className="block text-xs font-bold text-primary mt-2 uppercase tracking-widest">— Gary Snyder</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating stats */}
              <div className="absolute -top-12 -right-12 bg-white dark:bg-black rounded-3xl p-8 shadow-2xl border border-black/5 dark:border-white/10 animate-float">
                <div className="text-5xl font-black text-primary mb-2 tracking-tighter">2050</div>
                <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Obiettivo emissioni zero</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Cards */}
      <section className="py-32 bg-black/5 dark:bg-white/[0.02] relative border-y border-white/5">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-24">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-[0.2em] mb-8">
              <Target className="w-3.5 h-3.5" />
              Conseguenze reali
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-8 tracking-tighter" style={{ fontFamily: 'var(--font-display)' }}>
              Cosa sta succedendo?
            </h2>
            <p className="text-muted-foreground text-xl font-medium leading-relaxed">
              Gli effetti del cambiamento climatico sono già visibili ovunque. Ecco le conseguenze che stiamo affrontando.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children">
            {[
              {
                icon: Thermometer,
                title: "Temperature estreme",
                description: "Ondate di calore sempre più frequenti e intense, con record registrati ogni anno.",
                stat: "+1.1°C",
                statLabel: "DAL 1880",
                color: "primary"
              },
              {
                icon: Wind,
                title: "Eventi meteorologici",
                description: "Uragani, alluvioni e siccità stanno diventando devastanti e imprevedibili.",
                stat: "+23%",
                statLabel: "EVENTI ESTREMI",
                color: "accent"
              },
              {
                icon: Droplets,
                title: "Innalzamento mari",
                description: "Lo scioglimento dei ghiacci innalza il livello del mare, minacciando le coste.",
                stat: "3.6mm",
                statLabel: "LIVELLO ANNUALE",
                color: "primary"
              },
              {
                icon: TreePine,
                title: "Perdita biodiversità",
                description: "Un milione di specie rischia l'estinzione a causa dei cambiamenti ambientali rapidi.",
                stat: "1M",
                statLabel: "SPECIE A RISCHIO",
                color: "accent"
              },
              {
                icon: Users,
                title: "Migrazioni climatiche",
                description: "Milioni di persone costrette a spostarsi per condizioni ambientali insostenibili.",
                stat: "216M",
                statLabel: "MIGRANTI ENTRO 2050",
                color: "primary"
              },
              {
                icon: Zap,
                title: "Crisi alimentare",
                description: "La produzione agricola è minacciata da siccità e temperature estreme.",
                stat: "-25%",
                statLabel: "RACCOLTI A RISCHIO",
                color: "accent"
              }
            ].map((item, index) => {
              const Icon = item.icon
              return (
                <Card key={index} className="glass dark:glass-dark border-white/10 shadow-2xl hover:shadow-primary/20 transition-all duration-500 group hover:-translate-y-3 overflow-hidden rounded-[2rem]">
                  <CardContent className="pt-10 p-10 relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/5 to-transparent rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center mb-8 group-hover:bg-primary/20 group-hover:rotate-6 transition-all duration-500">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-2xl font-black text-foreground mb-4 tracking-tight">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed mb-8 font-medium">
                      {item.description}
                    </p>
                    <div className="flex flex-col gap-1">
                      <span className="text-4xl font-black text-primary tracking-tighter">{item.stat}</span>
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">{item.statLabel}</span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-32 bg-background relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/renewable-energy.jpg"
            alt="Energia rinnovabile"
            fill
            className="object-cover opacity-10"
          />
        </div>
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-24">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-xs font-black uppercase tracking-[0.2em] mb-8">
              <Leaf className="w-3.5 h-3.5" />
              Le soluzioni esistono
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-8 tracking-tighter" style={{ fontFamily: 'var(--font-display)' }}>
              Insieme possiamo farcela
            </h2>
            <p className="text-muted-foreground text-xl font-medium">
              La transizione verso un futuro sostenibile è iniziata. <span className="text-foreground">Sei pronto a farne parte?</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Calculator, label: "Calcola", desc: "Misura il tuo impatto", href: "/calcolatore" },
              { icon: BookOpen, label: "Impara", desc: "Comprendi il problema", href: "/impara" },
              { icon: Target, label: "Agisci", desc: "Riduci le emissioni", href: "/agisci" },
              { icon: Users, label: "Condividi", desc: "Ispira gli altri", href: "#" }
            ].map((item, index) => {
              const Icon = item.icon
              return (
                <Link
                  key={index}
                  href={item.href}
                  className="group relative glass dark:glass-dark rounded-[2.5rem] p-10 text-center shadow-2xl hover:shadow-primary/30 transition-all duration-500 border border-white/5 hover:border-primary/20 hover:-translate-y-4"
                >
                  <div className="w-20 h-20 rounded-[1.5rem] bg-primary/5 flex items-center justify-center mx-auto mb-8 group-hover:bg-primary group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                    <Icon className="w-10 h-10 text-primary group-hover:text-black transition-colors" />
                  </div>
                  <h3 className="text-2xl font-black text-foreground mb-3 tracking-tight">{item.label}</h3>
                  <p className="text-muted-foreground font-medium">{item.desc}</p>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Stats Section with Animated Counters */}
      <section className="py-32 bg-black dark:bg-black text-white relative overflow-hidden border-y border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-50" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-8 tracking-tighter leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
                I numeri non mentono
              </h2>
              <p className="text-white/70 text-xl font-medium leading-relaxed mb-12">
                La media italiana di emissioni è di circa <span className="text-primary font-bold">7 tonnellate di CO2</span> a persona ogni anno. È il momento di abbassare questa soglia.
              </p>
              <Button asChild size="lg" className="rounded-full gap-3 px-10 h-16 font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-primary/40">
                <Link href="/calcolatore">
                  <TrendingDown className="w-5 h-5" />
                  Analizza il tuo stile di vita
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="glass-card bg-white/5 p-10 rounded-[2.5rem] border border-white/10 backdrop-blur-3xl group hover:bg-white/10 transition-colors">
                <AnimatedCounter end={7000} suffix=" kg" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/80 mt-4 leading-tight">CO2/ANNO PER ITALIANO</p>
              </div>
              <div className="glass-card bg-white/5 p-10 rounded-[2.5rem] border border-white/10 backdrop-blur-3xl group hover:bg-white/10 transition-colors">
                <AnimatedCounter end={420} suffix="+" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/80 mt-4 leading-tight">PPM CO2 ATUALI</p>
              </div>
              <div className="glass-card bg-white/5 p-10 rounded-[2.5rem] border border-white/10 backdrop-blur-3xl group hover:bg-white/10 transition-colors">
                <AnimatedCounter end={30} suffix="%" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/80 mt-4 leading-tight">EMISSIONI TRASPORTI</p>
              </div>
              <div className="glass-card bg-white/5 p-10 rounded-[2.5rem] border border-white/10 backdrop-blur-3xl group hover:bg-white/10 transition-colors">
                <AnimatedCounter end={25} suffix="%" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/80 mt-4 leading-tight">EMISSIONI DIETA</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Future Vision */}
      <section className="py-32 bg-background relative overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="order-2 lg:order-1 relative group">
              <div className="absolute -inset-8 bg-primary/10 rounded-[3rem] blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/5">
                <Image
                  src="/images/sustainable-city.jpg"
                  alt="Città sostenibile del futuro"
                  width={800}
                  height={600}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-[2s]"
                />
              </div>
              {/* Floating badges */}
              <div className="absolute -top-8 -left-8 w-20 h-20 bg-primary rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/40 animate-float border border-white/20">
                <TreePine className="w-10 h-10 text-black" />
              </div>
              <div className="absolute -bottom-8 -right-8 w-20 h-20 bg-accent rounded-3xl flex items-center justify-center shadow-2xl shadow-accent/40 animate-float delay-500 border border-white/20">
                <Zap className="w-10 h-10 text-black" />
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-xs font-black uppercase tracking-[0.2em] mb-8">
                <Sparkles className="w-3.5 h-3.5" />
                Un futuro possibile
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-8 leading-tight tracking-tighter" style={{ fontFamily: 'var(--font-display)' }}>
                Il mondo di domani.
              </h2>
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed font-medium">
                <p>
                  Immagina città verdi con aria pulita, energia rinnovabile per tutti, trasporti sostenibili e natura rigogliosa. Questo futuro è possibile, ma richiede l'impegno di tutti noi, ora.
                </p>
                <p>
                  Le tecnologie esistono già. Pannelli solari, mobilità elettrica, agricoltura sostenibile: sono soluzioni concrete che <span className="text-foreground">stiamo già implementando.</span>
                </p>
              </div>
              <ul className="mt-12 space-y-4">
                {[
                  "Energia 100% rinnovabile entro il 2050",
                  "Miglioramento radicale dei trasporti urbani",
                  "Economia circolare e abbattimento rifiuti",
                  "Biodiversità protetta e riforestazione globale"
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-4 group">
                    <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors shrink-0">
                      <Leaf className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-foreground font-black uppercase text-[11px] tracking-widest">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-48 bg-primary text-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

        {/* Decorative elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-white/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-4 lg:px-8 text-center relative z-10">
          <div className="w-24 h-24 rounded-[2rem] bg-black shadow-2xl flex items-center justify-center mx-auto mb-12 animate-breathe">
            <Leaf className="w-12 h-12 text-primary fill-primary" />
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-10 tracking-tighter max-w-4xl mx-auto leading-[0.9]" style={{ fontFamily: 'var(--font-display)' }}>
            IL MOMENTO DI AGIRE <br /> <span className="italic opacity-50">È ADESSO.</span>
          </h2>
          <p className="text-black/70 text-xl md:text-2xl mb-16 max-w-2xl mx-auto leading-tight font-black uppercase tracking-tight">
            Ogni istante è un'opportunità per cambiare rotta. Inizia oggi il tuo viaggio verso la sostenibilità.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button asChild size="lg" className="bg-black text-primary hover:bg-black/80 rounded-full h-20 px-12 text-lg font-black uppercase tracking-widest shadow-2xl transition-all hover:scale-105 active:scale-95">
              <Link href="/calcolatore">
                <Calculator className="w-6 h-6 mr-3" />
                Calcola Impatto
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-transparent border-black/20 text-black hover:bg-black/5 rounded-full h-20 px-12 text-lg font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95">
              <Link href="/agisci">
                Scopri Azioni
                <ArrowRight className="w-6 h-6 ml-3" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
