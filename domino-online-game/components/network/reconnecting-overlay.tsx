"use client"

import { motion, AnimatePresence } from "framer-motion"
import { RefreshCw, WifiOff } from "lucide-react"
import { useGameStore } from "@/lib/game-store"

export function ReconnectingOverlay() {
    const isReconnecting = useGameStore((state) => state.isReconnecting)
    const isSessionLost = useGameStore((state) => state.isSessionLost)
    const retryConnection = useGameStore((state) => state.retryConnection)

    return (
        <AnimatePresence>
            {(isReconnecting || isSessionLost) && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md"
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        className="bg-zinc-900/90 border border-white/10 p-8 rounded-[32px] shadow-2xl text-center max-w-sm mx-4"
                    >
                        {isSessionLost ? (
                            <>
                                <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-red-500/20 rounded-full">
                                    <WifiOff className="w-8 h-8 text-red-500" />
                                </div>
                                <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-2 text-red-500">Sessione Scaduta</h2>
                                <p className="text-muted-foreground text-sm font-medium mb-6">
                                    La riconnessione automatica è fallita. La tua partita potrebbe essere stata dichiarata forfeit.
                                </p>
                                <button
                                    onClick={retryConnection}
                                    className="w-full py-4 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(255,255,255,0.1)]"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    Riprova Connessione
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="relative w-20 h-20 mx-auto mb-6">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                        className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <RefreshCw className="w-8 h-8 text-primary/60" />
                                    </div>
                                </div>

                                <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-2">Riconnessione...</h2>
                                <p className="text-muted-foreground text-sm font-medium mb-6">
                                    Segnale debole o assente. Tentativo di ripristino in corso...
                                </p>

                                <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary animate-pulse">
                                    <RefreshCw className="w-3 h-3 animate-spin" />
                                    Handshake in corso
                                </div>
                            </>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
