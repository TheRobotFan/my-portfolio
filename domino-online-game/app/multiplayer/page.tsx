"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  ArrowLeft,
  Users,
  Plus,
  Lock,
  Unlock,
  Play,
  Crown,
  Copy,
  Check,
  RefreshCw,
  Clock,
  Gamepad2,
  Zap,
  LogOut,
  Swords,
  Trophy,
  Search,
  ChevronRight
} from "lucide-react"
import {
  useGameStore,
  type Room,
} from "@/lib/game-store"

// Simulated online rooms
const SIMULATED_ROOMS: Room[] = [
  {
    id: "room-1",
    name: "Partita Veloce",
    host: "Mario92",
    players: [
      { id: "mario", name: "Mario92", avatar: "default", ready: true },
    ],
    maxPlayers: 2,
    isPrivate: false,
    status: "waiting",
    mode: "casual",
    settings: { turnTimer: 30, rounds: 1, allowPowerUps: false },
    createdAt: new Date().toISOString(),
  },
  {
    id: "room-2",
    name: "Sfida Pro",
    host: "GiocatorePro",
    players: [
      { id: "pro", name: "GiocatorePro", avatar: "ninja", ready: true },
    ],
    maxPlayers: 2,
    isPrivate: false,
    status: "waiting",
    mode: "casual",
    settings: { turnTimer: 15, rounds: 3, allowPowerUps: true },
    createdAt: new Date().toISOString(),
  },
  {
    id: "room-3",
    name: "Stanza Amici",
    host: "Luigi88",
    players: [
      { id: "luigi", name: "Luigi88", avatar: "wizard", ready: false },
    ],
    maxPlayers: 2,
    isPrivate: true,
    status: "waiting",
    mode: "private",
    settings: { turnTimer: 60, rounds: 1, allowPowerUps: false },
    createdAt: new Date().toISOString(),
  },
]

export default function MultiplayerPage() {
  const router = useRouter()
  const { user, createRoom, leaveRoom, rooms, matchmaking, startMatchmaking, cancelMatchmaking, simulateMatchFound, activeEvents, fetchEvents } = useGameStore()
  const [activeTab, setActiveTab] = useState("matchmaking")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showJoinPrivateDialog, setShowJoinPrivateDialog] = useState(false)
  const [selectedPrivateRoom, setSelectedPrivateRoom] = useState<string | null>(null)
  const [password, setPassword] = useState("")
  const [newRoomName, setNewRoomName] = useState("")
  const [newRoomPrivate, setNewRoomPrivate] = useState(false)
  const [newRoomPassword, setNewRoomPassword] = useState("")
  const [copiedCode, setCopiedCode] = useState(false)
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null)
  const [allRooms, setAllRooms] = useState<Room[]>([])
  const [searchTime, setSearchTime] = useState(0)

  useEffect(() => {
    setAllRooms([...SIMULATED_ROOMS, ...rooms])
  }, [rooms])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  // Matchmaking timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (matchmaking.isSearching) {
      interval = setInterval(() => {
        setSearchTime((prev) => prev + 1)
      }, 1000)

      const matchTimeout = setTimeout(() => {
        simulateMatchFound()
      }, Math.random() * 5000 + 3000)

      return () => {
        if (interval) clearInterval(interval)
        clearTimeout(matchTimeout)
      }
    } else {
      setSearchTime(0)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [matchmaking.isSearching, simulateMatchFound])

  // Handle match found
  useEffect(() => {
    if (matchmaking.foundMatch) {
      const timeout = setTimeout(() => {
        router.push("/game?mode=multiplayer")
      }, 2000)
      return () => clearTimeout(timeout)
    }
  }, [matchmaking.foundMatch, router])

  const handleStartSearch = (mode: 'ranked' | 'casual') => {
    if (mode === 'ranked') {
      router.push('/ranked')
      return
    }
    startMatchmaking(mode)
  }

  const handleCreateRoom = () => {
    if (!newRoomName.trim()) return
    const room = createRoom(
      newRoomName,
      newRoomPrivate,
      newRoomPrivate ? newRoomPassword : undefined
    )
    setCurrentRoom(room)
    setShowCreateDialog(false)
  }

  const handleJoinRoom = (room: Room) => {
    if (room.isPrivate) {
      setSelectedPrivateRoom(room.id)
      setShowJoinPrivateDialog(true)
      return
    }
    setCurrentRoom({
      ...room,
      players: [
        ...room.players,
        { id: user?.id || "guest", name: user?.username || "Ospite", avatar: user?.inventory.equippedAvatar || "default", ready: false },
      ],
    })
  }

  const handleToggleReady = () => {
    if (!currentRoom || !user) return
    setCurrentRoom((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        players: prev.players.map((p) =>
          p.id === user.id ? { ...p, ready: !p.ready } : p
        ),
      }
    })
  }

  return (
    <div className="min-h-screen bg-game-table">
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Button asChild variant="ghost" className="rounded-full bg-black/30 text-foreground backdrop-blur-sm">
            <Link href="/">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Menu
            </Link>
          </Button>
          <h1 className="font-black italic uppercase tracking-widest text-xl">Lobby Multigiocatore</h1>
          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
            <Users className="w-5 h-5 text-blue-400" />
          </div>
        </div>
      </header>

      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <AnimatePresence mode="wait">
            {currentRoom ? (
              <motion.div key="lobby" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                {/* Room UI from original implementation but styled better */}
                <Card className="max-w-xl mx-auto bg-black/40 backdrop-blur-xl border-white/10">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>{currentRoom.name}</span>
                      <Badge variant="outline">{currentRoom.isPrivate ? "Privata" : "Pubblica"}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      {/* Players list from original implementation */}
                      {[0, 1].map((idx) => {
                        const player = currentRoom.players[idx]
                        return (
                          <div key={idx} className={`aspect-square rounded-3xl border-2 flex flex-col items-center justify-center p-4 transition-all ${player ? (player.ready ? "border-green-500 bg-green-500/10 shadow-[0_0_20px_rgba(34,197,94,0.2)]" : "border-white/10 bg-white/5") : "border-dashed border-white/5 bg-transparent"}`}>
                            {player ? (
                              <>
                                <div className="text-5xl mb-4">{player.avatar === 'default' ? '👤' : '🥷'}</div>
                                <div className="font-bold uppercase tracking-tighter truncate w-full text-center">{player.name}</div>
                                <div className={`text-[10px] font-black uppercase mt-2 ${player.ready ? "text-green-400" : "text-muted-foreground animate-pulse"}`}>
                                  {player.ready ? "Pronto" : "In attesa..."}
                                </div>
                              </>
                            ) : (
                              <div className="text-white/10 flex flex-col items-center">
                                <Plus className="w-8 h-8 mb-2" />
                                <span className="text-xs font-bold uppercase tracking-widest">In attesa</span>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>

                    <div className="flex gap-4">
                      <Button variant="ghost" className="flex-1 rounded-xl" onClick={() => setCurrentRoom(null)}>Esci</Button>
                      <Button className={`flex-1 rounded-xl h-12 text-lg font-black italic uppercase transition-all ${currentRoom.players.find(p => p.id === user?.id)?.ready ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"}`} onClick={handleToggleReady}>
                        {currentRoom.players.find(p => p.id === user?.id)?.ready ? "Pronto!" : "Preparati"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : matchmaking.isSearching ? (
              <motion.div key="searching" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md mx-auto">
                <Card className="bg-black/40 backdrop-blur-xl border-blue-500/30 text-center p-12 overflow-hidden relative">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} className="w-32 h-32 mx-auto mb-8 rounded-full border-4 border-blue-500/10 border-t-blue-500 relative">
                    <div className="absolute inset-0 rounded-full border border-blue-400/20 blur-sm" />
                  </motion.div>
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-2">Ricerca Avversario</h3>
                  <div className="flex items-center justify-center gap-4 text-xs font-bold uppercase text-blue-400/80 mb-8">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {searchTime}s</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {matchmaking.playersInQueue} in coda</span>
                  </div>
                  <Button variant="destructive" className="rounded-full px-8" onClick={() => cancelMatchmaking()}>Annulla</Button>
                </Card>
              </motion.div>
            ) : matchmaking.foundMatch ? (
              <motion.div key="found" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md mx-auto">
                <Card className="bg-green-500/20 backdrop-blur-xl border-green-500/50 text-center p-12">
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.5, repeat: Infinity }} className="w-24 h-24 mx-auto mb-6 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.5)]">
                    <Swords className="w-12 h-12 text-black" />
                  </motion.div>
                  <h3 className="text-2xl font-black italic uppercase text-green-400">Match Trovato!</h3>
                  <p className="text-green-400/60 uppercase text-xs font-black mt-2">Inizio tra pochi secondi...</p>
                </Card>
              </motion.div>
            ) : (
              <motion.div key="browser" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                <Tabs defaultValue="matchmaking" className="w-full" onValueChange={setActiveTab}>
                  <div className="flex justify-center mb-8">
                    <TabsList className="bg-black/20 p-1 rounded-full h-12 border border-white/5">
                      <TabsTrigger value="matchmaking" className="rounded-full px-8 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all">Matchmaking</TabsTrigger>
                      <TabsTrigger value="rooms" className="rounded-full px-8 data-[state=active]:bg-purple-600 data-[state=active]:text-white transition-all">Stanze</TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="matchmaking" className="space-y-6">
                    {/* Live Ops LTM / Flash Banner */}
                    {activeEvents.length > 0 && (
                      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex gap-2 mb-2 overflow-x-auto pb-2 scrollbar-hide">
                        {activeEvents.map(event => (
                          <Badge key={event.id} className={`flex items-center gap-1.5 px-3 py-1.5 border-0 ${event.type === 'flash_event' ? 'bg-purple-600/80' : 'bg-blue-600/80'
                            }`}>
                            <Zap className="w-3 h-3 fill-white" />
                            <span className="text-[10px] font-black uppercase tracking-widest">{event.name}</span>
                          </Badge>
                        ))}
                      </motion.div>
                    )}
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Casual Match */}
                      <motion.div whileHover={{ y: -5 }} className="group">
                        <Card className="bg-gradient-to-br from-blue-600/20 to-blue-900/40 border-blue-500/20 hover:border-blue-500/50 transition-all cursor-pointer overflow-hidden h-full" onClick={() => handleStartSearch('casual')}>
                          <CardContent className="p-8 relative">
                            <Zap className="w-16 h-16 text-blue-400 absolute -right-4 -top-4 rotate-12 opacity-20 group-hover:scale-125 transition-transform" />
                            <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-2">Partita Veloce</h3>
                            <p className="text-blue-200/60 text-sm mb-8">Nessuna pressione, solo divertimento. Trova un avversario istantaneamente.</p>
                            <Button className="w-full bg-blue-600 hover:bg-blue-500 rounded-xl font-bold uppercase italic">Gioca Ora</Button>
                          </CardContent>
                        </Card>
                      </motion.div>

                      {/* Ranked Match */}
                      <motion.div whileHover={{ y: -5 }} className="group">
                        <Card className="bg-gradient-to-br from-amber-600/20 to-amber-900/40 border-amber-500/20 hover:border-amber-500/50 transition-all cursor-pointer overflow-hidden h-full" onClick={() => handleStartSearch('ranked')}>
                          <CardContent className="p-8 relative">
                            <Trophy className="w-16 h-16 text-amber-400 absolute -right-4 -top-4 rotate-12 opacity-20 group-hover:scale-125 transition-transform" />
                            <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-2">Classificate</h3>
                            <p className="text-amber-200/60 text-sm mb-8">Scala la vetta, ottieni ricompense esclusive e diventa una leggenda.</p>
                            <Button className="w-full bg-amber-600 hover:bg-amber-500 rounded-xl font-bold uppercase italic">Inizia la Scalata</Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </div>
                  </TabsContent>

                  <TabsContent value="rooms" className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                      <Button className="bg-purple-600 hover:bg-purple-500 rounded-xl h-12 px-8 flex-1 md:flex-none uppercase font-black italic" onClick={() => setShowCreateDialog(true)}>
                        <Plus className="w-5 h-5 mr-2" /> Crea Stanza
                      </Button>
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="Cerca ID stanza..." className="h-12 pl-10 rounded-xl bg-black/20 border-white/5 focus:border-purple-500/50 transition-all" />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {allRooms.map((room, idx) => (
                        <motion.div key={room.id} custom={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                          <Card className="bg-black/40 border-white/5 hover:border-purple-500/20 transition-all group overflow-hidden">
                            <div className={`h-1 w-full ${room.isPrivate ? "bg-purple-500/40" : "bg-green-500/40"}`} />
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-4">
                                <div className="truncate pr-2">
                                  <h4 className="font-bold uppercase tracking-tight truncate">{room.name}</h4>
                                  <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{room.host}</p>
                                </div>
                                {room.isPrivate && <Lock className="w-3 h-3 text-purple-400 shrink-0" />}
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                                  <Users className="w-3.5 h-3.5" /> {room.players.length}/{room.maxPlayers}
                                </span>
                                <Button size="sm" variant="ghost" className="h-8 rounded-lg group-hover:bg-purple-600 transition-all" onClick={() => handleJoinRoom(room)}>Entra <ChevronRight className="w-3 h-3 ml-1" /></Button>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="bg-zinc-950 border-white/10">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black uppercase italic italic tracking-tighter">Nuova Stanza</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label className="uppercase text-[10px] font-black tracking-widest text-muted-foreground">Nome Identificativo</Label>
              <Input placeholder="Stanza di Gioco" value={newRoomName} onChange={(e) => setNewRoomName(e.target.value)} className="bg-black border-white/10" />
            </div>
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
              <div>
                <Label className="font-bold">Privata</Label>
                <p className="text-xs text-muted-foreground">Accesso solo tramite password</p>
              </div>
              <Switch checked={newRoomPrivate} onCheckedChange={setNewRoomPrivate} />
            </div>
            {newRoomPrivate && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2">
                <Label>Password</Label>
                <Input type="password" value={newRoomPassword} onChange={(e) => setNewRoomPassword(e.target.value)} className="bg-black border-white/10" />
              </motion.div>
            )}
            <Button className="w-full h-12 bg-purple-600 hover:bg-purple-700 font-black uppercase italic tracking-widest" onClick={handleCreateRoom}>Crea Ora</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
