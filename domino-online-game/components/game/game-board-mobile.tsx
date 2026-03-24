"use client"

import { useRef, useEffect } from "react"
import { DominoTile } from "./domino-tile"
import { cn } from "@/lib/utils"

interface GameBoardProps {
  board: any[]
  boardEnds: { left: number; right: number }
  className?: string
  validMoves?: Array<{ end: 'left' | 'right'; isValid: boolean }>
  currentHand?: any[]
}

export function GameBoardMobile({
  board,
  boardEnds,
  className,
  validMoves = [],
  currentHand = []
}: GameBoardProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to center
  useEffect(() => {
    if (scrollRef.current) {
      const { scrollWidth, clientWidth } = scrollRef.current
      scrollRef.current.scrollTo({
        left: (scrollWidth - clientWidth) / 2,
        behavior: "smooth",
      })
    }
  }, [board.length])

  return (
    <div
      className={cn(
        "relative w-full h-full min-h-[300px] bg-[url('/images/wood-texture.jpg')] bg-cover rounded-xl overflow-hidden border-2 border-amber-900/30",
        className
      )}
    >
      {/* Board tiles container */}
      <div
        ref={scrollRef}
        className="absolute inset-0 flex items-center justify-center px-4 py-8 overflow-x-auto overflow-y-hidden"
      >
        <div className="flex items-center gap-1">
          {board.length === 0 ? (
            // Empty board placeholder
            <div className="flex items-center justify-center w-full h-full">
              <div className="text-center">
                <div className="w-12 h-8 border-2 border-amber-700/30 rounded mx-auto mb-2" />
                <p className="text-amber-700/50 text-xs">Posiziona la prima tessera</p>
              </div>
            </div>
          ) : (
            board.map((tile, index) => (
              <div key={tile.id} className="relative">
                <DominoTile
                  left={tile.left}
                  right={tile.right}
                  size="sm"
                  theme="classic"
                  orientation="vertical"
                  className="transform scale-90"
                />
                {/* Connection line */}
                {index < board.length - 1 && (
                  <div className="absolute top-1/2 -translate-y-1/2 left-full w-4 h-0.5 bg-amber-800/50" />
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Valid move indicators - simplified */}
      {validMoves.find(m => m.end === 'left')?.isValid && board.length > 0 && (
        <div className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 bg-green-500/20 border border-green-400 rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-green-400 rounded-full" />
        </div>
      )}
      
      {validMoves.find(m => m.end === 'right')?.isValid && board.length > 0 && (
        <div className="absolute right-8 top-1/2 -translate-y-1/2 w-6 h-6 bg-green-500/20 border border-green-400 rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-green-400 rounded-full" />
        </div>
      )}

      {/* Board ends indicators */}
      {board.length > 0 && (
        <>
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-amber-400 bg-black/50 px-2 py-1 rounded">
            {boardEnds.left}
          </div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-amber-400 bg-black/50 px-2 py-1 rounded">
            {boardEnds.right}
          </div>
        </>
      )}
    </div>
  )
}
