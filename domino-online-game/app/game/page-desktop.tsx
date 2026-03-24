"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { GameBoard } from "@/components/game/game-board"
import { PlayerHand, OpponentHand } from "@/components/game/player-hand"
import { EndSelection } from "@/components/game/game-controls"
import { OrientationSelector } from "@/components/game/orientation-selector"
import { useGameStore, getValidMoves, getAIMove, getAIDelay } from "@/lib/game-store"
import GamificationOverlay from "@/components/gamification/gamification-overlay"
import { useTheme } from "@/hooks/use-theme"
import type { DominoTile } from "@/lib/game-store"
import {
  Trophy,
  RotateCcw,
  Home,
  Pause,
  Volume2,
  VolumeX,
  Sparkles,
  Zap,
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

  const {
    game,
    settings,
    user,
    startGame,
    playTile,
    drawTile,
    nextTurn,
    pauseGame,
    resumeGame,
    resetGame,
    toggleSound,
  } = useGameStore()

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

  // AI turn logic
  useEffect(() => {
    if (game.status !== "playing") return

    const currentPlayer = game.players[game.currentPlayerIndex]
    if (!currentPlayer?.isAI) return

    const timeout = setTimeout(() => {
      console.log("AI turn started - checking moves...")
      console.log("AI hand:", currentPlayer.hand.length, "tiles")
      console.log("Board ends:", game.boardEnds)
      console.log("Deck length:", game.deck.length)

      const aiMove = getAIMove()

      console.log("AI move result:", aiMove)

      if (aiMove && aiMove.tile) {
        console.log("AI playing tile:", aiMove.tile.id, "to", aiMove.end)
        playTile(aiMove.tile.id, aiMove.end)
        nextTurn()
      } else {
        console.log("AI has no valid moves, trying to draw...")
        // AI has no valid moves, try to draw
        const tile = drawTile()
        console.log("AI drew tile:", tile)
        if (!tile) {
          console.log("No more tiles, passing turn")
          // No more tiles, pass turn
          nextTurn()
        } else {
          console.log("Tile drawn, checking if playable...")
          // Check if the drawn tile is playable
          const newValidMoves = getValidMoves(currentPlayer.hand, game.boardEnds)
          console.log("New valid moves after draw:", newValidMoves.length)
          if (newValidMoves.length > 0) {
            // AI can play the drawn tile, try again
            const newAiMove = getAIMove()
            if (newAiMove) {
              console.log("AI playing drawn tile:", newAiMove.tile.id, "to", newAiMove.end)
              playTile(newAiMove.tile.id, newAiMove.end)
              nextTurn()
            } else {
              console.log("Still no valid move, passing turn")
              // Still no valid move, pass turn
              nextTurn()
            }
          } else {
            console.log("Drawn tile not playable, passing turn")
            // Drawn tile not playable, pass turn
            nextTurn()
          }
        }
      }
    }, getAIDelay(difficulty))

    return () => clearTimeout(timeout)
  }, [game.status, game.currentPlayerIndex, game.players, game.boardEnds, playTile, drawTile, nextTurn])

  const handleTileSelect = useCallback((tile: DominoTile) => {
    setSelectedTile(tile)
    setShowEndSelection(true)
  }, [])

  const handleTilePlay = useCallback((tile: DominoTile, end: 'left' | 'right') => {
    const currentPlayer = game.players[game.currentPlayerIndex]
    const isCurrentHumanTurn = currentPlayer && !currentPlayer.isAI

    if (!isCurrentHumanTurn) return

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
      // nextTurn() viene gestito automaticamente nel game store

      const tileValue = tile.left + tile.right
      setScore(prev => prev + tileValue * 10)
      setLastMoveTime(Date.now())
    }
  }, [game.players, game.currentPlayerIndex, game.board, game.boardEnds, playTile])

  const handleTileDrag = useCallback((tile: DominoTile, end: 'left' | 'right') => {
    handleTilePlay(tile, end)
  }, [handleTilePlay])

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
        // nextTurn() viene gestito automaticamente nel game store

        const tileValue = selectedTile.left + selectedTile.right
        setScore(prev => prev + tileValue * 10)
        setLastMoveTime(Date.now())
      }
    }
    setSelectedTile(null)
    setShowEndSelection(false)
    // Pulisci anche eventuali pending tile rimasti
    const { clearPendingTile } = useGameStore.getState()
    clearPendingTile()
  }, [selectedTile, game.board, game.boardEnds, game.players, game.currentPlayerIndex, playTile])

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
    console.log("Restarting game...")
    resetGame()
    setScore(0)
    setShowGameOver(false)
    setSelectedTile(null)
    setShowEndSelection(false)
    // Force a small delay to ensure state is properly reset
    setTimeout(() => {
      startGame(mode, difficulty, aiStyleParam)
    }, 100)
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
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-foreground/30 border-t-primary rounded-full mx-auto mb-4"
          />
          <p className="text-foreground/60">Preparazione partita...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-game-table flex flex-col h-screen overflow-hidden">
      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between p-2 sm:p-3 bg-black/20 backdrop-blur-sm border-b border-white/10 flex-shrink-0">
        <Button
          asChild
          variant="ghost"
          className="rounded-full bg-black/30 hover:bg-black/50 text-foreground backdrop-blur-sm h-8 sm:h-10 px-2 sm:px-4 text-xs sm:text-sm touch-manipulation"
        >
          <Link href="/">
            <Home className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Menu</span>
          </Link>
        </Button>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="text-sm sm:text-lg font-bold text-foreground">{score}</div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSound}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/30 text-white"
          >
            {settings.soundEnabled ? <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />}
          </Button>
        </div>
      </div>

      {/* Game area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Opponent Area */}
        <div className="pt-2 sm:pt-4 pb-2 flex justify-center flex-shrink-0">
          <OpponentHand
            tileCount={aiPlayer.hand.length}
            playerName={aiPlayer.name}
            isCurrentTurn={currentPlayer?.id === aiPlayer.id}
          />
        </div>

        {/* Game Board */}
        <div className="flex-1 relative min-h-0">
          <GameBoard
            board={game.board}
            boardEnds={game.boardEnds}
            validMoves={validMoves}
            currentHand={humanPlayer?.hand}
            tileTheme={user?.inventory?.equippedTileSkin}
            className="h-full"
          />
        </div>

        {/* Player Hand */}
        <div className="pb-2 sm:pb-4 pt-2 flex justify-center flex-shrink-0">
          <PlayerHand
            tiles={humanPlayer.hand}
            boardEnds={game.boardEnds}
            isCurrentTurn={isHumanTurn}
            onTileSelect={handleTileSelect}
            onTileDrag={handleTileDrag}
            selectedTile={selectedTile}
            tileTheme={user?.inventory?.equippedTileSkin}
          />
        </div>
      </div>

      {/* Deck indicator */}
      <motion.div
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.button
          onClick={canDraw ? handleDraw : undefined}
          disabled={!canDraw}
          className={`relative flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl transition-all backdrop-blur-sm border-2 ${canDraw
            ? "bg-blue-500/30 border-blue-500/70 hover:bg-blue-500/40 cursor-pointer"
            : "bg-gray-500/30 border-gray-500/70 cursor-not-allowed opacity-60"
            }`}
          whileHover={canDraw ? { scale: 1.05 } : {}}
          whileTap={canDraw ? { scale: 0.95 } : {}}
        >
          <div className={`text-sm sm:text-base font-bold ${canDraw ? "text-blue-300" : "text-gray-400"}`}>
            {game.deck.length}
          </div>
          <div className={`text-sm sm:text-base font-bold ${canDraw ? "text-blue-300" : "text-gray-400"}`}>
            {canDraw ? "PESCA" : "MAZZO"}
          </div>
        </motion.button>
      </motion.div>


      {/* Orientation Selector */}
      <AnimatePresence>
        {game.pendingTile && <OrientationSelector />}
      </AnimatePresence>

      {/* End Selection Modal */}
      <AnimatePresence>
        {showEndSelection && (
          <EndSelection
            boardEnds={game.boardEnds}
            selectedTile={selectedTile}
            onSelectEnd={handleEndSelect}
            onCancel={() => {
              setSelectedTile(null)
              setShowEndSelection(false)
              // Pulisci anche eventuali pending tile rimasti
              const { clearPendingTile } = useGameStore.getState()
              clearPendingTile()
            }}
          />
        )}
      </AnimatePresence>

      {/* Game Over Modal */}
      <AnimatePresence>
        {showGameOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-card border border-border rounded-2xl p-6 max-w-sm w-full text-center"
            >
              <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
              <h2 className="text-2xl font-bold mb-2">
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gamification Overlay */}
      <GamificationOverlay />
    </div>
  )
}

export default function GamePage() {
  return (
    <div className="min-h-screen bg-game-table">
      <GameContent />
    </div>
  )
}
