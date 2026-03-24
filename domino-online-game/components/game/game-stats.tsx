"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { 
  TrendingUp, 
  Clock, 
  Zap, 
  Target, 
  Award,
  BarChart3,
  Timer,
  Flame
} from "lucide-react"

interface GameStatsProps {
  score: number
  combo: number
  moveStreak: number
  gameTime: number
  tilesPlayed: number
  averageMoveTime: number
  className?: string
}

export function GameStats({
  score,
  combo,
  moveStreak,
  gameTime,
  tilesPlayed,
  averageMoveTime,
  className
}: GameStatsProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatAvgTime = (ms: number) => {
    if (ms === 0) return "0.0s"
    return `${(ms / 1000).toFixed(1)}s`
  }

  const stats = [
    {
      icon: BarChart3,
      label: "Punteggio",
      value: score.toLocaleString(),
      color: "text-blue-400",
      bgColor: "bg-blue-500/20",
      borderColor: "border-blue-500/50"
    },
    {
      icon: Flame,
      label: "Combo",
      value: `x${combo}`,
      color: "text-orange-400",
      bgColor: "bg-orange-500/20",
      borderColor: "border-orange-500/50"
    },
    {
      icon: Zap,
      label: "Streak",
      value: moveStreak.toString(),
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/20",
      borderColor: "border-yellow-500/50"
    },
    {
      icon: Clock,
      label: "Tempo",
      value: formatTime(gameTime),
      color: "text-green-400",
      bgColor: "bg-green-500/20",
      borderColor: "border-green-500/50"
    },
    {
      icon: Target,
      label: "Tessere",
      value: tilesPlayed.toString(),
      color: "text-purple-400",
      bgColor: "bg-purple-500/20",
      borderColor: "border-purple-500/50"
    },
    {
      icon: Timer,
      label: "Media",
      value: formatAvgTime(averageMoveTime),
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/20",
      borderColor: "border-cyan-500/50"
    }
  ]

  return (
    <motion.div
      className={cn(
        "grid grid-cols-3 gap-2 p-3 bg-black/40 backdrop-blur-sm rounded-xl border border-white/10",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          className={cn(
            "flex flex-col items-center justify-center p-2 rounded-lg border",
            stat.bgColor,
            stat.borderColor
          )}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            delay: index * 0.1,
            type: "spring",
            stiffness: 300,
            damping: 20
          }}
          whileHover={{ scale: 1.05 }}
        >
          <stat.icon className={cn("w-4 h-4 mb-1", stat.color)} />
          <span className="text-xs text-white/60 mb-1">{stat.label}</span>
          <span className={cn("text-sm font-bold", stat.color)}>
            {stat.value}
          </span>
        </motion.div>
      ))}
    </motion.div>
  )
}

interface MiniStatsProps {
  score: number
  combo: number
  moveStreak: number
  className?: string
}

export function MiniStats({ score, combo, moveStreak, className }: MiniStatsProps) {
  return (
    <motion.div
      className={cn(
        "flex items-center gap-4 p-2 bg-black/30 backdrop-blur-sm rounded-lg border border-white/10",
        className
      )}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-1">
        <BarChart3 className="w-4 h-4 text-blue-400" />
        <span className="text-sm font-bold text-blue-400">{score.toLocaleString()}</span>
      </div>
      
      {combo > 1 && (
        <motion.div
          className="flex items-center gap-1"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          key={combo}
        >
          <Flame className="w-4 h-4 text-orange-400" />
          <span className="text-sm font-bold text-orange-400">x{combo}</span>
        </motion.div>
      )}
      
      {moveStreak > 1 && (
        <div className="flex items-center gap-1">
          <Zap className="w-4 h-4 text-yellow-400" />
          <span className="text-sm font-bold text-yellow-400">{moveStreak}</span>
        </div>
      )}
    </motion.div>
  )
}
