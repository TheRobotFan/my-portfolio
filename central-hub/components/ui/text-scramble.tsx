"use client"

import React, { useEffect, useState, useCallback, useRef } from "react"

const chars = "!<>-_\\/[]{}—=+*^?#________"

interface TextScrambleProps {
    text: string
    autostart?: boolean
    className?: string
    delay?: number
    loop?: boolean
}

interface CharState {
    char: string
    isScrambled: boolean
}

export const TextScramble = ({ text, autostart = true, className, delay = 1000, loop = false }: TextScrambleProps) => {
    const [charStates, setCharStates] = useState<CharState[]>(
        text.split("").map(c => ({ char: c, isScrambled: false }))
    )
    const isAnimating = useRef(false)
    const frameRef = useRef(0)
    const timerRef = useRef<NodeJS.Timeout | null>(null)
    const textRef = useRef(text)
    const mountedRef = useRef(true)

    useEffect(() => {
        mountedRef.current = true
        return () => {
            mountedRef.current = false
        }
    }, [])

    // Keep textRef in sync
    useEffect(() => {
        textRef.current = text
        setCharStates(text.split("").map(c => ({ char: c, isScrambled: false })))
    }, [text])

    const scramble = useCallback(() => {
        if (isAnimating.current || !mountedRef.current) return
        isAnimating.current = true

        const targetText = textRef.current
        const length = targetText.length
        const queue: { to: string; start: number; end: number; currentScrambleChar: string }[] = []

        for (let i = 0; i < length; i++) {
            const start = Math.floor(Math.random() * 40)
            const end = start + Math.floor(Math.random() * 60)
            queue.push({ to: targetText[i], start, end, currentScrambleChar: "" })
        }

        let frame = 0
        const update = () => {
            if (!mountedRef.current) return

            const nextStates: CharState[] = []
            let completeCount = 0

            for (let i = 0; i < length; i++) {
                const item = queue[i]
                if (frame >= item.end) {
                    completeCount++
                    nextStates.push({ char: item.to, isScrambled: false })
                } else if (frame >= item.start) {
                    if (!item.currentScrambleChar || Math.random() < 0.28) {
                        item.currentScrambleChar = chars[Math.floor(Math.random() * chars.length)]
                    }
                    nextStates.push({ char: item.currentScrambleChar, isScrambled: true })
                } else {
                    nextStates.push({ char: targetText[i] || " ", isScrambled: false })
                }
            }

            setCharStates(nextStates)

            if (completeCount === length) {
                isAnimating.current = false
                // Force sync final state
                setCharStates(targetText.split("").map(c => ({ char: c, isScrambled: false })))

                if (loop) {
                    timerRef.current = setTimeout(() => {
                        if (mountedRef.current) scramble()
                    }, 3000)
                }
            } else {
                frame++
                frameRef.current = requestAnimationFrame(update)
            }
        }
        update()
    }, [loop])

    useEffect(() => {
        if (autostart) {
            timerRef.current = setTimeout(scramble, delay)
        }
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current)
            if (frameRef.current) cancelAnimationFrame(frameRef.current)
        }
    }, [autostart, scramble, delay])

    return (
        <span className={className} onMouseEnter={scramble}>
            {charStates.map((state, i) => (
                <span
                    key={`${text}-${i}`}
                    className={state.isScrambled ? "text-primary opacity-50 font-playfair italic" : ""}
                >
                    {state.char}
                </span>
            ))}
        </span>
    )
}
