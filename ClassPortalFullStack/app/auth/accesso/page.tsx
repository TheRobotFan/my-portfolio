"use client"

import type React from "react"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Lock, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function AccessoPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      alert("Login effettuato con successo!")
      setIsLoading(false)
      setEmail("")
      setPassword("")
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Accedi</h1>
            <p className="text-foreground/60">Entra nel portale della classe 1R</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="marco.leonardo@class.it"
                  required
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 gap-2">
              {isLoading ? "Accesso in corso..." : "Accedi"}
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-foreground/60 mb-4">Non hai un account?</p>
            <Link href="/auth/registrazione">
              <Button variant="outline" className="w-full bg-transparent">
                Registrati
              </Button>
            </Link>
          </div>

          <div className="mt-6 text-center text-sm text-foreground/50">
            <p>Demo: usa qualsiasi email e password</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
