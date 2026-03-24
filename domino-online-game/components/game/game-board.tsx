"use client"

import { useRef, useEffect, useState, useMemo, useCallback } from "react"
import { motion, AnimatePresence, useAnimation, useMotionValue, useSpring } from "framer-motion"
import { DominoTile } from "./domino-tile"
import { cn } from "@/lib/utils"
import type { PlayedTile } from "@/lib/game-store"
import { useSound } from "@/hooks/use-sound"
import { useMousePosition } from "@/hooks/use-mouse-position"
import { useGameStore, TILE_SKINS } from "@/lib/game-store"

interface GameBoardProps {
  board: PlayedTile[]
  boardEnds: { left: number; right: number }
  className?: string
  validMoves?: Array<{ end: 'left' | 'right'; isValid: boolean }>
  currentHand?: any[]
  tileTheme?: string
}

export function GameBoard({ board, boardEnds, className, validMoves, currentHand, tileTheme }: GameBoardProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const controls = useAnimation()
  const [playPlace] = useSound("/sounds/place.mp3")
  const [playShuffle] = useSound("/sounds/shuffle.mp3")
  const [lastBoardLength, setLastBoardLength] = useState(0)
  const [matchParticles, setMatchParticles] = useState<{ id: number; x: number; y: number; color: string }[]>([])
  const particleIdRef = useRef(0)

  // Get theme colors for board styling
  const lastPlayedTileId = useGameStore(state => state.game?.lastPlayedTileId)
  const equippedSkinId = useGameStore(state => state.user?.inventory?.equippedTileSkin)
  const performanceMode = useGameStore(state => state.settings.performanceMode)

  const equippedSkin = useMemo(() =>
    TILE_SKINS.find(skin => skin.id === equippedSkinId)
    , [equippedSkinId])

  // Apply theme colors only if the skin has a theme, otherwise use original colors
  const themeColors = useMemo(() => equippedSkin?.theme || {
    primary: '#f59e0b',
    secondary: '#d97706',
    background: '#92400e',
    surface: '#78350f'
  }, [equippedSkin])

  const triggerMatchEffect = useCallback((side: 'left' | 'right') => {
    if (performanceMode) return // Completely disable match particles in performance mode

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
    const count = isMobile ? 8 : 15
    const newParticles = Array.from({ length: count }).map(() => ({
      id: particleIdRef.current++,
      // Approximate positions near the board end indicators
      x: side === 'left' ? 40 : (scrollRef.current?.scrollWidth || 1000) - 40,
      y: (scrollRef.current?.clientHeight || 400) / 2,
      color: themeColors.primary
    }))

    setMatchParticles(prev => [...prev, ...newParticles])

    // Cleanup particles after animation
    setTimeout(() => {
      setMatchParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)))
    }, 1000)
  }, [themeColors.primary])

  // Handle board animations and sounds
  useEffect(() => {
    if (board.length > lastBoardLength) {
      // New tile was placed
      playPlace()

      const lastPlayed = board[board.length - 1]
      if (lastPlayed) {
        triggerMatchEffect(lastPlayed.side)
      }

      controls.start({
        scale: [1, 1.02, 1],
        transition: { duration: 0.3 }
      })
    } else if (board.length < lastBoardLength) {
      // Board was reset
      playShuffle()
    }
    setLastBoardLength(board.length)

    // Auto-scroll to ensure the last played tile is visible
    if (scrollRef.current) {
      const { scrollWidth, clientWidth } = scrollRef.current
      const lastPlayed = board[board.length - 1]

      if (lastPlayed) {
        const isLeft = lastPlayed.side === 'left'
        scrollRef.current.scrollTo({
          left: isLeft ? 0 : scrollWidth - clientWidth,
          behavior: "smooth",
        })
      } else {
        scrollRef.current.scrollTo({
          left: (scrollWidth - clientWidth) / 2,
          behavior: "smooth",
        })
      }
    }
  }, [board, controls, lastBoardLength, playPlace, playShuffle, triggerMatchEffect])

  // Completely disable mouse tracking on mobile for maximum performance
  const { x, y } = useMousePosition()
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  // Only use mouse tracking on desktop
  const mouseX = useSpring(0, { stiffness: 500, damping: 100 })
  const mouseY = useSpring(0, { stiffness: 500, damping: 100 })

  useEffect(() => {
    if (!isMobile && x && y) {
      mouseX.set(x / 20)
      mouseY.set(y / 20)
    }
  }, [x, y, mouseX, mouseY, isMobile])

  const particles = useMemo(() =>
    // Disable particles on mobile or performance mode for maximum performance
    (typeof window !== 'undefined' && window.innerWidth < 768) || performanceMode
      ? [] // No particles
      : Array.from({ length: 8 }).map((_, i) => ({ // Reduced particles on desktop
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 0.5,
        duration: 3 + Math.random() * 2
      }))
    , [performanceMode])

  return (
    <motion.div
      className={cn(
        "relative w-full h-full min-h-[400px] bg-cover rounded-2xl overflow-hidden shadow-2xl border-2 group",
        className
      )}
      animate={controls}
      style={{
        backgroundColor: equippedSkin?.theme ? themeColors.background : undefined,
        borderColor: equippedSkin?.theme ? `${themeColors.primary}30` : 'rgba(251, 191, 36, 0.3)',
        backgroundImage: equippedSkin?.theme && equippedSkin.id === 'midnight'
          ? 'radial-gradient(circle at center, rgba(233, 69, 96, 0.1) 0%, rgba(15, 15, 35, 0.8) 100%)'
          : "url('/images/wood-texture.jpg')",
        backgroundPositionX: mouseX,
        backgroundPositionY: mouseY,
      }}
    >
      {/* Animated table overlay */}
      {!performanceMode && (
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.1)_0%,rgba(0,0,0,0.6)_100%)]"
          animate={{
            background: [
              'radial-gradient(circle at center, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%)',
              'radial-gradient(circle at center, rgba(50,0,50,0.1) 0%, rgba(0,0,0,0.6) 100%)',
              'radial-gradient(circle at center, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%)',
            ]
          }}
          transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
        />
      )}

      {/* Animated grid pattern */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.3)_1px,transparent_1px)] bg-[length:40px_40px]" />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-white/20"
            initial={{
              x: `${particle.x}%`,
              y: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
              opacity: 0,
            }}
            animate={{
              y: `${particle.y - 50}%`,
              x: `${particle.x + (Math.random() * 20 - 10)}%`,
              opacity: [0, 0.5, 0],
            }}
            transition={{
              y: {
                duration: particle.duration,
                repeat: Infinity,
                ease: 'linear',
                repeatType: 'loop',
              },
              x: {
                duration: particle.duration * 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
                repeatType: 'mirror',
              },
              opacity: {
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay,
                ease: 'easeInOut',
              },
            }}
          />
        ))}
      </div>

      {/* Match Burst Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden h-full w-full">
        <AnimatePresence>
          {matchParticles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-1.5 h-1.5 rounded-full"
              initial={{
                x: particle.x,
                y: particle.y,
                scale: 0,
                opacity: 1
              }}
              animate={{
                x: particle.x + (Math.random() - 0.5) * 300,
                y: particle.y + (Math.random() - 0.5) * 300,
                scale: Math.random() * 2,
                opacity: 0,
                rotate: Math.random() * 360
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.8,
                ease: "easeOut"
              }}
              style={{ backgroundColor: particle.color }}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Board edges indicator with pulse effect */}
      {board.length > 0 && (
        <>
          <motion.div
            className={cn(
              "absolute left-4 top-1/2 -translate-y-1/2 backdrop-blur px-4 py-2 rounded-full text-2xl font-bold shadow-lg border-2 flex items-center justify-center w-14 h-14 z-10",
              equippedSkin?.theme ? "" : "bg-gradient-to-br from-amber-800/90 to-amber-900/90 text-amber-100 border-amber-600/50"
            )}
            style={equippedSkin?.theme ? {
              background: `linear-gradient(to bottom right, ${themeColors.primary}CC, ${themeColors.secondary}CC)`,
              color: '#ffffff',
              borderColor: `${themeColors.primary}80`
            } : undefined}
            initial={{ scale: 0, rotate: -45 }}
            animate={{
              scale: 1,
              rotate: 0,
              boxShadow: equippedSkin?.theme ? [
                `0 0 0 0px ${themeColors.primary}66`,
                `0 0 0 6px ${themeColors.primary}1A`,
                `0 0 0 0px ${themeColors.primary}66`
              ] : [
                '0 0 0 0px rgba(251, 191, 36, 0.4)',
                '0 0 0 6px rgba(251, 191, 36, 0.1)',
                '0 0 0 0px rgba(251, 191, 36, 0.4)'
              ]
            }}
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 15,
              boxShadow: {
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }
            }}
          >
            <motion.span
              className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: 'reverse'
              }}
            >
              {boardEnds.left}
            </motion.span>
          </motion.div>

          {/* Valid move indicator for left side */}
          {validMoves?.find(m => m.end === 'left')?.isValid && (
            <motion.div
              className={cn(
                "absolute left-20 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center z-20",
                equippedSkin?.theme ? "" : "bg-green-500/20 border-2 border-green-400"
              )}
              style={equippedSkin?.theme ? {
                backgroundColor: `${themeColors.primary}33`,
                borderColor: themeColors.primary
              } : undefined}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 15 }}
            >
              <motion.div
                className={cn("w-2 h-2 rounded-full", equippedSkin?.theme ? "" : "bg-green-400")}
                style={equippedSkin?.theme ? { backgroundColor: themeColors.primary } : undefined}
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>
          )}

          <motion.div
            className={cn(
              "absolute right-4 top-1/2 -translate-y-1/2 backdrop-blur px-4 py-2 rounded-full text-2xl font-bold shadow-lg border-2 flex items-center justify-center w-14 h-14 z-10",
              equippedSkin?.theme ? "" : "bg-gradient-to-br from-amber-800/90 to-amber-900/90 text-amber-100 border-amber-600/50"
            )}
            style={equippedSkin?.theme ? {
              background: `linear-gradient(to bottom right, ${themeColors.primary}CC, ${themeColors.secondary}CC)`,
              color: '#ffffff',
              borderColor: `${themeColors.primary}80`
            } : undefined}
            initial={{ scale: 0, rotate: 45 }}
            animate={{
              scale: 1,
              rotate: 0,
              boxShadow: equippedSkin?.theme ? [
                `0 0 0 0px ${themeColors.primary}66`,
                `0 0 0 6px ${themeColors.primary}1A`,
                `0 0 0 0px ${themeColors.primary}66`
              ] : [
                '0 0 0 0px rgba(251, 191, 36, 0.4)',
                '0 0 0 6px rgba(251, 191, 36, 0.1)',
                '0 0 0 0px rgba(251, 191, 36, 0.4)'
              ]
            }}
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 15,
              delay: 0.1,
              boxShadow: {
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.3
              }
            }}
          >
            <motion.span
              className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: 'reverse',
                delay: 0.2
              }}
            >
              {boardEnds.right}
            </motion.span>
          </motion.div>

          {/* Valid move indicator for right side */}
          {validMoves?.find(m => m.end === 'right')?.isValid && (
            <motion.div
              className={cn(
                "absolute right-20 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center z-20",
                equippedSkin?.theme ? "" : "bg-green-500/20 border-2 border-green-400"
              )}
              style={equippedSkin?.theme ? {
                backgroundColor: `${themeColors.primary}33`,
                borderColor: themeColors.primary
              } : undefined}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 15 }}
            >
              <motion.div
                className={cn("w-2 h-2 rounded-full", equippedSkin?.theme ? "" : "bg-green-400")}
                style={equippedSkin?.theme ? { backgroundColor: themeColors.primary } : undefined}
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>
          )}

        </>
      )}

      {/* Scrollable board area */}
      <div
        ref={scrollRef}
        className="w-full h-full overflow-x-auto overflow-y-hidden flex items-center px-4 py-8"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <div className="flex-1 min-w-max flex items-center justify-center">
          <AnimatePresence mode="popLayout">
            {board.map(({ tile, position, side, owner, orientation }, index) => {
              const isNew = index === board.length - 1

              return (
                <motion.div
                  key={`${tile.id}-${index}`}
                  className={cn(
                    "mx-1.5 shadow-2xl transition-all duration-300 hover:z-10"
                  )}
                  initial={{
                    opacity: 0,
                    scale: 0.8,
                    y: isNew ? 20 : 0,
                    rotate: isNew ? -10 + Math.random() * 20 : 0,
                    filter: 'drop-shadow(0 4px 0px rgba(0,0,0,0.1))'
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    rotate: 0,
                    transition: {
                      type: "spring",
                      stiffness: isNew ? 600 : 500,
                      damping: isNew ? 20 : 30,
                      delay: isNew ? 0.1 : 0.05 * index
                    }
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.5,
                    rotate: -10 + Math.random() * 20,
                    transition: { duration: 0.2 }
                  }}
                  whileHover={{
                    y: -15,
                    scale: 1.1,
                    filter: 'drop-shadow(0 8px 12px rgba(0,0,0,0.2))',
                    transition: {
                      duration: 0.3,
                      type: 'spring',
                      stiffness: 400,
                      damping: 10
                    }
                  }}
                  whileTap={{
                    scale: 1.05,
                    transition: { duration: 0.1 }
                  }}
                >
                  <DominoTile
                    left={tile.left}
                    right={tile.right}
                    orientation={orientation || "vertical"}
                    size="lg"
                    theme={tileTheme || "classic"}
                    isLastPlayed={tile.id === lastPlayedTileId}
                  />
                </motion.div>
              )
            })}
          </AnimatePresence>

          {/* Animated empty state */}
          {board.length === 0 && (
            <motion.div
              className="relative text-center p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-900/20 to-transparent opacity-0 group-hover:opacity-100"
                style={{
                  transform: 'rotate(-2deg)',
                  maskImage: 'linear-gradient(90deg, transparent, white, transparent)',
                  WebkitMaskImage: 'linear-gradient(90deg, transparent, white, transparent)',
                }}
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  x: {
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear',
                  },
                }}
              />
              <motion.span
                className="relative z-10 text-amber-100/80 text-xl font-medium bg-gradient-to-r from-amber-900/40 to-amber-800/40 px-6 py-4 rounded-xl backdrop-blur-sm border border-amber-700/30 shadow-lg inline-block"
                animate={{
                  y: [0, -5, 0],
                  boxShadow: [
                    '0 4px 20px -6px rgba(0,0,0,0.2)',
                    '0 8px 30px -8px rgba(251, 191, 36, 0.3)',
                    '0 4px 20px -6px rgba(0,0,0,0.2)'
                  ]
                }}
                transition={{
                  y: {
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  },
                  boxShadow: {
                    duration: 4,
                    repeat: Infinity,
                    repeatType: 'reverse'
                  }
                }}
              >
                Place the first domino to start the game! 👇
              </motion.span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Animated center decoration */}
      {board.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            className="relative w-40 h-40"
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              scale: {
                duration: 4,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut'
              },
              rotate: {
                duration: 8,
                repeat: Infinity,
                repeatType: 'mirror',
                ease: 'easeInOut'
              }
            }}
          >
            {/* Outer ring */}
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-white/10"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 0.9, 0.7]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut'
              }}
            />

            {/* Middle ring */}
            <motion.div
              className="absolute inset-4 rounded-full border-3 border-white/5"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 180]
              }}
              transition={{
                rotate: {
                  duration: 20,
                  repeat: Infinity,
                  ease: 'linear'
                },
                scale: {
                  duration: 6,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: 'easeInOut'
                }
              }}
            />

            {/* Inner dot */}
            <motion.div
              className="absolute inset-8 rounded-full bg-gradient-to-br from-amber-400/20 to-amber-600/10"
              animate={{
                scale: [1, 1.2, 1],
                boxShadow: [
                  '0 0 20px 0px rgba(251, 191, 36, 0.1)',
                  '0 0 40px 10px rgba(251, 191, 36, 0.2)',
                  '0 0 20px 0px rgba(251, 191, 36, 0.1)'
                ]
              }}
              transition={{
                scale: {
                  duration: 5,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: 'easeInOut'
                },
                boxShadow: {
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }
              }}
            />
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}
