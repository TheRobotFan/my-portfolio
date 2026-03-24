"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
    Shield,
    Users,
    Trophy,
    ArrowLeft,
    Plus,
    Search,
    MessageSquare,
    Zap,
    Star,
    Swords,
    Crown
} from "lucide-react"

export default function ClansPage() {
    const [searchQuery, setSearchQuery] = useState("")

    const clans = [
        {
            id: 'clan_1',
            name: 'Domino Kings',
            tag: 'KNG',
            description: 'Il clan dei migliori giocatori di domino.',
            members: 45,
            maxMembers: 50,
            level: 12,
            trophies: 15400,
            requirement: 'Livello 10+',
            color: 'amber'
        },
        {
            id: 'clan_2',
            name: 'Cyber Domino',
            tag: 'CYB',
            description: 'Velocità e precisione tecnica.',
            members: 28,
            maxMembers: 50,
            level: 8,
            trophies: 8200,
            requirement: 'Nessuno',
            color: 'cyan'
        },
        {
            id: 'clan_3',
            name: 'Legione Italiana',
            tag: 'ITA',
            description: 'Giocatori italiani uniti!',
            members: 50,
            maxMembers: 50,
            level: 15,
            trophies: 21000,
            requirement: 'Solo Italiani',
            color: 'green'
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
                    <h1 className="font-bold text-xl text-foreground italic uppercase tracking-widest">Clan</h1>
                    <div className="flex items-center gap-2">
                        <Shield className="w-6 h-6 text-blue-400" />
                        <span className="font-black italic">SOCIETY</span>
                    </div>
                </div>
            </header>

            <main className="pt-24 pb-12 px-4">
                <div className="container mx-auto max-w-5xl">
                    {/* Hero section */}
                    <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex-1 text-left"
                        >
                            <h2 className="text-5xl font-black italic tracking-tighter uppercase mb-4 leading-none">
                                Trova il tuo <span className="text-blue-400">Clan</span>
                            </h2>
                            <p className="text-muted-foreground max-w-md text-lg">
                                Unisciti a una community, condividi strategie e domina le classifiche insieme ai tuoi compagni.
                            </p>
                            <div className="flex gap-4 mt-8">
                                <Button className="rounded-full px-8 gap-2">
                                    <Plus className="w-4 h-4" /> Crea Clan
                                </Button>
                                <div className="relative flex-1 max-w-xs">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Cerca un clan..."
                                        className="pl-10 rounded-full bg-black/20"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full md:w-1/3 aspect-square bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl border border-white/10 flex items-center justify-center relative overflow-hidden group"
                        >
                            <Shield className="w-32 h-32 text-blue-400/50 group-hover:text-blue-400 transition-all group-hover:scale-110" />
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent opacity-50" />
                        </motion.div>
                    </div>

                    {/* Clans Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {clans.map((clan, index) => (
                            <motion.div
                                key={clan.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="hover:border-blue-500/50 transition-all cursor-pointer group bg-black/40 backdrop-blur-md border-white/5 h-full flex flex-col">
                                    <CardHeader>
                                        <div className="flex justify-between items-start mb-2">
                                            <div className={`w-12 h-12 rounded-xl bg-${clan.color}-500/20 flex items-center justify-center border border-${clan.color}-500/30`}>
                                                <Shield className={`w-6 h-6 text-${clan.color}-400`} />
                                            </div>
                                            <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-widest border-white/10">
                                                LV. {clan.level}
                                            </Badge>
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl font-black italic uppercase flex items-center gap-2">
                                                {clan.name}
                                                <span className="text-xs font-bold text-muted-foreground not-italic">[{clan.tag}]</span>
                                            </CardTitle>
                                            <CardDescription className="line-clamp-2 mt-1">{clan.description}</CardDescription>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4 flex-1">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-white/5 rounded-lg p-2 text-center">
                                                <Users className="w-4 h-4 mx-auto mb-1 text-blue-400" />
                                                <p className="text-xs text-muted-foreground uppercase font-bold">Membri</p>
                                                <p className="font-bold">{clan.members}/{clan.maxMembers}</p>
                                            </div>
                                            <div className="bg-white/5 rounded-lg p-2 text-center">
                                                <Trophy className="w-4 h-4 mx-auto mb-1 text-amber-400" />
                                                <p className="text-xs text-muted-foreground uppercase font-bold">Trofei</p>
                                                <p className="font-bold">{clan.trophies.toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <div className="text-xs flex items-center justify-between text-muted-foreground">
                                            <span>Requisito:</span>
                                            <span className="font-bold text-foreground">{clan.requirement}</span>
                                        </div>
                                    </CardContent>
                                    <div className="p-4 pt-0 mt-auto">
                                        <Button className="w-full rounded-xl group-hover:bg-blue-600 transition-colors" variant="secondary">
                                            Unisciti
                                        </Button>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {/* Quick Actions / Create CTA */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-12 p-8 rounded-3xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6"
                    >
                        <div>
                            <h3 className="text-2xl font-black italic uppercase tracking-tight">Vuoi creare il tuo Clan?</h3>
                            <p className="text-muted-foreground">Porta i tuoi amici e scala le vette della classifica globale.</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-1.5 px-4 py-2 bg-black/40 rounded-full border border-white/10">
                                <Users className="w-4 h-4 text-blue-400" />
                                <span className="text-sm font-bold">Costo: 1000 Monete</span>
                            </div>
                            <Button className="rounded-full px-8 bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/20">Crea Ora</Button>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    )
}
