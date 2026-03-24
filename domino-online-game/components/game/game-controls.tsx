"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import {
  Pause,
  Play,
  RotateCcw,
  Settings,
  Home,
  Volume2,
  VolumeX,
} from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface GameControlsProps {
  isPaused: boolean
  soundEnabled: boolean
  deckCount: number
  canDraw: boolean
  onPause: () => void
  onResume: () => void
  onRestart: () => void
  onSettings: () => void
  onHome: () => void
  onToggleSound: () => void
  onDraw: () => void
  className?: string
}

export function GameControls({
  isPaused,
  soundEnabled,
  deckCount,
  canDraw,
  onPause,
  onResume,
  onRestart,
  onSettings,
  onHome,
  onToggleSound,
  onDraw,
  className,
}: GameControlsProps) {
  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      {/* Left controls */}
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="icon"
          onClick={onHome}
          className="rounded-full"
        >
          <Home className="w-4 h-4" />
        </Button>
        
        <Button
          variant="secondary"
          size="icon"
          onClick={isPaused ? onResume : onPause}
          className="rounded-full"
        >
          {isPaused ? (
            <Play className="w-4 h-4" />
          ) : (
            <Pause className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Center - Draw pile */}
      <motion.div
        whileHover={canDraw ? { scale: 1.05 } : undefined}
        whileTap={canDraw ? { scale: 0.95 } : undefined}
        className="flex flex-col items-center"
      >
        <Button
          variant="outline"
          onClick={onDraw}
          disabled={!canDraw || deckCount === 0}
          className="h-auto py-3 px-6 rounded-xl bg-transparent"
        >
          <div className="flex flex-col items-center gap-1">
            <div className="relative">
              {/* Stacked cards visual */}
              <div className="w-8 h-12 rounded bg-primary/20 absolute -top-1 -left-1" />
              <div className="w-8 h-12 rounded bg-primary/40 absolute -top-0.5 -left-0.5" />
              <div className="w-8 h-12 rounded bg-primary relative flex items-center justify-center">
                <span className="text-primary-foreground text-xs font-bold">{deckCount}</span>
              </div>
            </div>
            <span className="text-xs text-muted-foreground mt-1">Pesca</span>
          </div>
        </Button>
      </motion.div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="icon"
          onClick={onToggleSound}
          className="rounded-full"
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4" />
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
        </Button>
        
        <Button
          variant="secondary"
          size="icon"
          onClick={onRestart}
          className="rounded-full"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
        
        <Button
          variant="secondary"
          size="icon"
          onClick={onSettings}
          className="rounded-full"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

interface EndSelectionProps {
  boardEnds: { left: number; right: number }
  selectedTile: any
  onSelectEnd: (end: 'left' | 'right') => void
  onCancel: () => void
}

export function EndSelection({ boardEnds, selectedTile, onSelectEnd, onCancel }: EndSelectionProps) {
  // Calcola le mosse valide per la tessera selezionata
  const canPlayLeft = selectedTile && (
    boardEnds.left === -1 || // Board vuota
    selectedTile.left === boardEnds.left || 
    selectedTile.right === boardEnds.left
  )
  
  const canPlayRight = selectedTile && (
    boardEnds.right === -1 || // Board vuota
    selectedTile.left === boardEnds.right || 
    selectedTile.right === boardEnds.right
  )

  // Se c'è solo una opzione, eseguila automaticamente dopo il render
  React.useEffect(() => {
    if (canPlayLeft && !canPlayRight) {
      const timer = setTimeout(() => onSelectEnd('left'), 0)
      return () => clearTimeout(timer)
    }
    if (canPlayRight && !canPlayLeft) {
      const timer = setTimeout(() => onSelectEnd('right'), 0)
      return () => clearTimeout(timer)
    }
  }, [canPlayLeft, canPlayRight, onSelectEnd])

  // Se c'è solo una opzione, non mostrare nulla
  if ((canPlayLeft && !canPlayRight) || (canPlayRight && !canPlayLeft)) {
    return null
  }

  // Se entrambi i lati sono validi, mostra il menu semplice
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={onCancel}
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="bg-card border border-border rounded-2xl p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-center mb-4 text-foreground">
          Dove vuoi giocare?
        </h3>
        <div className="flex gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={() => onSelectEnd('left')}
            className="flex flex-col gap-2 h-auto py-4 px-6"
          >
            <span className="text-sm text-muted-foreground">Sinistra</span>
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => onSelectEnd('right')}
            className="flex flex-col gap-2 h-auto py-4 px-6"
          >
            <span className="text-sm text-muted-foreground">Destra</span>
          </Button>
        </div>
        <Button
          variant="ghost"
          className="w-full mt-4"
          onClick={onCancel}
        >
          Annulla
        </Button>
      </motion.div>
    </motion.div>
  )
}
