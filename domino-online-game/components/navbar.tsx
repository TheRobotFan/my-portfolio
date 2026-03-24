"use client"

import { Button } from "@/components/ui/button"
import { LoginDialog } from "@/components/login-dialog"
import { useAuth } from "@/hooks/use-auth"
import { LogIn, LogOut, User as UserIcon, Dices, Crown, Coins, Gem, Star, Users, Trophy, Shield } from "lucide-react"
import { useGameStore } from "@/lib/game-store"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

export function Navbar() {
  const { user: authUser, logout } = useAuth()
  const { user: gameUser } = useGameStore()

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-lg flex items-center justify-center">
            <Dices className="h-5 w-5 text-white" />
          </div>
          <span className="font-semibold text-lg hidden sm:inline">Dominion: Elite Domino</span>
          {!authUser && (
            <div className="flex items-center gap-1 px-2 py-1 bg-green-500/20 rounded-full">
              <Crown className="h-3 w-3 text-green-400" />
              <span className="text-xs text-green-400">Guest</span>
            </div>
          )}
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-6 px-4">
          <Link href="/multiplayer" className="text-sm font-medium hover:text-primary flex items-center gap-2">
            <Users className="w-4 h-4" />
            Multigiocatore
          </Link>
          <Link href="/tournaments" className="text-sm font-medium hover:text-primary flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            Tornei
          </Link>
          <Link href="/clans" className="text-sm font-medium hover:text-primary flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-500" />
            Clan
          </Link>
        </div>

        {/* Global Stats Display */}
        {gameUser && (
          <div className="flex items-center gap-2 sm:gap-4 flex-1 justify-center max-w-xl">
            <div className="flex flex-col items-center gap-0.5 sm:flex-row sm:gap-4 px-3 py-1 bg-black/20 rounded-full backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-1.5" title="Monete">
                <Coins className="w-3.5 h-3.5 text-yellow-400" />
                <span className="font-bold text-xs sm:text-sm">{gameUser.inventory.coins}</span>
              </div>
              <div className="w-px h-3 bg-white/10 hidden sm:block" />
              <div className="flex items-center gap-1.5" title="Diamanti">
                <Gem className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-bold text-xs sm:text-sm">{gameUser.inventory.gems}</span>
              </div>
            </div>

            <div className="hidden md:flex flex-col w-32 gap-1">
              <div className="flex justify-between items-center px-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">LV. {gameUser.level}</span>
                <span className="text-[10px] font-medium">{gameUser.xp}/{gameUser.xpToNextLevel} XP</span>
              </div>
              <Progress value={(gameUser.xp / gameUser.xpToNextLevel) * 100} className="h-1.5" />
            </div>
          </div>
        )}

        <div className="flex items-center gap-4">
          {authUser ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-lg">
                <span className="text-lg">{authUser.avatar}</span>
                <div className="hidden lg:block">
                  <p className="text-sm font-medium">{authUser.name}</p>
                  <p className="text-xs text-muted-foreground truncate max-w-[100px]">{authUser.email}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          ) : (
            <LoginDialog>
              <Button variant="outline" size="sm" className="gap-2">
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">Salva Progressi</span>
              </Button>
            </LoginDialog>
          )}
        </div>
      </div>
    </nav>
  )
}
