"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { resolvedTheme, setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  console.log("[v0] ThemeToggle - mounted:", mounted, "theme:", theme, "resolvedTheme:", resolvedTheme)

  const handleToggle = () => {
    const newTheme = resolvedTheme === "dark" ? "light" : "dark"
    console.log("[v0] ThemeToggle - switching from", resolvedTheme, "to", newTheme)
    setTheme(newTheme)
  }

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full"
        aria-label="Cambia tema"
      >
        <span className="h-5 w-5" />
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      className="rounded-full"
      aria-label="Cambia tema"
    >
      {resolvedTheme === "dark" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
      <span className="sr-only">Cambia tema</span>
    </Button>
  )
}
