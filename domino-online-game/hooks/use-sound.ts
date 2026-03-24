import { useState, useEffect } from "react"

type SoundEffect = {
  play: () => void
  stop: () => void
}

export function useSound(src: string, { volume = 1 } = {}): [() => void, SoundEffect] {
  // Temporarily disabled to prevent NotSupportedError
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    // Only run on client-side
    if (typeof window !== 'undefined' && false) { // Disabled for now
      const audioElement = new Audio(src)
      audioElement.volume = volume
      setAudio(audioElement)

      // Cleanup on unmount
      return () => {
        audioElement.pause()
        audioElement.remove()
      }
    }
  }, [src, volume])

  const play = () => {
    if (!audio) return

    // Reset the audio to the beginning if it's already playing
    if (isPlaying) {
      audio.currentTime = 0
    } else {
      audio.play().then(() => {
        setIsPlaying(true)
      })
    }
  }

  const stop = () => {
    if (!audio) return
    audio.pause()
    audio.currentTime = 0
    setIsPlaying(false)
  }

  // Handle when the audio finishes playing
  useEffect(() => {
    if (!audio) return

    const handleEnded = () => setIsPlaying(false)
    audio.addEventListener('ended', handleEnded)
    return () => {
      audio.removeEventListener('ended', handleEnded)
    }
  }, [audio])

  return [play, { play, stop }]
}
