"use client"

import { DominoTile } from "./domino-tile"
import { cn } from "@/lib/utils"

interface PlayerHandProps {
  tiles: any[]
  boardEnds: { left: number; right: number }
  isCurrentTurn: boolean
  onTileSelect: (tile: any) => void
  selectedTile: any | null
  className?: string
}

export function PlayerHandMobile({
  tiles,
  boardEnds,
  isCurrentTurn,
  onTileSelect,
  selectedTile,
  className,
}: PlayerHandProps) {
  // Simple valid move check
  const isValidMove = (tile: any) => {
    if (!isCurrentTurn) return false
    if (boardEnds.left === -1 && boardEnds.right === -1) return true // First move

    return (
      tile.left === boardEnds.left ||
      tile.right === boardEnds.left ||
      tile.left === boardEnds.right ||
      tile.right === boardEnds.right
    )
  }

  return (
    <div className={cn("flex items-center justify-center gap-2 flex-wrap px-6 py-4 bg-card/50 backdrop-blur rounded-xl border border-border overflow-visible", className)}>
      {tiles.map((tile, index) => {
        const isValid = isValidMove(tile)
        const isSelected = selectedTile?.id === tile.id

        // Debug log
        console.log(`Tile ${tile.id} (${tile.left}-${tile.right}): valid=${isValid}, selected=${isSelected}, turn=${isCurrentTurn}`)

        return (
          <div
            key={tile.id}
            className={cn(
              "relative transition-all duration-200",
              !isCurrentTurn && "opacity-50 grayscale",
              isCurrentTurn && !isValid && "opacity-30 grayscale",
              isCurrentTurn && isValid && "brightness-110 cursor-pointer hover:scale-105",
              isSelected && "scale-110 -translate-y-2 z-10"
            )}
            onClick={(e) => {
              e.stopPropagation()
              console.log(`Clicked tile ${tile.id}, isValid=${isValid}, isCurrentTurn=${isCurrentTurn}`)
              if (isCurrentTurn && isValid) {
                onTileSelect(tile)
              }
            }}
          >
            <DominoTile
              left={tile.left}
              right={tile.right}
              size="sm"
              theme="classic"
              isSelected={isSelected}
              isValid={isCurrentTurn && isValid && !isSelected}
              isDragging={false}
            />
          </div>
        )
      })}
    </div>
  )
}

export function OpponentHandMobile({
  tileCount,
  playerName,
  isCurrentTurn,
}: {
  tileCount: number
  playerName: string
  isCurrentTurn: boolean
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-sm font-medium text-foreground/80">
        {playerName}
        {isCurrentTurn && (
          <span className="ml-2 text-xs text-green-400">• Sta giocando...</span>
        )}
      </div>
      <div className="flex gap-1">
        {Array.from({ length: Math.min(tileCount, 7) }).map((_, index) => (
          <div
            key={index}
            className="w-8 h-12 bg-gradient-to-br from-gray-700 to-gray-800 rounded border border-gray-600 shadow-md"
          />
        ))}
        {tileCount > 7 && (
          <div className="w-8 h-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded border border-gray-700 shadow-md flex items-center justify-center">
            <span className="text-xs text-gray-400">+{tileCount - 7}</span>
          </div>
        )}
      </div>
    </div>
  )
}
