"use client"

import { memo } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { TILE_SKINS, useGameStore } from "@/lib/game-store"

interface DominoTileProps {
  left: number
  right: number
  isHidden?: boolean
  isSelected?: boolean
  isValid?: boolean
  isDragging?: boolean
  isLastPlayed?: boolean
  size?: "sm" | "md" | "lg"
  orientation?: "horizontal" | "vertical"
  theme?: string
  onClick?: () => void
  className?: string
}

// Dot positions for each number (0-6) - classic domino layout
const dotPositions: Record<number, Array<{ x: number; y: number }>> = {
  0: [],
  1: [{ x: 50, y: 50 }],
  2: [{ x: 25, y: 25 }, { x: 75, y: 75 }],
  3: [{ x: 25, y: 25 }, { x: 50, y: 50 }, { x: 75, y: 75 }],
  4: [{ x: 25, y: 25 }, { x: 75, y: 25 }, { x: 25, y: 75 }, { x: 75, y: 75 }],
  5: [{ x: 25, y: 25 }, { x: 50, y: 50 }, { x: 75, y: 75 }, { x: 75, y: 25 }, { x: 25, y: 75 }],
  6: [{ x: 25, y: 25 }, { x: 75, y: 25 }, { x: 25, y: 50 }, { x: 75, y: 50 }, { x: 25, y: 75 }, { x: 75, y: 75 }],
}

const sizeClasses = {
  sm: { tile: "w-14 h-28", dot: 4 },
  md: { tile: "w-16 h-32", dot: 5 },
  lg: { tile: "w-20 h-40", dot: 6 },
}

function DotPattern({ value, size, dotColor }: { value: number; size: number; dotColor: string }) {
  const dots = dotPositions[value] || []

  return (
    <div className="relative w-full h-full">
      {dots.map((dot, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: size,
            height: size,
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            transform: "translate(-50%, -50%)",
            backgroundColor: dotColor,
          }}
        />
      ))}
    </div>
  )
}

const DominoTileComponent = ({
  left,
  right,
  isHidden = false,
  isSelected = false,
  isValid = false,
  isDragging = false,
  isLastPlayed = false,
  size = "md",
  orientation = "vertical",
  theme = "classic",
  onClick,
  className,
}: DominoTileProps) => {
  const { tile: tileClass, dot: dotSize } = sizeClasses[size]

  // Get theme colors
  const themeData = TILE_SKINS.find(skin => skin.id === theme) || TILE_SKINS[0]
  const themeColors = themeData.colors

  if (isHidden) {
    return (
      <div
        className={cn(
          tileClass,
          orientation === "horizontal" && "rotate-90",
          "rounded-lg bg-primary shadow-lg flex items-center justify-center",
          className
        )}
      >
        <div className="w-3/4 h-3/4 rounded border-2 border-primary-foreground/30 flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-primary-foreground/30" />
        </div>
      </div>
    )
  }

  const performanceMode = useGameStore((state) => state.settings.performanceMode)

  return (
    <motion.div
      // Removed whileHover to prevent click interference
      animate={{
        scale: isDragging ? 1.1 : 1,
        rotateX: !performanceMode && isDragging ? -10 : 0,
        rotateY: !performanceMode && isDragging ? 10 : 0,
        z: !performanceMode && isDragging ? 50 : 0,
        boxShadow: isSelected
          ? "0 0 30px rgba(var(--primary), 0.6), 0 10px 20px rgba(0,0,0,0.4)"
          : isDragging
            ? "0 30px 60px rgba(0,0,0,0.5)"
            : isLastPlayed
              ? "0 0 25px rgba(250, 204, 21, 0.6), 0 0 40px rgba(250, 204, 21, 0.3), 0 5px 15px rgba(0,0,0,0.3)"
              : performanceMode
                ? "0 4px 8px rgba(0,0,0,0.4)"
                : "0 8px 16px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,255,255,0.3)",
      }}
      onClick={onClick}
      className={cn(
        tileClass,
        orientation === "horizontal" && "rotate-90",
        "rounded-lg flex flex-col cursor-pointer transition-all relative overflow-visible",
        isSelected && "ring-2 ring-primary ring-offset-2 ring-offset-background",
        isValid && "ring-2 ring-accent ring-offset-1 ring-offset-background",
        isLastPlayed && "ring-4 ring-yellow-400 ring-offset-2 ring-offset-background animate-pulse",
        className
      )}
      style={{
        backgroundColor: themeColors.background,
        borderColor: themeColors.border,
        borderWidth: "4px",
        borderStyle: "solid",
        perspective: performanceMode ? "none" : "1000px",
        transformStyle: performanceMode ? "flat" : "preserve-3d",
        willChange: isDragging ? "transform" : "auto",
        pointerEvents: "auto", // Ensure clicks work
      }}
    >
      {/* 3D Depth Sides (Simplified with shadows) */}
      <div
        className="absolute inset-0 rounded-lg pointer-events-none"
        style={{
          boxShadow: `inset -2px -2px 4px rgba(0,0,0,0.3), inset 2px 2px 4px rgba(255,255,255,0.2)`,
          transform: "translateZ(-1px)"
        }}
      />

      {/* Top half */}
      <div className="flex-1 p-1.5 relative z-10" style={{ borderBottomColor: themeColors.dots, borderBottomWidth: '1px', borderBottomStyle: 'solid' }}>
        <DotPattern value={left} size={dotSize} dotColor={themeColors.dots} />
      </div>

      {/* Divider line */}
      <div className="h-0.5 mx-2 relative z-10" style={{ backgroundColor: themeColors.dots }} />

      {/* Bottom half */}
      <div className="flex-1 p-1.5 relative z-10">
        <DotPattern value={right} size={dotSize} dotColor={themeColors.dots} />
      </div>

      {/* Edge Reflection */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 rounded-t-lg pointer-events-none" />
    </motion.div>
  )
}

export const DominoTile = memo(DominoTileComponent, (prev, next) => {
  // Don't compare onClick - always allow updates for click handlers
  return (
    prev.left === next.left &&
    prev.right === next.right &&
    prev.isHidden === next.isHidden &&
    prev.isSelected === next.isSelected &&
    prev.isValid === next.isValid &&
    prev.isDragging === next.isDragging &&
    prev.isLastPlayed === next.isLastPlayed &&
    prev.size === next.size &&
    prev.orientation === next.orientation &&
    prev.theme === next.theme &&
    prev.className === next.className &&
    prev.onClick === next.onClick // Include onClick in comparison
  )
})

export function DominoTilePlaceholder({
  size = "md",
  className
}: {
  size?: "sm" | "md" | "lg"
  className?: string
}) {
  const { tile: tileClass } = sizeClasses[size]

  return (
    <div
      className={cn(
        tileClass,
        "rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20",
        className
      )}
    />
  )
}
