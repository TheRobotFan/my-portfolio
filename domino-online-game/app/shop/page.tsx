"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DominoTile } from "@/components/game/domino-tile"
import { useGameStore } from "@/lib/game-store"
import { useTheme } from "@/hooks/use-theme"
import {
  ArrowLeft,
  Coins,
  Gem,
  Check,
  Lock,
  Sparkles,
  Gift,
  Zap,
  Eye,
  RefreshCw,
  Ban,
  Star,
} from "lucide-react"
import {
  TILE_SKINS,
  AVATAR_SKINS,
  TABLE_SKINS,
  POWER_UPS,
  type TileSkin,
  type AvatarSkin,
  type TableSkin,
  type PowerUp,
} from "@/lib/game-store"

const RARITY_COLORS = {
  common: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
  rare: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  epic: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  legendary: "bg-amber-500/20 text-amber-400 border-amber-500/30",
}

const RARITY_GLOW = {
  common: "",
  rare: "shadow-blue-500/20",
  epic: "shadow-purple-500/20 shadow-lg",
  legendary: "shadow-amber-500/30 shadow-xl",
}

export default function ShopPage() {
  // Applica il tema generale dell'applicazione
  useTheme()
  
  const { user, createUser, purchaseItem, equipItem, claimDailyReward } = useGameStore()
  const [selectedTab, setSelectedTab] = useState("tiles")
  const [dailyRewardClaimed, setDailyRewardClaimed] = useState(false)
  const [rewardResult, setRewardResult] = useState<{ coins: number; gems: number; item?: string } | null>(null)
  const [purchaseAnimation, setPurchaseAnimation] = useState<string | null>(null)

  useEffect(() => {
    // Non creare automaticamente utente
  }, [])

  const handleClaimDaily = () => {
    const result = claimDailyReward()
    if (result) {
      setRewardResult(result)
      setDailyRewardClaimed(true)
      setTimeout(() => setRewardResult(null), 3000)
    }
  }

  const handlePurchase = (type: "tile" | "avatar" | "table" | "powerup", itemId: string) => {
    const success = purchaseItem(type, itemId)
    if (success) {
      setPurchaseAnimation(itemId)
      setTimeout(() => setPurchaseAnimation(null), 500)
    }
  }

  const handleEquip = (type: "tile" | "avatar" | "table", itemId: string) => {
    equipItem(type, itemId)
  }

  const canAfford = (price: number) => (user?.inventory.coins || 0) >= price

  const isOwned = (type: "tile" | "avatar" | "table", itemId: string) => {
    if (!user) return false
    if (type === "tile") return user.inventory.unlockedTileSkins.includes(itemId)
    if (type === "avatar") return user.inventory.unlockedAvatars.includes(itemId)
    if (type === "table") return user.inventory.unlockedTableSkins.includes(itemId)
    return false
  }

  const isEquipped = (type: "tile" | "avatar" | "table", itemId: string) => {
    if (!user) return false
    if (type === "tile") return user.inventory.equippedTileSkin === itemId
    if (type === "avatar") return user.inventory.equippedAvatar === itemId
    if (type === "table") return user.inventory.equippedTable === itemId
    return false
  }

  const canClaimDaily = user && user.lastDailyReward !== new Date().toDateString()

  return (
    <div className="min-h-screen bg-game-table">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Button
            asChild
            variant="ghost"
            className="rounded-full bg-black/30 hover:bg-black/50 text-foreground backdrop-blur-sm"
          >
            <Link href="/">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Menu
            </Link>
          </Button>

          {/* Currency Display */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-black/30 rounded-full px-4 py-2">
              <Coins className="w-5 h-5 text-yellow-400" />
              <span className="font-bold text-foreground">{user?.inventory.coins || 0}</span>
            </div>
            <div className="flex items-center gap-2 bg-black/30 rounded-full px-4 py-2">
              <Gem className="w-5 h-5 text-cyan-400" />
              <span className="font-bold text-foreground">{user?.inventory.gems || 0}</span>
            </div>
                      </div>
        </div>
      </header>

      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Daily Reward Banner */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className={`overflow-hidden ${canClaimDaily ? "bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/30" : "bg-card/50"}`}>
              <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${canClaimDaily ? "bg-amber-500/30" : "bg-muted"}`}>
                    <Gift className={`w-7 h-7 ${canClaimDaily ? "text-amber-400" : "text-muted-foreground"}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground">Premio Giornaliero</h3>
                    <p className="text-sm text-muted-foreground">
                      {canClaimDaily ? "Riscuoti il tuo premio di oggi!" : "Torna domani per il prossimo premio"}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleClaimDaily}
                  disabled={!canClaimDaily}
                  className={canClaimDaily ? "bg-amber-500 hover:bg-amber-600" : ""}
                >
                  {canClaimDaily ? "Riscuoti" : "Riscosso"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Reward Animation */}
          <AnimatePresence>
            {rewardResult && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                onClick={() => setRewardResult(null)}
              >
                <motion.div
                  initial={{ y: 50 }}
                  animate={{ y: 0 }}
                  className="bg-card rounded-2xl p-8 text-center"
                >
                  <Sparkles className="w-16 h-16 mx-auto mb-4 text-amber-400" />
                  <h2 className="text-2xl font-bold text-foreground mb-4">Premio Ottenuto!</h2>
                  <div className="flex items-center justify-center gap-6 mb-4">
                    <div className="flex items-center gap-2">
                      <Coins className="w-6 h-6 text-yellow-400" />
                      <span className="text-xl font-bold text-foreground">+{rewardResult.coins}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Gem className="w-6 h-6 text-cyan-400" />
                      <span className="text-xl font-bold text-foreground">+{rewardResult.gems}</span>
                    </div>
                  </div>
                  {rewardResult.item && (
                    <p className="text-primary font-medium">+ Skin Bonus sbloccata!</p>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Shop Tabs */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-black/30 p-1 rounded-xl">
              <TabsTrigger value="tiles" className="rounded-lg data-[state=active]:bg-primary">
                Tessere
              </TabsTrigger>
              <TabsTrigger value="avatars" className="rounded-lg data-[state=active]:bg-primary">
                Avatar
              </TabsTrigger>
              <TabsTrigger value="tables" className="rounded-lg data-[state=active]:bg-primary">
                Tavoli
              </TabsTrigger>
              <TabsTrigger value="powerups" className="rounded-lg data-[state=active]:bg-primary">
                Potenziamenti
              </TabsTrigger>
            </TabsList>

            {/* Tile Skins */}
            <TabsContent value="tiles" className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {TILE_SKINS.map((skin) => (
                  <TileSkinCard
                    key={skin.id}
                    skin={skin}
                    owned={isOwned("tile", skin.id)}
                    equipped={isEquipped("tile", skin.id)}
                    canAfford={canAfford(skin.price)}
                    onPurchase={() => handlePurchase("tile", skin.id)}
                    onEquip={() => handleEquip("tile", skin.id)}
                    isAnimating={purchaseAnimation === skin.id}
                  />
                ))}
              </div>
            </TabsContent>

            {/* Avatar Skins */}
            <TabsContent value="avatars" className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {AVATAR_SKINS.map((skin) => (
                  <AvatarSkinCard
                    key={skin.id}
                    skin={skin}
                    owned={isOwned("avatar", skin.id)}
                    equipped={isEquipped("avatar", skin.id)}
                    canAfford={canAfford(skin.price)}
                    onPurchase={() => handlePurchase("avatar", skin.id)}
                    onEquip={() => handleEquip("avatar", skin.id)}
                    isAnimating={purchaseAnimation === skin.id}
                  />
                ))}
              </div>
            </TabsContent>

            {/* Table Skins */}
            <TabsContent value="tables" className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {TABLE_SKINS.map((skin) => (
                  <TableSkinCard
                    key={skin.id}
                    skin={skin}
                    owned={isOwned("table", skin.id)}
                    equipped={isEquipped("table", skin.id)}
                    canAfford={canAfford(skin.price)}
                    onPurchase={() => handlePurchase("table", skin.id)}
                    onEquip={() => handleEquip("table", skin.id)}
                    isAnimating={purchaseAnimation === skin.id}
                  />
                ))}
              </div>
            </TabsContent>

            {/* Power Ups */}
            <TabsContent value="powerups" className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {POWER_UPS.map((powerUp) => (
                  <PowerUpCard
                    key={powerUp.id}
                    powerUp={powerUp}
                    quantity={user?.inventory.powerUps[powerUp.id] || 0}
                    canAfford={canAfford(powerUp.price)}
                    onPurchase={() => handlePurchase("powerup", powerUp.id)}
                    isAnimating={purchaseAnimation === powerUp.id}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

// Tile Skin Card Component
function TileSkinCard({
  skin,
  owned,
  equipped,
  canAfford,
  onPurchase,
  onEquip,
  isAnimating,
}: {
  skin: TileSkin
  owned: boolean
  equipped: boolean
  canAfford: boolean
  onPurchase: () => void
  onEquip: () => void
  isAnimating: boolean
}) {
  return (
    <motion.div
      animate={isAnimating ? { scale: [1, 1.05, 1] } : {}}
      transition={{ duration: 0.3 }}
    >
      <Card className={`overflow-hidden transition-shadow ${RARITY_GLOW[skin.rarity]} ${equipped ? "ring-2 ring-primary" : ""}`}>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <Badge className={RARITY_COLORS[skin.rarity]}>
              {skin.rarity === "common" ? "Comune" : skin.rarity === "rare" ? "Raro" : skin.rarity === "epic" ? "Epico" : "Leggendario"}
            </Badge>
            {equipped && <Check className="w-5 h-5 text-primary" />}
          </div>

          <div
            className="w-full aspect-[2/1] rounded-lg mb-3 flex items-center justify-center"
            style={{ backgroundColor: skin.colors.background }}
          >
            <div
              className="w-16 h-8 rounded border-2 flex"
              style={{ borderColor: skin.colors.border }}
            >
              <div className="flex-1 flex items-center justify-center">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: skin.colors.dots }}
                />
              </div>
              <div
                className="w-px"
                style={{ backgroundColor: skin.colors.border }}
              />
              <div className="flex-1 flex items-center justify-center gap-0.5">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: skin.colors.dots }}
                  />
                ))}
              </div>
            </div>
          </div>

          <h3 className="font-bold text-foreground mb-1">{skin.name}</h3>
          <p className="text-xs text-muted-foreground mb-3">{skin.description}</p>

          {owned ? (
            <Button
              onClick={onEquip}
              disabled={equipped}
              variant={equipped ? "secondary" : "default"}
              className="w-full"
              size="sm"
            >
              {equipped ? "Equipaggiato" : "Equipaggia"}
            </Button>
          ) : (
            <Button
              onClick={onPurchase}
              disabled={!canAfford || skin.price === 0}
              className="w-full"
              size="sm"
            >
              {skin.price === 0 ? (
                "Gratis"
              ) : canAfford ? (
                <>
                  <Coins className="w-4 h-4 mr-1" />
                  {skin.price}
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-1" />
                  {skin.price}
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Avatar Skin Card Component
function AvatarSkinCard({
  skin,
  owned,
  equipped,
  canAfford,
  onPurchase,
  onEquip,
  isAnimating,
}: {
  skin: AvatarSkin
  owned: boolean
  equipped: boolean
  canAfford: boolean
  onPurchase: () => void
  onEquip: () => void
  isAnimating: boolean
}) {
  return (
    <motion.div
      animate={isAnimating ? { scale: [1, 1.05, 1] } : {}}
      transition={{ duration: 0.3 }}
    >
      <Card className={`overflow-hidden transition-shadow ${RARITY_GLOW[skin.rarity]} ${equipped ? "ring-2 ring-primary" : ""}`}>
        <CardContent className="p-4 text-center">
          <Badge className={`${RARITY_COLORS[skin.rarity]} mb-3`}>
            {skin.rarity === "common" ? "Comune" : skin.rarity === "rare" ? "Raro" : skin.rarity === "epic" ? "Epico" : "Leggendario"}
          </Badge>

          <div className="text-6xl mb-3">{skin.image}</div>

          <h3 className="font-bold text-foreground mb-1">{skin.name}</h3>
          <p className="text-xs text-muted-foreground mb-3">{skin.description}</p>

          {owned ? (
            <Button
              onClick={onEquip}
              disabled={equipped}
              variant={equipped ? "secondary" : "default"}
              className="w-full"
              size="sm"
            >
              {equipped ? "Equipaggiato" : "Equipaggia"}
            </Button>
          ) : (
            <Button
              onClick={onPurchase}
              disabled={!canAfford || skin.price === 0}
              className="w-full"
              size="sm"
            >
              {skin.price === 0 ? (
                "Gratis"
              ) : canAfford ? (
                <>
                  <Coins className="w-4 h-4 mr-1" />
                  {skin.price}
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-1" />
                  {skin.price}
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Table Skin Card Component
function TableSkinCard({
  skin,
  owned,
  equipped,
  canAfford,
  onPurchase,
  onEquip,
  isAnimating,
}: {
  skin: TableSkin
  owned: boolean
  equipped: boolean
  canAfford: boolean
  onPurchase: () => void
  onEquip: () => void
  isAnimating: boolean
}) {
  return (
    <motion.div
      animate={isAnimating ? { scale: [1, 1.05, 1] } : {}}
      transition={{ duration: 0.3 }}
    >
      <Card className={`overflow-hidden transition-shadow ${RARITY_GLOW[skin.rarity]} ${equipped ? "ring-2 ring-primary" : ""}`}>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <Badge className={RARITY_COLORS[skin.rarity]}>
              {skin.rarity === "common" ? "Comune" : skin.rarity === "rare" ? "Raro" : skin.rarity === "epic" ? "Epico" : "Leggendario"}
            </Badge>
            {equipped && <Check className="w-5 h-5 text-primary" />}
          </div>

          <div
            className="w-full aspect-video rounded-lg mb-3 flex items-center justify-center relative overflow-hidden"
            style={{ backgroundColor: skin.background }}
          >
            {skin.pattern === "stars" && (
              <div className="absolute inset-0">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`,
                    }}
                  />
                ))}
              </div>
            )}
            <div className="w-12 h-6 bg-game-tile rounded border border-game-tile-dot/30" />
          </div>

          <h3 className="font-bold text-foreground mb-1">{skin.name}</h3>
          <p className="text-xs text-muted-foreground mb-3">{skin.description}</p>

          {owned ? (
            <Button
              onClick={onEquip}
              disabled={equipped}
              variant={equipped ? "secondary" : "default"}
              className="w-full"
              size="sm"
            >
              {equipped ? "Equipaggiato" : "Equipaggia"}
            </Button>
          ) : (
            <Button
              onClick={onPurchase}
              disabled={!canAfford || skin.price === 0}
              className="w-full"
              size="sm"
            >
              {skin.price === 0 ? (
                "Gratis"
              ) : canAfford ? (
                <>
                  <Coins className="w-4 h-4 mr-1" />
                  {skin.price}
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-1" />
                  {skin.price}
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Power Up Card Component
function PowerUpCard({
  powerUp,
  quantity,
  canAfford,
  onPurchase,
  isAnimating,
}: {
  powerUp: PowerUp
  quantity: number
  canAfford: boolean
  onPurchase: () => void
  isAnimating: boolean
}) {
  const icons = {
    peek: Eye,
    swap: RefreshCw,
    block: Ban,
    double_points: Star,
  }
  const Icon = icons[powerUp.effect]

  return (
    <motion.div
      animate={isAnimating ? { scale: [1, 1.05, 1] } : {}}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
            <Icon className="w-8 h-8 text-primary" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-foreground">{powerUp.name}</h3>
              {quantity > 0 && (
                <Badge variant="secondary" className="text-xs">
                  x{quantity}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{powerUp.description}</p>
          </div>

          <Button
            onClick={onPurchase}
            disabled={!canAfford}
            size="sm"
            className="shrink-0"
          >
            {canAfford ? (
              <>
                <Coins className="w-4 h-4 mr-1" />
                {powerUp.price}
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 mr-1" />
                {powerUp.price}
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}
