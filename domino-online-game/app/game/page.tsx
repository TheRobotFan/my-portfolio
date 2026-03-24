"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import GamePageMobile from "./page-mobile"
import GamePageDesktop from "./page-desktop"

// Detect if we're on mobile
const isMobile = () => {
  if (typeof window === 'undefined') return false
  return window.innerWidth < 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

export default function GamePage() {
  const searchParams = useSearchParams()
  
  useEffect(() => {
    // No redirect needed - we'll render the appropriate component directly
  }, [])

  // Render the appropriate version based on device
  return isMobile() ? <GamePageMobile /> : <GamePageDesktop />
}
