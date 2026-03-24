"use client"

import { useState } from "react"
import { motion, AnimatePresence, useDragControls } from "framer-motion"
import { DominoTile } from "./domino-tile"
import { cn } from "@/lib/utils"
import type { DominoTile as TileType } from "@/lib/game-store"
import { getValidMoves } from "@/lib/game-store"

interface PlayerHandProps {
  tiles: TileType[]
  boardEnds: { left: number; right: number }
  isCurrentTurn: boolean
  onTileSelect: (tile: TileType) => void
  onTileDrag?: (tile: TileType, end: 'left' | 'right') => void
  selectedTile: TileType | null
  tileTheme?: string
  className?: string
}

export function PlayerHand({
  tiles,
  boardEnds,
  isCurrentTurn,
  onTileSelect,
  onTileDrag,
  selectedTile,
  tileTheme,
  className,
}: PlayerHandProps) {
  const validMoves = isCurrentTurn ? getValidMoves(tiles, boardEnds) : []
  const validTileIds = new Set(validMoves.map((m) => m.tile.id))

  return (
    <div className={cn("relative", className)}>
      {/* Turn indicator */}
      {isCurrentTurn && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium"
        >
          Il tuo turno
        </motion.div>
      )}

      {/* Hand container */}
      <div className="flex items-center justify-center gap-2 flex-wrap px-8 py-6 bg-card/50 backdrop-blur rounded-2xl border border-border overflow-visible">
        <AnimatePresence mode="popLayout">
          {tiles.map((tile, index) => {
            const isValid = validTileIds.has(tile.id)
            const isSelected = selectedTile?.id === tile.id

            return (
              <motion.div
                key={tile.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: 1,
                  opacity: 1,
                }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{
                  duration: 0.1, // Very fast animation for mobile
                  delay: index * 0.01, // Minimal delay
                }}
                layout={false} // Disable layout animation on mobile
                drag={isCurrentTurn && isValid ? true : false}
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={0} // No elastic for better mobile performance
                onDragEnd={(event, info) => {
                  if (!isCurrentTurn || !isValid || !onTileDrag) return

                  // Determine drop zone based on drag direction
                  const dragDirection = info.offset.x > 0 ? 'right' : 'left'
                  onTileDrag(tile, dragDirection)
                }}
                whileDrag={{ scale: 1.05, zIndex: 50, cursor: "grabbing" }}
              >
                <DominoTile
                  left={tile.left}
                  right={tile.right}
                  size="md"
                  theme={tileTheme || "classic"}
                  isSelected={isSelected}
                  isValid={isCurrentTurn && isValid && !isSelected}
                  isDragging={false}
                  onClick={isCurrentTurn && isValid ? () => onTileSelect(tile) : undefined}
                  className={cn(
                    "relative cursor-pointer transition-all duration-200",
                    !isCurrentTurn && "opacity-50 grayscale brightness-75",
                    isCurrentTurn && !isValid && "opacity-30 grayscale brightness-50 cursor-not-allowed border-2 border-red-500",
                    isCurrentTurn && isValid && "brightness-110 cursor: grab",
                    isSelected && "scale-110 -translate-y-2 z-10"
                  )}
                />
              </motion.div>
            )
          })}
        </AnimatePresence>

        {tiles.length === 0 && (
          <div className="text-muted-foreground py-8">Nessuna tessera</div>
        )}
      </div>
    </div>
  )
}

interface OpponentHandProps {
  tileCount: number
  playerName: string
  isCurrentTurn: boolean
  className?: string
}

export function OpponentHand({
  tileCount,
  playerName,
  isCurrentTurn,
  className,
}: OpponentHandProps) {
  return (
    <div className={cn("relative", className)}>
      {/* Player info */}
      <div className="flex items-center justify-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
          <span className="text-xs font-bold text-primary">AI</span>
        </div>
        <span className="font-medium text-foreground">{playerName}</span>
        <span className="text-sm text-muted-foreground">({tileCount} tessere)</span>
      </div>

      {/* Turn indicator */}
      {isCurrentTurn && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-sm text-accent font-medium"
        >
          Sta pensando...
        </motion.div>
      )}

      {/* Hidden tiles */}
      <div className="flex items-center justify-center gap-1">
        {Array.from({ length: Math.min(tileCount, 7) }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.05 }}
          >
            <DominoTile
              left={0}
              right={0}
              size="sm"
              theme="classic"
              isHidden
            />
          </motion.div>
        ))}
        {tileCount > 7 && (
          <div className="text-muted-foreground text-sm ml-2">+{tileCount - 7}</div>
        )}
      </div>
    </div>
  )
}
