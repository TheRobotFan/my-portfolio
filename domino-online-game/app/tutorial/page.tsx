"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import {
    Trophy,
    ArrowRight,
    HelpCircle,
    Gamepad2,
    Sparkles,
    CheckCircle2,
    AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useGameStore } from "@/lib/game-store"

// --- TUTORIAL CONSTANTS ---

const TUTORIAL_STEPS = [
    {
        id: "welcome",
        title: "Benvenuto su Dominion!",
        content: "Questa guida ti insegnerà le basi per diventare un campione di Domino. Il gioco è semplice: devi finire le tue tessere prima dell'avversario.",
        action: "Inizia",
    },
    {
        id: "match-numbers",
        title: "Abbina i Numeri",
        content: "Per giocare una tessera, uno dei suoi numeri deve corrispondere a uno degli estremi sul tavolo. Iniziamo con un classico!",
        highlight: "hand",
        instruction: "Seleziona il Doppio Sei (6-6) dalla tua mano.",
    },
    {
        id: "play-first",
        title: "La Prima Giocata",
        content: "Ottimo! Poiché il tavolo è vuoto, puoi giocare qualsiasi tessera. Il Doppio Sei è un ottimo inizio.",
        highlight: "board",
        instruction: "Trascina o clicca sul tavolo per posizionare la tessera.",
    },
    {
        id: "opponent-move",
        title: "Turno Avversario",
        content: "L'avversario ha risposto con un 6-4. Ora il tavolo ha due estremi: un 6 (a sinistra) e un 4 (a destra).",
        highlight: "board",
        instruction: "Osserva la mossa dell'IA.",
    },
    {
        id: "draw-tile",
        title: "Pescare una Tessera",
        content: "Non hai tessere che corrispondono a un 6 o a un 4? Nessun problema, puoi pescare dal mazzo!",
        highlight: "deck",
        instruction: "Clicca sul mazzo per pescare una nuova tessera.",
    },
    {
        id: "victory",
        title: "Vittoria!",
        content: "Hai imparato le basi! Finire le tessere ti regala il titolo di vincitore e XP preziosi.",
        action: "Completa Tutorial",
    },
]

// --- TUTORIAL PAGE COMPONENT ---

export default function TutorialPage() {
    const router = useRouter()
    const { user, addCoins } = useGameStore()
    const [currentStep, setCurrentStep] = useState(0)
    const [isCompleted, setIsCompleted] = useState(false)
    const [mockBoard, setMockBoard] = useState<any[]>([])
    const [mockHand, setMockHand] = useState([
        { id: "t1", left: 6, right: 6, isDouble: true },
        { id: "t2", left: 5, right: 4, isDouble: false },
        { id: "t3", left: 3, right: 2, isDouble: false },
    ])
    const [mockBoardEnds, setMockBoardEnds] = useState({ left: -1, right: -1 })

    const step = TUTORIAL_STEPS[currentStep]

    const handleNext = () => {
        if (currentStep < TUTORIAL_STEPS.length - 1) {
            setCurrentStep(currentStep + 1)
        } else {
            handleComplete()
        }
    }

    const handleComplete = () => {
        setIsCompleted(true)
        addCoins(500) // Reward for tutorial
        // In a real app, we'd also mark tutorial as completed in user profile
    }

    // Effect to simulate steps
    useEffect(() => {
        if (step.id === "opponent-move") {
            setTimeout(() => {
                setMockBoard([
                    { tile: { left: 6, right: 4 }, side: "right", position: 1 },
                    { tile: { left: 6, right: 6 }, side: "center", position: 0 },
                ])
                setMockBoardEnds({ left: 6, right: 4 })
                setTimeout(() => handleNext(), 2000)
            }, 1000)
        }
    }, [currentStep])

    const renderTile = (tile: any, isSelected = false, onClick?: () => void) => (
        <motion.div
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={`relative w-16 h-28 rounded-lg border-2 flex flex-col cursor-pointer transition-all ${isSelected
                    ? "border-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.5)] bg-blue-500/20"
                    : "border-white/10 bg-black/40 backdrop-blur-md"
                }`}
        >
            <div className="flex-1 flex items-center justify-center border-b border-white/5 text-2xl font-bold">
                {tile.left}
            </div>
            <div className="flex-1 flex items-center justify-center text-2xl font-bold">
                {tile.right}
            </div>
        </motion.div>
    )

    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-4 overflow-hidden">
            {/* Background Glow */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]" />
            </div>

            <div className="w-full max-w-4xl z-10">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                            <Gamepad2 className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold uppercase tracking-wider">Tutorial</h1>
                            <p className="text-xs text-white/40">Impara le basi di Dominion</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right sr-only sm:not-sr-only">
                            <p className="text-xs text-white/40 uppercase">Progresso</p>
                            <p className="text-sm font-bold">{Math.round(((currentStep + 1) / TUTORIAL_STEPS.length) * 100)}%</p>
                        </div>
                        <div className="w-32 h-2 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${((currentStep + 1) / TUTORIAL_STEPS.length) * 100}%` }}
                                className="h-full bg-blue-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 content-start h-[600px]">
                    {/* Main Board Area */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <Card className="flex-1 bg-black/40 backdrop-blur-xl border-white/5 overflow-hidden relative p-8 flex items-center justify-center border-dashed border-2">
                            {mockBoard.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center"
                                >
                                    <div className={`w-32 h-32 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center mb-4 mx-auto ${step.highlight === 'board' ? 'border-blue-500 animate-pulse' : ''}`}>
                                        <Trophy className="w-12 h-12 text-white/20" />
                                    </div>
                                    <p className="text-white/40 text-sm">Il tavolo è vuoto. Inizia la partita!</p>
                                </motion.div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    {mockBoard.map((item, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="w-12 h-20 bg-white/90 text-black rounded-sm flex flex-col font-bold text-lg"
                                        >
                                            <div className="flex-1 flex items-center justify-center border-b border-black/10">{item.tile.left}</div>
                                            <div className="flex-1 flex items-center justify-center">{item.tile.right}</div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}

                            {/* Board Ends Indicator */}
                            {mockBoardEnds.left !== -1 && (
                                <div className="absolute inset-x-8 bottom-8 flex justify-between">
                                    <Badge variant="outline" className="bg-blue-500/10 border-blue-500/20">{mockBoardEnds.left}</Badge>
                                    <Badge variant="outline" className="bg-blue-500/10 border-blue-500/20">{mockBoardEnds.right}</Badge>
                                </div>
                            )}
                        </Card>

                        {/* Hand Area */}
                        <div className={`p-6 rounded-2xl bg-white/5 border border-white/10 transition-all ${step.highlight === 'hand' ? 'border-blue-500 bg-blue-500/5 shadow-[0_0_20px_rgba(59,130,246,0.1)]' : ''}`}>
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-xs uppercase tracking-widest text-white/60 font-bold">Le tue tessere</p>
                                <Badge className="bg-blue-600">3 Tessere</Badge>
                            </div>
                            <div className="flex gap-4 justify-center">
                                {mockHand.map(tile => (
                                    renderTile(tile, step.id === 'match-numbers' && tile.id === 't1', () => {
                                        if (step.id === 'match-numbers' && tile.id === 't1') {
                                            handleNext()
                                            setMockBoard([{ tile: { left: 6, right: 6 }, side: "center", position: 0 }])
                                            setMockBoardEnds({ left: 6, right: 6 })
                                            setMockHand(mockHand.filter(t => t.id !== 't1'))
                                        }
                                    })
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Tutorial Sidebar */}
                    <div className="flex flex-col gap-4">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                className="flex-1"
                            >
                                <Card className="h-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-2xl border-white/10 p-6 flex flex-col">
                                    <div className="flex items-center gap-2 mb-4 text-blue-400">
                                        <HelpCircle className="w-5 h-5" />
                                        <span className="text-xs font-bold uppercase tracking-wider">Passaggio {currentStep + 1}</span>
                                    </div>
                                    <h2 className="text-2xl font-bold mb-4">{step.title}</h2>
                                    <p className="text-white/70 leading-relaxed mb-8 flex-1">
                                        {step.content}
                                    </p>

                                    {step.instruction && (
                                        <motion.div
                                            initial={{ y: 10, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.3 }}
                                            className="p-4 rounded-xl bg-white/5 border border-white/10 mb-6 flex items-start gap-3"
                                        >
                                            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                                            <p className="text-sm font-medium text-amber-200/90">{step.instruction}</p>
                                        </motion.div>
                                    )}

                                    {step.action && (
                                        <Button
                                            onClick={handleNext}
                                            className="w-full h-12 bg-blue-600 hover:bg-blue-500 rounded-xl group"
                                        >
                                            {step.action}
                                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    )}
                                </Card>
                            </motion.div>
                        </AnimatePresence>

                        {/* Deck / Stats Card */}
                        <Card className={`p-4 bg-black/40 border-white/5 transition-all ${step.highlight === 'deck' ? 'border-amber-500 bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.1)]' : ''}`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                                        <Sparkles className="w-5 h-5 text-amber-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-white/40 uppercase">Mazzo</p>
                                        <p className="text-sm font-bold">14 Tessere</p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={`rounded-lg ${step.id === 'draw-tile' ? 'bg-amber-500 text-black hover:bg-amber-400' : ''}`}
                                    onClick={() => {
                                        if (step.id === 'draw-tile') {
                                            handleNext()
                                        }
                                    }}
                                >
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Completion Dialog */}
            <AnimatePresence>
                {isCompleted && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-3xl p-8 text-center shadow-2xl"
                        >
                            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="w-12 h-12 text-green-500" />
                            </div>
                            <h2 className="text-3xl font-bold mb-2">Tutorial Completato!</h2>
                            <p className="text-white/40 mb-8">Ottimo lavoro! Hai ricevuto una ricompensa per aver completato l'addestramento.</p>

                            <div className="flex items-center justify-center gap-4 mb-8">
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                    <p className="text-xs text-white/40 uppercase mb-1">Bonus Oro</p>
                                    <p className="text-xl font-bold text-amber-500">+500</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                    <p className="text-xs text-white/40 uppercase mb-1">Badge</p>
                                    <p className="text-xl font-bold text-blue-400">Pioniere</p>
                                </div>
                            </div>

                            <Button
                                onClick={() => router.push("/")}
                                className="w-full h-14 bg-white text-black hover:bg-zinc-200 rounded-2xl font-bold text-lg"
                            >
                                Inizia a Giocare
                            </Button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
