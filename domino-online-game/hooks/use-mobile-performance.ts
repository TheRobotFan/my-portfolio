import { useEffect, useState } from 'react'

export function useMobilePerformance() {
  const [isMobile, setIsMobile] = useState(false)
  const [isLowEnd, setIsLowEnd] = useState(false)

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth
      const isMobileDevice = width < 768
      
      setIsMobile(isMobileDevice)
      
      // Detect low-end devices
      const connection = (navigator as any).connection
      const isSlowConnection = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g')
      const isLowMemory = (navigator as any).deviceMemory && (navigator as any).deviceMemory < 4
      
      setIsLowEnd(isMobileDevice && (isSlowConnection || isLowMemory))
    }

    checkDevice()
    window.addEventListener('resize', checkDevice)
    
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  return {
    isMobile,
    isLowEnd,
    shouldReduceAnimations: isMobile || isLowEnd,
    shouldDisableParticles: isMobile,
    shouldDisableMouseTracking: isMobile,
    animationDuration: isLowEnd ? 0.05 : isMobile ? 0.1 : 0.2,
    particleCount: isMobile ? 0 : isLowEnd ? 3 : 8
  }
}
