"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { BookOpen, LogOut, Plus, Menu, X } from "lucide-react"
import { useState } from "react"
import type { User } from "@supabase/supabase-js"

interface NavbarProps {
  user: User | null
}

export function Navbar({ user }: NavbarProps) {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const displayName = user?.user_metadata?.name || user?.email?.split("@")[0] || "Utente"

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="font-serif text-xl font-semibold text-foreground">MyDigitalDiary</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-4 md:flex">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-foreground">
                Dashboard
              </Button>
            </Link>
            <Link href="/diary/new">
              <Button variant="ghost" className="text-foreground">
                <Plus className="mr-2 h-4 w-4" />
                Nuovo Diario
              </Button>
            </Link>
            <div className="ml-4 flex items-center gap-3 border-l border-border pl-4">
              <ThemeToggle />
              <span className="text-sm text-muted-foreground">Ciao, {displayName}</span>
              <Button variant="outline" size="sm" onClick={handleLogout} className="bg-transparent">
                <LogOut className="mr-2 h-4 w-4" />
                Esci
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-foreground" />
              ) : (
                <Menu className="h-6 w-6 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="border-t border-border py-4 md:hidden">
            <div className="flex flex-col gap-2">
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-foreground">
                  Dashboard
                </Button>
              </Link>
              <Link href="/diary/new" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-foreground">
                  <Plus className="mr-2 h-4 w-4" />
                  Nuovo Diario
                </Button>
              </Link>
              <div className="mt-2 border-t border-border pt-2">
                <p className="mb-2 px-4 text-sm text-muted-foreground">Ciao, {displayName}</p>
                <Button variant="outline" size="sm" onClick={handleLogout} className="ml-4 bg-transparent">
                  <LogOut className="mr-2 h-4 w-4" />
                  Esci
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
