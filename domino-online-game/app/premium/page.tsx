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
  Star,
  Sparkles,
  Gem,
  Coins,
  Shield,
  Zap,
  Trophy,
  Gift,
  Target,
  Heart,
  CheckCircle,
  CreditCard
} from "lucide-react"

export default function PremiumPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  
  const { user, premiumPlans, purchasePremium } = useAuthStore()
  const router = useRouter()

  const handlePurchase = async (planId: string) => {
    if (!user) {
      router.push("/auth")
      return
    }

    setSelectedPlan(planId)
    setIsProcessing(true)

    try {
      await purchasePremium(planId)
      router.push("/")
    } catch (error) {
      console.error("Purchase failed:", error)
    } finally {
      setIsProcessing(false)
      setSelectedPlan(null)
    }
  }

  const isPremium = user?.isPremium || false

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
            {isPremium && (
              <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white">
                <Crown className="w-3 h-3 mr-1" />
                Premium
              </Badge>
            )}
          </div>
        </motion.div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-flex items-center gap-2 mb-4"
          >
            <Crown className="w-12 h-12 text-amber-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
              DOMINO PREMIUM
            </h1>
            <Crown className="w-12 h-12 text-amber-400" />
          </motion.div>
          <p className="text-xl text-foreground/80 mb-6">
            Sblocca l'esperienza di gioco completa
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-foreground/60">
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Senza pubblicità</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400" />
              <span>Contenuti esclusivi</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield className="w-4 h-4 text-blue-400" />
              <span>Supporto prioritario</span>
            </div>
          </div>
        </motion.div>

        {/* Pricing Plans */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {premiumPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`relative overflow-hidden ${
                plan.id === 'yearly' 
                  ? 'bg-gradient-to-br from-amber-900/20 to-amber-800/20 border-amber-700/50' 
                  : 'bg-card/80 backdrop-blur-sm border-border/50'
              }`}>
                {plan.id === 'yearly' && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-3 py-1 text-sm font-bold rounded-bl-lg">
                    POPOLARE
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold text-foreground">
                    {plan.name}
                  </CardTitle>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-3xl font-bold text-foreground">€{plan.price}</span>
                    <span className="text-foreground/60">/{plan.duration === 30 ? 'mese' : 'anno'}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Instant rewards */}
                  <div className="flex items-center justify-center gap-4 p-3 rounded-lg bg-black/30">
                    <div className="flex items-center gap-2">
                      <Coins className="w-6 h-6 text-yellow-400" />
                      <span className="font-semibold text-yellow-400">
                        {plan.coins.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Gem className="w-6 h-6 text-cyan-400" />
                      <span className="font-semibold text-cyan-400">
                        {plan.gems}
                      </span>
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="space-y-3">
                    {plan.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                        <span className="text-foreground/80 text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Button
                    onClick={() => handlePurchase(plan.id)}
                    disabled={isPremium || isProcessing || selectedPlan === plan.id}
                    className={`w-full h-12 text-lg ${
                      plan.id === 'yearly'
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700'
                        : ''
                    }`}
                  >
                    {isProcessing && selectedPlan === plan.id ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
                      />
                    ) : isPremium ? (
                      "Già Attivo"
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5 mr-2" />
                        Acquista Ora
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          {[
            {
              icon: <Trophy className="w-8 h-8 text-yellow-400" />,
              title: "Eventi Esclusivi",
              description: "Accesso prioritario a tornei speciali",
              color: "text-yellow-400"
            },
            {
              icon: <Sparkles className="w-8 h-8 text-purple-400" />,
              title: "Avatar Leggendari",
              description: "Sblocca avatar unici e personalizzati",
              color: "text-purple-400"
            },
            {
              icon: <Shield className="w-8 h-8 text-blue-400" />,
              title: "Supporto Prioritario",
              description: "Assistenza dedicata 24/7",
              color: "text-blue-400"
            },
            {
              icon: <Zap className="w-8 h-8 text-green-400" />,
              title: "Statistiche Avanzate",
              description: "Analisi dettagliate e statistiche",
              color: "text-green-400"
            },
            {
              icon: <Target className="w-8 h-8 text-red-400" />,
              title: "Obiettivi Speciali",
              description: "Obiettivi stagionali con ricompense extra",
              color: "text-red-400"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.05 }}
            >
              <Card className="bg-card/60 backdrop-blur-sm border-border/30 h-full">
                <CardContent className="p-6 text-center">
                  <div className={`w-12 h-12 ${feature.color} mx-auto mb-3 flex items-center justify-center`}>
                  {feature.icon}
                </div>
                  <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-foreground/60">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <Card className="bg-card/60 backdrop-blur-sm border-border/30">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">Domande Frequenti</h2>
              <p className="text-foreground/60 mb-4">
                Hai dubbi? Contatta il nostro supporto per assistenza
              </p>
              <Button variant="outline" className="border-amber-700/50 text-amber-400 hover:bg-amber-800/20">
                Supporto
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
