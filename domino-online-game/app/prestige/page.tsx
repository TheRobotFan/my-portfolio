"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuthStore } from "@/lib/auth-store"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Crown,
  Sparkles,
  Star,
  Zap,
  Gem,
  Gift,
  Trophy,
  Flame,
  Shield,
  Target,
  Eye,
  Heart,
  Diamond,
  Infinity,
  Snowflake,
  Sun
} from "lucide-react"

export default function PrestigePage() {
  const [selectedCategory, setSelectedCategory] = useState<'prestige' | 'elite' | 'seasonal'>('prestige')
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [isPurchasing, setIsPurchasing] = useState(false)
  
  const { user, purchaseCosmetic } = useAuthStore()
  const router = useRouter()

  const handlePurchase = async (item: any) => {
    if (!user) {
      router.push("/auth")
      return
    }

    setSelectedItem(item.id)
    setIsPurchasing(true)

    try {
      await purchaseCosmetic(item.id, item.price)
    } catch (error) {
      console.error("Purchase failed:", error)
    } finally {
      setIsPurchasing(false)
      setSelectedItem(null)
    }
  }

  const prestigeItems = [
    {
      id: 'prestige_1',
      name: 'Aura Dorata',
      description: 'Cornice dorata animata con particelle luminose',
      price: 150,
      rarity: 'legendary',
      category: 'frames',
      icon: <Crown className="w-8 h-8 text-yellow-400" />,
      owned: false
    },
    {
      id: 'prestige_2', 
      name: 'Tessere Cristallo',
      description: 'Set di tessere con effetto cristallo trasparente',
      price: 200,
      rarity: 'legendary',
      category: 'tiles',
      icon: <Diamond className="w-8 h-8 text-cyan-400" />,
      owned: false
    },
    {
      id: 'prestige_3',
      name: 'Badge Infinito',
      description: 'Badge profilo con simbolo infinito animato',
      price: 100,
      rarity: 'epic',
      category: 'badges',
      icon: <Infinity className="w-8 h-8 text-purple-400" />,
      owned: false
    },
    {
      id: 'prestige_4',
      name: 'Skin Elettrica',
      description: 'Skin con effetti elettrici e fulmini',
      price: 400,
      rarity: 'legendary',
      category: 'skins',
      icon: <Zap className="w-8 h-8 text-blue-400" />,
      owned: false
    },
    {
      id: 'prestige_5',
      name: 'Aura Fiamma',
      description: 'Cornice con effetto fiamma danzante',
      price: 300,
      rarity: 'epic',
      category: 'frames',
      icon: <Flame className="w-8 h-8 text-orange-400" />,
      owned: false
    },
    {
      id: 'prestige_6',
      name: 'Badge Stelle',
      description: 'Badge con stelle scintillanti',
      price: 80,
      rarity: 'rare',
      category: 'badges',
      icon: <Star className="w-8 h-8 text-yellow-300" />,
      owned: false
    }
  ]

  const eliteItems = [
    {
      id: 'elite_1',
      name: 'Cornice Platino',
      description: 'Cornice platino con effetto metallico',
      price: 600,
      rarity: 'legendary',
      category: 'frames',
      icon: <Shield className="w-8 h-8 text-gray-300" />,
      owned: false
    },
    {
      id: 'elite_2',
      name: 'Tessere Ombra',
      description: 'Set tessere con effetto ombra misteriosa',
      price: 800,
      rarity: 'legendary',
      category: 'tiles',
      icon: <Eye className="w-8 h-8 text-purple-500" />,
      owned: false
    },
    {
      id: 'elite_3',
      name: 'Badge Drago',
      description: 'Badge con drago animato',
      price: 1000,
      rarity: 'legendary',
      category: 'badges',
      icon: <Flame className="w-8 h-8 text-red-500" />,
      owned: false
    },
    {
      id: 'elite_4',
      name: 'Skin Cosmica',
      description: 'Skin con effetti cosmici e galattici',
      price: 750,
      rarity: 'legendary',
      category: 'skins',
      icon: <Sparkles className="w-8 h-8 text-purple-400" />,
      owned: false
    }
  ]

  const seasonalItems = [
    {
      id: 'seasonal_1',
      name: 'Cornice Invernale',
      description: 'Cornice con neve e ghiaccio animati',
      price: 200,
      rarity: 'epic',
      category: 'frames',
      icon: <Snowflake className="w-8 h-8 text-blue-300" />,
      owned: false,
      seasonal: true
    },
    {
      id: 'seasonal_2',
      name: 'Tessere Estive',
      description: 'Set tessere con effetti estivi',
      price: 250,
      rarity: 'epic',
      category: 'tiles',
      icon: <Sun className="w-8 h-8 text-yellow-500" />,
      owned: false,
      seasonal: true
    }
  ]

  const getItemsByCategory = () => {
    switch (selectedCategory) {
      case 'prestige': return prestigeItems
      case 'elite': return eliteItems
      case 'seasonal': return seasonalItems
      default: return prestigeItems
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'rare': return 'from-blue-500 to-blue-600'
      case 'epic': return 'from-purple-500 to-purple-600'
      case 'legendary': return 'from-amber-500 to-amber-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'rare': return 'border-blue-500/50'
      case 'epic': return 'border-purple-500/50'
      case 'legendary': return 'border-amber-500/50'
      default: return 'border-gray-500/50'
    }
  }

  return (
    <div className="min-h-screen bg-game-table">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 right-20 opacity-20"
        >
          <Crown className="w-48 h-48 text-amber-400" />
        </motion.div>
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 left-20 opacity-20"
        >
          <Gem className="w-48 h-48 text-cyan-400" />
        </motion.div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-between mb-8"
        >
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

          <div className="flex items-center gap-2">
            <Badge className="bg-gradient-to-r from-purple-500 to-amber-500 text-white">
              Prestige
            </Badge>
            {user && (
              <div className="flex items-center gap-1 bg-black/30 rounded-full px-3 py-1 backdrop-blur-sm">
                <Gem className="w-4 h-4 text-cyan-400" />
                <span className="text-cyan-400 font-bold">{user.inventory?.gems || 0}</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-flex items-center gap-2 mb-4"
          >
            <Crown className="w-12 h-12 text-amber-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-400 to-purple-400 bg-clip-text text-transparent">
              PRESTIGE
            </h1>
            <Crown className="w-12 h-12 text-amber-400" />
          </motion.div>
          <p className="text-xl text-foreground/80 mb-4">
            Cosmetici esclusivi per distinguerti
          </p>
          <p className="text-sm text-foreground/60 italic">
            "Chi compra vuole farsi vedere, non vincere"
          </p>
        </motion.div>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-6 justify-center">
          {[
            { id: 'prestige', label: 'Prestige', icon: Crown },
            { id: 'elite', label: 'Elite', icon: Diamond },
            { id: 'seasonal', label: 'Stagionali', icon: Star }
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={selectedCategory === tab.id ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(tab.id as any)}
              className="flex items-center gap-2"
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Items Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {getItemsByCategory().map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`bg-gradient-to-br ${getRarityColor(item.rarity)} bg-opacity-10 border-opacity-30 overflow-hidden h-full relative ${
                item.owned ? 'ring-2 ring-green-500/50' : ''
              }`}>
                {item.seasonal && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-green-500 text-white text-xs">
                      STAGIONALE
                    </Badge>
                  </div>
                )}
                
                <CardContent className="p-6">
                  <div className="flex items-center justify-center mb-4">
                    <div className={`p-4 rounded-full bg-gradient-to-r ${getRarityColor(item.rarity)} bg-opacity-20`}>
                      {item.icon}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-foreground mb-2 text-center">
                    {item.name}
                  </h3>
                  <p className="text-foreground/80 text-sm text-center mb-4">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Gem className="w-5 h-5 text-cyan-400" />
                    <span className="text-2xl font-bold text-cyan-400">{item.price}</span>
                  </div>
                  
                  <Button
                    onClick={() => handlePurchase(item)}
                    disabled={item.owned || isPurchasing || (!user)}
                    className={`w-full ${
                      item.owned 
                        ? 'bg-green-500 hover:bg-green-600' 
                        : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600'
                    }`}
                  >
                    {isPurchasing && selectedItem === item.id ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
                      />
                    ) : item.owned ? (
                      "Posseduto"
                    ) : !user ? (
                      "Accedi per Acquistare"
                    ) : (
                      "Acquista"
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <Card className="bg-card/60 backdrop-blur-sm border-border/30">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Informazioni Prestige</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold text-amber-400 mb-2">Raro</h4>
                  <p className="text-foreground/60">80-150 gemme</p>
                  <p className="text-foreground/60">Effetti semplici</p>
                </div>
                <div>
                  <h4 className="font-semibold text-purple-400 mb-2">Epico</h4>
                  <p className="text-foreground/60">200-400 gemme</p>
                  <p className="text-foreground/60">Animazioni complesse</p>
                </div>
                <div>
                  <h4 className="font-semibold text-amber-400 mb-2">Leggendario</h4>
                  <p className="text-foreground/60">600-1000 gemme</p>
                  <p className="text-foreground/60">Effetti unici</p>
                </div>
              </div>
              <p className="text-xs text-foreground/60 mt-4">
                I cosmetici sono solo per stile - non danno vantaggi nel gioco
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
