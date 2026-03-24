"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { GameBoardMobile } from "@/components/game/game-board-mobile"
import { PlayerHandMobile, OpponentHandMobile } from "@/components/game/player-hand-mobile"
import { EndSelection } from "@/components/game/game-controls"
import { OrientationSelector } from "@/components/game/orientation-selector"
import { useGameStore, getValidMoves, getAIMove, getAIDelay } from "@/lib/game-store"
import { useTheme } from "@/hooks/use-theme"
import type { DominoTile } from "@/lib/game-store"
import {
  Trophy,
  RotateCcw,
  Home,
  Volume2,
  VolumeX,
  Star,
  Flame
} from "lucide-react"

function GameContent() {
  // Applica il tema generale dell'applicazione
  useTheme()

  const searchParams = useSearchParams()
  const router = useRouter()
  const mode = searchParams.get("mode") as "single" | "multiplayer" | "private" || "single"
  const difficulty = searchParams.get("difficulty") as "easy" | "medium" | "hard" || "medium"
  const aiStyleParam = searchParams.get("style") as "aggressive" | "defensive" || "defensive"

  const game = useGameStore(s => s.game)
  const settings = useGameStore(s => s.settings)
  const user = useGameStore(s => s.user)

  const startGame = useGameStore(s => s.startGame)
  const playTile = useGameStore(s => s.playTile)
  const drawTile = useGameStore(s => s.drawTile)
  const nextTurn = useGameStore(s => s.nextTurn)
  const pauseGame = useGameStore(s => s.pauseGame)
  const resumeGame = useGameStore(s => s.resumeGame)
  const resetGame = useGameStore(s => s.resetGame)
  const toggleSound = useGameStore(s => s.toggleSound)

  const [selectedTile, setSelectedTile] = useState<DominoTile | null>(null)
  const [showEndSelection, setShowEndSelection] = useState(false)
  const [showGameOver, setShowGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [lastMoveTime, setLastMoveTime] = useState(Date.now())

  // Initialize game
  useEffect(() => {
    if (game.status === "idle") {
      startGame(mode, difficulty, aiStyleParam)
    }
  }, [game.status, mode, difficulty, aiStyleParam, startGame])

  // Handle game over
  useEffect(() => {
    if (game.status === "finished") {
      setTimeout(() => setShowGameOver(true), 500)
    }
  }, [game.status])

  // AI turn logic - simplified for mobile
  useEffect(() => {
    if (game.status !== "playing") return

    const currentPlayer = game.players[game.currentPlayerIndex]
    if (!currentPlayer?.isAI) return

    const timeout = setTimeout(() => {
      const aiMove = getAIMove()

      if (aiMove) {
        playTile(aiMove.tile.id, aiMove.end)
        nextTurn()
      } else {
        // AI has no valid moves, try to draw
        const tile = drawTile()
        if (!tile) {
          // No more tiles, pass turn
          nextTurn()
        } else {
          // Check if the drawn tile is playable
          const newValidMoves = getValidMoves(currentPlayer.hand, game.boardEnds)
          if (newValidMoves.length > 0) {
            // AI can play the drawn tile, try again
            const newAiMove = getAIMove()
            if (newAiMove) {
              playTile(newAiMove.tile.id, newAiMove.end)
              nextTurn()
            } else {
              // Still no valid move, pass turn
              nextTurn()
            }
          } else {
            // Drawn tile not playable, pass turn
            nextTurn()
          }
        }
      }
    }, getAIDelay(difficulty))

    return () => clearTimeout(timeout)
  }, [game.status, game.currentPlayerIndex, game.players, game.boardEnds, playTile, drawTile, nextTurn])

  const handleTilePlay = useCallback((tile: DominoTile, end: 'left' | 'right') => {
    // Check if it's human turn
    const currentPlayer = game.players[game.currentPlayerIndex]
    const isCurrentHumanTurn = currentPlayer && !currentPlayer.isAI

    if (!isCurrentHumanTurn) return

    // Check if move is valid
    const isBoardEmpty = game.board.length === 0
    let canPlay = false

    if (isBoardEmpty) {
      canPlay = true
    } else {
      const canPlayLeft = tile.left === game.boardEnds.left || tile.right === game.boardEnds.left
      const canPlayRight = tile.left === game.boardEnds.right || tile.right === game.boardEnds.right
      canPlay = (end === 'left' && canPlayLeft) || (end === 'right' && canPlayRight)
    }

    if (canPlay) {
      playTile(tile.id, end)

      // Simple scoring
      const tileValue = tile.left + tile.right
      setScore(prev => prev + tileValue * 10)
      setLastMoveTime(Date.now())
    }
  }, [game.players, game.currentPlayerIndex, game.board, game.boardEnds, playTile, nextTurn])

  const handleTileSelect = useCallback((tile: DominoTile) => {
    // Check if tile can only go in one direction
    const possibleMoves = getValidMoves([tile], game.boardEnds)

    if (possibleMoves.length === 1) {
      // Auto-place in the only available direction
      handleTilePlay(tile, possibleMoves[0].end)
    } else {
      // Show direction selection
      setSelectedTile(tile)
      setShowEndSelection(true)
    }
  }, [game.boardEnds, handleTilePlay])

  const handleEndSelect = useCallback((end: 'left' | 'right') => {
    if (selectedTile) {
      const isBoardEmpty = game.board.length === 0
      let canPlay = false

      if (isBoardEmpty) {
        canPlay = true
      } else {
        const canPlayLeft = selectedTile.left === game.boardEnds.left || selectedTile.right === game.boardEnds.left
        const canPlayRight = selectedTile.left === game.boardEnds.right || selectedTile.right === game.boardEnds.right
        canPlay = (end === 'left' && canPlayLeft) || (end === 'right' && canPlayRight)
      }

      if (canPlay) {
        playTile(selectedTile.id, end)

        const tileValue = selectedTile.left + selectedTile.right
        setScore(prev => prev + tileValue * 10)
        setLastMoveTime(Date.now())
      }
    }
    setSelectedTile(null)
    setShowEndSelection(false)
  }, [selectedTile, game.board, game.boardEnds, playTile, nextTurn])

  const handleDraw = useCallback(() => {
    const tile = drawTile()
    if (!tile) {
      // No more tiles in deck, pass turn
      nextTurn()
    } else {
      // After successful draw, get the UPDATED player state
      const updatedGame = useGameStore.getState().game
      const updatedPlayer = updatedGame.players[updatedGame.currentPlayerIndex]

      // Check if player now has valid moves with the newly drawn tile
      const newValidMoves = getValidMoves(updatedPlayer.hand, updatedGame.boardEnds)
      if (newValidMoves.length === 0) {
        // Player still has no valid moves after draw, must pass turn
        nextTurn()
      }
      // If player has valid moves, DON'T pass turn - let them play
    }
  }, [drawTile, nextTurn])

  const handleRestart = useCallback(() => {
    resetGame()
    setScore(0)
    setShowGameOver(false)
    startGame(mode, difficulty, aiStyleParam)
  }, [resetGame, startGame, mode, difficulty, aiStyleParam])

  const currentPlayer = game.players[game.currentPlayerIndex]
  const humanPlayer = game.players.find(p => !p.isAI)
  const aiPlayer = game.players.find(p => p.isAI)
  const isHumanTurn = currentPlayer && !currentPlayer.isAI

  const validMoves = useMemo(() => {
    if (!humanPlayer?.hand || !isHumanTurn) return []
    const moves = getValidMoves(humanPlayer.hand, game.boardEnds)
    return [
      { end: 'left' as const, isValid: moves.some(m => m.end === 'left') },
      { end: 'right' as const, isValid: moves.some(m => m.end === 'right') }
    ]
  }, [humanPlayer?.hand, game.boardEnds, isHumanTurn])

  const canDraw = isHumanTurn && game.deck.length > 0 && getValidMoves(humanPlayer?.hand || [], game.boardEnds).length === 0

  if (game.status === "idle" || !humanPlayer || !aiPlayer) {
    return (
      <div className="min-h-screen bg-game-table flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-foreground/30 border-t-primary rounded-full mx-auto mb-4 animate-spin" />
          <p className="text-foreground/60">Preparazione partita...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-game-table flex flex-col h-screen overflow-hidden">
      {/* Top bar - Ultra simplified */}
      <div className="flex items-center justify-between p-2 bg-black/20 border-b border-white/10 flex-shrink-0">
        <Button
          asChild
          variant="ghost"
          className="rounded-full bg-black/30 text-foreground h-8 px-2 text-xs"
        >
          <Home className="w-4 h-4 mr-1" />
          Menu
        </Button>

        <div className="flex items-center gap-1">
          <div className="text-sm font-bold text-foreground">{score}</div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSound}
            className="w-8 h-8 rounded-full bg-black/30 text-white"
          >
            {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Game area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Opponent Area */}
        <div className="pt-1 pb-1 flex justify-center flex-shrink-0">
          <OpponentHandMobile
            tileCount={aiPlayer.hand.length}
            playerName={aiPlayer.name}
            isCurrentTurn={currentPlayer?.id === aiPlayer.id}
          />
        </div>

        {/* Game Board */}
        <div className="flex-1 relative min-h-0">
          <GameBoardMobile
            board={game.board}
            boardEnds={game.boardEnds}
            validMoves={validMoves}
            currentHand={humanPlayer?.hand}
            className="h-full"
          />

          {/* Deck indicator */}
          <div className="absolute left-2 top-1/2 -translate-y-1/2 z-20">
            <button
              onClick={canDraw ? handleDraw : undefined}
              disabled={!canDraw}
              className={`relative flex flex-col items-center gap-2 p-3 rounded-xl transition-all backdrop-blur-sm border-2 ${canDraw
                ? "bg-blue-500/30 border-blue-500/70 cursor-pointer hover:bg-blue-500/40"
                : "bg-gray-500/30 border-gray-500/70 cursor-not-allowed opacity-60"
                }`}
            >
              <div className={`text-sm font-bold ${canDraw ? "text-blue-300" : "text-gray-400"}`}>
                {game.deck.length}
              </div>
              <div className={`text-sm font-bold ${canDraw ? "text-blue-300" : "text-gray-400"}`}>
                {canDraw ? "PESCA" : "MAZZO"}
              </div>
            </button>
          </div>
        </div>

        {/* Player Hand */}
        <div className="pb-1 pt-1 flex justify-center flex-shrink-0">
          <PlayerHandMobile
            tiles={humanPlayer.hand}
            boardEnds={game.boardEnds}
            isCurrentTurn={isHumanTurn}
            onTileSelect={handleTileSelect}
            selectedTile={selectedTile}
            className="scale-90" // Smaller on mobile
          />
        </div>
      </div>

      {/* Orientation Selector */}
      <AnimatePresence>
        {game.pendingTile && <OrientationSelector />}
      </AnimatePresence>

      {/* End Selection Modal */}
      {showEndSelection && (
        <EndSelection
          boardEnds={game.boardEnds}
          selectedTile={selectedTile}
          onSelectEnd={handleEndSelect}
          onCancel={() => {
            setSelectedTile(null)
            setShowEndSelection(false)
          }}
        />
      )}

      {/* Game Over Modal */}
      {showGameOver && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-sm w-full text-center">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {game.winner === humanPlayer.id ? "Vittoria!" : "Sconfitta!"}
            </h2>
            <p className="text-muted-foreground mb-4">
              Punteggio: {score.toLocaleString()}
            </p>
            <div className="flex gap-2">
              <Button
                onClick={handleRestart}
                className="flex-1"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Rigioca
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/")}
                className="flex-1"
              >
                <Home className="w-4 h-4 mr-2" />
                Menu
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function GamePage() {
  return <GameContent />
}
