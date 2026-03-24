"use client"

import { useEffect } from "react"
import { useGameStore } from "@/lib/game-store"
import { TILE_SKINS } from "@/lib/game-store"

export function useTheme() {
  const { user } = useGameStore()

  useEffect(() => {
    if (!user) return

    const equippedSkin = TILE_SKINS.find(skin => skin.id === user.inventory.equippedTileSkin)
    if (!equippedSkin?.theme) return

    const theme = equippedSkin.theme

    // Applica i colori CSS personalizzati in modo elegante e selettivo
    const root = document.documentElement
    
    // Imposta le variabili CSS per l'interfaccia generale
    root.style.setProperty('--theme-primary', theme.primary)
    root.style.setProperty('--theme-secondary', theme.secondary)
    root.style.setProperty('--theme-surface', theme.surface)

    // Applica colori solo agli elementi specifici con selettività
    const applyThemeStyles = () => {
      // Applica solo a elementi con classi specifiche del tema
      const themedElements = document.querySelectorAll('[data-themed="true"], .themed-component')
      themedElements.forEach(el => {
        const element = el as HTMLElement
        element.style.setProperty('--theme-primary', theme.primary)
        element.style.setProperty('--theme-secondary', theme.secondary)
        element.style.setProperty('--theme-surface', theme.surface)
      })

      // Applica solo ai pulsanti con classi specifiche
      const themeButtons = document.querySelectorAll('.btn-themed, [class*="btn-primary"]')
      themeButtons.forEach(el => {
        const element = el as HTMLElement
        element.style.background = `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`
        element.style.borderColor = theme.primary
        element.style.color = '#ffffff'
      })

      // Applica solo alle card con classi specifiche
      const themeCards = document.querySelectorAll('.card-themed, [class*="card-themed"]')
      themeCards.forEach(el => {
        const element = el as HTMLElement
        element.style.backgroundColor = theme.surface
        element.style.borderColor = `${theme.primary}20`
        element.style.color = '#ffffff'
      })

      // Applica solo ai badge con classi specifiche
      const themeBadges = document.querySelectorAll('.badge-themed, [class*="badge-themed"]')
      themeBadges.forEach(el => {
        const element = el as HTMLElement
        element.style.backgroundColor = theme.primary
        element.style.color = '#ffffff'
      })

      // Applica solo ai titoli con classi specifiche
      const themeHeadings = document.querySelectorAll('.text-themed, [class*="text-themed"]')
      themeHeadings.forEach(el => {
        const element = el as HTMLElement
        element.style.color = theme.primary
      })

      // Applica solo ai link con classi specifiche
      const themeLinks = document.querySelectorAll('.link-themed, [class*="link-themed"]')
      themeLinks.forEach(el => {
        const element = el as HTMLElement
        element.style.color = theme.primary
      })
    }

    applyThemeStyles()

    // Aggiungi classe al body per identificare il tema
    document.body.className = document.body.className.replace(/theme-\w+/g, '') + ` theme-${equippedSkin.id}`

    // Aggiorna i colori quando il DOM cambia ma solo per elementi tematici
    const observer = new MutationObserver(() => {
      applyThemeStyles()
    })
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'data-themed']
    })

    // Pulizia quando il componente si smonta
    return () => {
      observer.disconnect()
      root.style.removeProperty('--theme-primary')
      root.style.removeProperty('--theme-secondary')
      root.style.removeProperty('--theme-surface')
      
      document.body.className = document.body.className.replace(/theme-\w+/g, '')
    }
  }, [user?.inventory.equippedTileSkin])
}
