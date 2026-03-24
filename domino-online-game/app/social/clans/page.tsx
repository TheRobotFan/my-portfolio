"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useGameStore, Clan } from "@/lib/game-store"
import { Button } from "@/components/ui/button"
import {
    Users,
    Plus,
    Search,
    ChevronLeft,
    Shield,
    Trophy,
    MessageSquare,
    Settings,
    UserPlus,
    Crown
} from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export default function ClansPage() {
    const { clans, userClan, fetchClans, createClan, joinClan, user } = useGameStore()
    const [activeTab, setActiveTab] = useState<'discover' | 'my-clan'>('discover')
    const [searchQuery, setSearchQuery] = useState("")
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [newClanName, setNewClanName] = useState("")
    const [newClanTag, setNewClanTag] = useState("")

    useEffect(() => {
        fetchClans()
        if (userClan) setActiveTab('my-clan')
    }, [fetchClans, userClan])

    const filteredClans = clans.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.tag.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleCreateClan = async () => {
        if (!newClanName || !newClanTag) return
        await createClan(newClanName, newClanTag, "")
        setShowCreateModal(false)
        setNewClanName("")
        setNewClanTag("")
    }

    return (
        <div className="min-h-screen bg-background text-foreground pb-20 overflow-x-hidden">
            {/* Background Decorations */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
                <div className="absolute top-[20%] right-[10%] w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute top-[60%] left-[5%] w-80 h-80 bg-accent/20 rounded-full blur-[100px] animate-pulse" />
            </div>

            <div className="max-w-4xl mx-auto px-4 pt-10 relative z-10">
                <header className="flex items-center justify-between mb-10">
                    <Button variant="ghost" asChild className="rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 h-12 w-12 p-0">
                        <Link href="/">
                            <ChevronLeft className="w-6 h-6" />
                        </Link>
                    </Button>
                    <div className="text-center">
                        <h1 className="text-4xl font-black tracking-tighter uppercase italic drop-shadow-lg">
                            Club <span className="text-primary italic">Elite</span>
                        </h1>
                        <p className="text-muted-foreground font-medium uppercase tracking-widest text-[10px] sm:text-xs mt-1">Unisciti alle leggende del domino</p>
                    </div>
                    <div className="w-12" />
                </header>

                {/* Navigation Tabs */}
                <div className="flex bg-white/5 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 mb-8 max-w-md mx-auto">
                    <button
                        onClick={() => setActiveTab('discover')}
                        className={cn(
                            "flex-1 py-3 px-4 rounded-xl text-sm font-black transition-all uppercase tracking-tighter flex items-center justify-center gap-2",
                            activeTab === 'discover' ? "bg-primary text-primary-foreground shadow-lg" : "hover:bg-white/5 text-muted-foreground"
                        )}
                    >
                        <Search className="w-4 h-4" /> Scopri
                    </button>
                    <button
                        onClick={() => setActiveTab('my-clan')}
                        className={cn(
                            "flex-1 py-3 px-4 rounded-xl text-sm font-black transition-all uppercase tracking-tighter flex items-center justify-center gap-2",
                            activeTab === 'my-clan' ? "bg-primary text-primary-foreground shadow-lg" : "hover:bg-white/5 text-muted-foreground"
                        )}
                    >
                        <Shield className="w-4 h-4" /> Il Mio Club
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'discover' ? (
                        <motion.div
                            key="discover"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-6"
                        >
                            {/* Actions & Search */}
                            <div className="flex flex-col sm:flex-row gap-4 items-stretch">
                                <div className="relative flex-1 group">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                    <input
                                        type="text"
                                        placeholder="Cerca club per nome o tag..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                                    />
                                </div>
                                <Button
                                    onClick={() => setShowCreateModal(true)}
                                    className="rounded-2xl h-14 px-8 bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-xl shadow-primary/20 gap-2 uppercase font-black"
                                >
                                    <Plus className="w-5 h-5" /> Crea Club
                                </Button>
                            </div>

                            {/* Clubs List */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {filteredClans.map((clan, idx) => (
                                    <motion.div
                                        key={clan.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="group bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl hover:bg-white/10 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer relative overflow-hidden"
                                    >
                                        {/* Background Tag */}
                                        <div className="absolute -right-4 -top-4 text-7xl font-black text-white/[0.03] rotate-12 group-hover:rotate-0 transition-transform">
                                            {clan.tag}
                                        </div>

                                        <div className="flex items-start gap-5 relative z-10">
                                            <div className="w-16 h-16 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-white/10">
                                                {clan.logo || '🛡️'}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-black text-lg uppercase tracking-tight">{clan.name}</h3>
                                                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px] px-1.5 py-0">
                                                        [{clan.tag}]
                                                    </Badge>
                                                </div>
                                                <p className="text-xs text-muted-foreground line-clamp-1 mb-3">{clan.description || "Unisciti per dominare le classifiche!"}</p>
                                                <div className="flex items-center gap-4 text-[10px] font-black uppercase text-muted-foreground">
                                                    <div className="flex items-center gap-1.5">
                                                        <Users className="w-3.5 h-3.5 text-primary" />
                                                        {clan.members.length} Soci
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <Trophy className="w-3.5 h-3.5 text-yellow-500" />
                                                        {clan.points} PT
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <Button
                                            onClick={(e) => { e.stopPropagation(); joinClan(clan.id); }}
                                            variant="ghost"
                                            className="w-full mt-6 rounded-xl bg-white/5 hover:bg-primary hover:text-primary-foreground font-black text-xs h-10 uppercase tracking-widest border border-white/5"
                                        >
                                            Unisciti Ora
                                        </Button>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    ) : userClan ? (
                        <motion.div
                            key="my-clan"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="space-y-8"
                        >
                            {/* My Clan Header */}
                            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[40px] p-8 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />

                                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
                                    <div className="w-32 h-32 bg-gradient-to-br from-primary/30 to-black/40 rounded-3xl flex items-center justify-center text-6xl shadow-2xl border border-white/10 shrink-0">
                                        {userClan.logo || '🛡️'}
                                    </div>
                                    <div className="flex-1 text-center md:text-left">
                                        <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                                            <h2 className="text-3xl font-black uppercase tracking-tighter italic">{userClan.name}</h2>
                                            <Badge className="bg-primary text-primary-foreground text-sm font-black italic">[{userClan.tag}]</Badge>
                                        </div>
                                        <p className="text-muted-foreground text-sm max-w-md mb-6">{userClan.description || "Il potere è nell'unione!"}</p>

                                        <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                            <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/10 flex flex-col items-center min-w-[80px]">
                                                <span className="text-[10px] font-bold text-muted-foreground uppercase mb-0.5">Livello</span>
                                                <span className="font-black text-xl text-primary">{userClan.level}</span>
                                            </div>
                                            <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/10 flex flex-col items-center min-w-[80px]">
                                                <span className="text-[10px] font-bold text-muted-foreground uppercase mb-0.5">Punti</span>
                                                <span className="font-black text-xl text-yellow-500">{userClan.points}</span>
                                            </div>
                                            <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/10 flex flex-col items-center min-w-[80px]">
                                                <span className="text-[10px] font-bold text-muted-foreground uppercase mb-0.5">Membri</span>
                                                <span className="font-black text-xl text-foreground">{userClan.members.length}/50</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Members List */}
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                                <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
                                    <div className="flex items-center gap-2">
                                        <Users className="w-5 h-5 text-primary" />
                                        <span className="font-black uppercase tracking-widest text-sm italic">Membri Attivi</span>
                                    </div>
                                    <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
                                        <UserPlus className="w-5 h-5 text-primary" />
                                    </Button>
                                </div>
                                <div className="divide-y divide-white/5">
                                    {userClan.members.map((member, idx) => (
                                        <div key={member.userId} className="p-4 flex items-center gap-4 hover:bg-white/5 transition-colors group">
                                            <div className="relative">
                                                <Avatar className="w-12 h-12 border border-white/10">
                                                    <AvatarFallback className="font-black bg-muted">{member.username[0]}</AvatarFallback>
                                                </Avatar>
                                                {member.role === 'leader' && (
                                                    <div className="absolute -top-1 -right-1 bg-yellow-400 p-1 rounded-full text-black shadow-lg">
                                                        <Crown className="w-3 h-3" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-sm uppercase tracking-tight">{member.username}</h4>
                                                <p className="text-[10px] text-muted-foreground font-black uppercase">{member.role}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-black text-sm text-primary tracking-tighter">+{member.contributionPoints} PT</p>
                                                <p className="text-[8px] text-muted-foreground font-bold uppercase">Attivo 5m fa</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Clan Actions Hub */}
                            <div className="grid grid-cols-2 gap-4">
                                <Button className="h-20 rounded-[24px] bg-white/5 hover:bg-white/10 border border-white/10 flex flex-col gap-1 transition-all group">
                                    <MessageSquare className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Chat Club</span>
                                </Button>
                                <Button className="h-20 rounded-[24px] bg-white/5 hover:bg-white/10 border border-white/10 flex flex-col gap-1 transition-all group">
                                    <Settings className="w-6 h-6 text-muted-foreground group-hover:rotate-45 transition-transform" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Gestione</span>
                                </Button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="no-clan"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-20 px-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[40px] shadow-2xl"
                        >
                            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/20">
                                <Shield className="w-12 h-12 text-primary animate-pulse" />
                            </div>
                            <h3 className="text-2xl font-black uppercase tracking-tighter italic mb-3">Nessun Club Trovato</h3>
                            <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-10 font-medium">Non fai ancora parte di nessun club. Unisciti ad uno esistente o crea il tuo impero personale!</p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button
                                    onClick={() => setActiveTab('discover')}
                                    className="rounded-2xl px-8 h-12 bg-white/10 hover:bg-white/20 uppercase font-black tracking-widest text-xs"
                                >
                                    Sfoglia Club
                                </Button>
                                <Button
                                    onClick={() => setShowCreateModal(true)}
                                    className="rounded-2xl px-8 h-12 bg-primary hover:bg-primary/90 uppercase font-black tracking-widest text-xs"
                                >
                                    Crea Club
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Create Clan Modal Overlay */}
            <AnimatePresence>
                {showCreateModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowCreateModal(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="w-full max-w-md bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[40px] p-8 shadow-[0_0_100px_rgba(var(--primary),0.2)] relative z-10"
                        >
                            <h2 className="text-3xl font-black uppercase tracking-tighter italic text-center mb-8">Crea Nuovo <span className="text-primary">Club</span></h2>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Nome del Club</label>
                                    <input
                                        type="text"
                                        placeholder="E.g. I Leggendari"
                                        value={newClanName}
                                        onChange={(e) => setNewClanName(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Tag del Club (3-4 Lettere)</label>
                                    <input
                                        type="text"
                                        placeholder="E.g. LEG"
                                        maxLength={4}
                                        value={newClanTag}
                                        onChange={(e) => setNewClanTag(e.target.value.toUpperCase())}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all uppercase"
                                    />
                                </div>

                                <div className="pt-4 flex gap-4">
                                    <Button
                                        onClick={() => setShowCreateModal(false)}
                                        variant="ghost"
                                        className="flex-1 rounded-2xl h-14 uppercase font-black tracking-widest text-xs hover:bg-white/5"
                                    >
                                        Annulla
                                    </Button>
                                    <Button
                                        onClick={handleCreateClan}
                                        className="flex-1 rounded-2xl h-14 uppercase font-black tracking-widest text-xs bg-primary hover:bg-primary/90"
                                    >
                                        Crea Ora
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
