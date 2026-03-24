"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Trophy,
    Users,
    Clock,
    ArrowLeft,
    Crown,
    Medal,
    Star,
    Zap,
    Swords,
    Timer
} from "lucide-react"

export default function TournamentsPage() {
    const [activeTab, setActiveTab] = useState<'open' | 'ongoing' | 'finished'>('open')

    const tournamentTypes = [
        {
            id: 'daily',
            name: 'Torneo Giornaliero',
            description: 'Ogni giorno una nuova sfida',
            icon: <Timer className="w-8 h-8 text-blue-400" />,
            entry: '100 Monete',
            prize: '500 Monete + 10 XP',
            color: 'blue'
        },
        {
            id: 'elite',
            name: 'Torneo Elite',
            description: 'Solo per i migliori giocatori',
            icon: <Crown className="w-8 h-8 text-amber-400" />,
            entry: '50 Gemme',
            prize: 'Skin Esclusiva + 500 Gemme',
            color: 'amber',
            link: '/tournaments/elite'
        },
        {
            id: 'weekly',
            name: 'Gran Torneo Settimanale',
            description: 'La battaglia per il ranking di fine settimana',
            icon: <Trophy className="w-8 h-8 text-purple-400" />,
            entry: '500 Monete',
            prize: '2500 Monete + Badge Speciale',
            color: 'purple'
        }
    ]

    return (
        <div className="min-h-screen bg-game-table">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Button
                        asChild
                        variant="ghost"
                        className="rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm"
                    >
                        <Link href="/">
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Menu
                        </Link>
                    </Button>
                    <h1 className="font-bold text-xl text-foreground italic uppercase tracking-widest">Tornei</h1>
                    <div className="flex items-center gap-2">
                        <Trophy className="w-6 h-6 text-amber-400" />
                        <span className="font-black italic">ARENA</span>
                    </div>
                </div>
            </header>

            <main className="pt-24 pb-12 px-4">
                <div className="container mx-auto max-w-4xl">
                    {/* Hero section */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-12 text-center"
                    >
                        <div className="inline-block p-4 rounded-full bg-primary/10 mb-4 ring-1 ring-primary/30">
                            <Swords className="w-12 h-12 text-primary" />
                        </div>
                        <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-2">Entra nell&apos;Arena</h2>
                        <p className="text-muted-foreground max-w-md mx-auto">
                            Dimostra il tuo valore in tornei competitivi e vinci premi leggendari.
                        </p>
                    </motion.div>

                    {/* Tournament Types Grid */}
                    <div className="grid md:grid-cols-3 gap-6 mb-12">
                        {tournamentTypes.map((type, index) => (
                            <motion.div
                                key={type.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="h-full hover:border-primary transition-all cursor-pointer overflow-hidden group">
                                    <div className={`h-1 w-full bg-${type.color}-500/50 group-hover:bg-${type.color}-500 transition-colors`} />
                                    <CardHeader>
                                        <div className="mb-4">{type.icon}</div>
                                        <CardTitle className="text-xl font-bold italic uppercase">{type.name}</CardTitle>
                                        <CardDescription>{type.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Entrata:</span>
                                            <span className="font-bold">{type.entry}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Primo Premio:</span>
                                            <span className="font-bold text-green-500">{type.prize}</span>
                                        </div>
                                        <Button asChild className="w-full mt-4" variant={type.id === 'elite' ? 'default' : 'outline'}>
                                            <Link href={type.link || `/tournaments/${type.id}`}>
                                                Visualizza Tornei
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {/* Active Status Tabs */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between mb-2">
                                <CardTitle className="text-2xl font-black italic uppercase">Tutti i Tornei</CardTitle>
                                <Badge variant="secondary" className="bg-primary/20 text-primary uppercase font-bold tracking-tighter">Live Now</Badge>
                            </div>
                            <div className="flex gap-2">
                                {(['open', 'ongoing', 'finished'] as const).map((tab) => (
                                    <Button
                                        key={tab}
                                        variant={activeTab === tab ? "default" : "ghost"}
                                        size="sm"
                                        onClick={() => setActiveTab(tab)}
                                        className="capitalize text-xs font-bold tracking-widest"
                                    >
                                        {tab === 'open' ? 'Iscrizioni Aperte' : tab === 'ongoing' ? 'In Corso' : 'Conclusi'}
                                    </Button>
                                ))}
                            </div>
                        </CardHeader>
                        <CardContent>
                            {activeTab === 'open' ? (
                                <div className="space-y-4">
                                    {[1, 2].map((i) => (
                                        <div key={i} className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl border border-border bg-muted/30 hover:bg-muted/50 transition-colors gap-4">
                                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                                                    <Medal className="w-6 h-6 text-primary" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold italic uppercase tracking-tight">Mini-Arena #{i}204</h4>
                                                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                                                        <span className="flex items-center gap-1">
                                                            <Users className="w-3 h-3" /> 12/32
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-3 h-3" /> Inizia tra 14m
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                                <div className="text-right hidden sm:block">
                                                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Entry Fee</p>
                                                    <p className="font-black italic">50 Monete</p>
                                                </div>
                                                <Button size="sm" className="w-full sm:w-auto rounded-full px-8">Partecipa</Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 text-center text-muted-foreground">
                                    <Trophy className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                    <p className="italic">Nessun torneo in questa categoria al momento.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}
