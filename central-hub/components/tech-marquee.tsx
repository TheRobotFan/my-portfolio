"use client"

import { motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"

const techs = [
    "Next.js", "React", "TypeScript", "Node.js", "Python",
    "TailwindCSS", "Framer Motion", "PostgreSQL", "Supabase",
    "Docker", "AWS", "Git", "Neural Networks", "UI/UX Design",
    "Performance Optimization", "Microservices"
]

export function TechMarquee() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
    const mousePos = useRef({ x: 0, y: 0 })
    const isInside = useRef(false)

    useEffect(() => {
        let rafId: number
        const checkHover = () => {
            if (isInside.current) {
                // Find all elements under the current mouse position
                const elements = document.elementsFromPoint(mousePos.current.x, mousePos.current.y)
                let foundIndex: number | null = null
                
                for (const el of elements) {
                    const idx = el.getAttribute('data-tech-index')
                    if (idx !== null) {
                        foundIndex = parseInt(idx, 10)
                        break
                    }
                }
                
                setHoveredIndex(prev => prev !== foundIndex ? foundIndex : prev)
            }
            rafId = requestAnimationFrame(checkHover)
        }
        
        rafId = requestAnimationFrame(checkHover)
        return () => cancelAnimationFrame(rafId)
    }, [])

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mousePos.current = { x: e.clientX, y: e.clientY }
        }
        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    return (
        <section 
            className="relative py-24 overflow-hidden bg-black/40 backdrop-blur-xl border-y border-white/5"
            onMouseEnter={() => isInside.current = true}
            onMouseLeave={() => {
                isInside.current = false
                setHoveredIndex(null)
            }}
        >
            <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
            <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

            <div className="flex whitespace-nowrap">
                <motion.div
                    animate={{ x: "-50%" }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="flex items-center gap-16 md:gap-24 pr-16 md:pr-24"
                >
                    {[...techs, ...techs].map((tech, i) => {
                        const isHovered = hoveredIndex === i;
                        return (
                            <div
                                key={i}
                                data-tech-index={i}
                                className="flex items-center gap-4 cursor-default"
                            >
                                <span className={`text-4xl md:text-7xl font-black transition-all duration-300 uppercase tracking-tighter italic ${isHovered ? 'text-primary' : 'text-white/10'}`}>
                                    {tech}
                                </span>
                                <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${isHovered ? 'bg-primary' : 'bg-primary/20'}`} />
                            </div>
                        )
                    })}
                </motion.div>
            </div>
        </section>
    )
}
