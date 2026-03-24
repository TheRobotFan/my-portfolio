"use client"

import React, { useEffect, useRef } from "react"
import { motion } from "framer-motion"

export const BackgroundBeams = () => {
    const beamsRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const moveBeams = (e: MouseEvent) => {
            if (!beamsRef.current) return
            const { clientX, clientY } = e
            const x = clientX - window.innerWidth / 2
            const y = clientY - window.innerHeight / 2

            beamsRef.current.style.transform = `translate(${x * 0.05}px, ${y * 0.05}px)`
        }

        window.addEventListener("mousemove", moveBeams)
        return () => window.removeEventListener("mousemove", moveBeams)
    }, [])

    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[#020205]">
            <div ref={beamsRef} className="absolute inset-0 transition-transform duration-1000 ease-out">
                {/* Aurora Layer 1 - Cyan */}
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-cyan-500/15 rounded-full blur-[160px] animate-pulse" />

                {/* Aurora Layer 2 - Violet */}
                <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-violet-600/15 rounded-full blur-[180px] animate-pulse [animation-delay:2s]" />

                {/* Aurora Layer 3 - Emerald */}
                <div className="absolute top-[20%] right-[20%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse [animation-delay:4s]" />

                {/* Pulsating Core */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-primary/5 rounded-full blur-[200px] animate-breathe" />
            </div>

            {/* Fine Grain Overlay for Dithering (Fixes Banding) */}
            <div
                className="absolute inset-0 opacity-[0.15] mix-blend-soft-light"
                style={{
                    backgroundImage: `url("https://grainy-gradients.vercel.app/noise.svg")`,
                    filter: 'contrast(150%) brightness(100%)'
                }}
            />
        </div>
    )

}
