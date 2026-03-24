"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useGameStore } from "@/lib/game-store"
import { RotateCw, Maximize2 } from "lucide-react"

interface OrientationSelectorProps {
  options?: ('horizontal' | 'vertical')[]
  onSelect?: (orientation: 'horizontal' | 'vertical') => void
  onCancel?: () => void
}

export function OrientationSelector({ options, onSelect, onCancel }: OrientationSelectorProps) {
  const { game, setPendingTileOrientation, clearPendingTile } = useGameStore()

  // Use passed props or fallback to global state
  const orientationOptions = options || game?.pendingTile?.orientationOptions || []

  const handleOrientationSelect = (orientation: 'horizontal' | 'vertical') => {
    console.log("Orientation selecting:", orientation)
    if (onSelect) {
      onSelect(orientation)
    } else {
      setPendingTileOrientation(orientation)
    }
  }

  const handleCancel = () => {
    console.log("Orientation selection cancelled")
    if (onCancel) {
      onCancel()
    } else {
      clearPendingTile()
    }
  }

  if (!options && !game?.pendingTile) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -20 }}
        className="bg-card/95 backdrop-blur-md border border-border rounded-2xl p-6 shadow-2xl w-full max-w-[280px]"
      >
        <div className="space-y-4">
          <div className="text-base font-bold text-foreground text-center pb-3 border-b border-white/10 flex items-center justify-center gap-2">
            <Maximize2 className="w-5 h-5 text-primary" />
            Scegli Orientamento
          </div>

          <div className="grid gap-3 pt-2">
            {orientationOptions.includes('horizontal') && (
              <Button
                onClick={() => handleOrientationSelect('horizontal')}
                className="w-full flex items-center justify-center gap-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 h-12 rounded-xl text-base font-medium transition-all"
                variant="outline"
              >
                <div className="w-8 h-4 border-2 border-current rounded-sm mr-1" />
                Orizzontale
              </Button>
            )}

            {orientationOptions.includes('vertical') && (
              <Button
                onClick={() => handleOrientationSelect('vertical')}
                className="w-full flex items-center justify-center gap-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 h-12 rounded-xl text-base font-medium transition-all"
                variant="outline"
              >
                <div className="w-4 h-8 border-2 border-current rounded-sm mr-1" />
                Verticale
              </Button>
            )}
          </div>

          <Button
            onClick={handleCancel}
            variant="ghost"
            className="w-full text-muted-foreground hover:text-foreground hover:bg-white/5 h-10 rounded-lg mt-2"
          >
            Annulla
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
