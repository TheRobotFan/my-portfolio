"use client"

import { useEffect, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

export function CustomCursor() {
    const [mounted, setMounted] = useState(false)
    const [isHovered, setIsHovered] = useState(false)
    const [isTyping, setIsTyping] = useState(false)
    const [isVisible, setIsVisible] = useState(false)
    const mouseX = useMotionValue(-100)
    const mouseY = useMotionValue(-100)

    const springConfig = { damping: 25, stiffness: 250 }
    const cursorX = useSpring(mouseX, springConfig)
    const cursorY = useSpring(mouseY, springConfig)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX)
            mouseY.set(e.clientY)
            if (!isVisible) setIsVisible(true)

            const target = e.target as HTMLElement
            const isClickable = target.closest('a') || target.closest('button') || target.closest('.cursor-pointer')
            const isTextInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable

            setIsHovered(!!isClickable)
            setIsTyping(!!isTextInput)
        }

        const handleMouseLeave = () => setIsVisible(false)
        const handleMouseEnter = () => setIsVisible(true)

        window.addEventListener("mousemove", handleMouseMove)
        document.addEventListener("mouseleave", handleMouseLeave)
        document.addEventListener("mouseenter", handleMouseEnter)

        return () => {
            window.removeEventListener("mousemove", handleMouseMove)
            document.removeEventListener("mouseleave", handleMouseLeave)
            document.removeEventListener("mouseenter", handleMouseEnter)
        }
    }, [mouseX, mouseY, isVisible])

    if (!mounted) return null

    return (
        <>
            {/* Main Outer Ring */}
            <motion.div
                className="fixed top-0 left-0 w-10 h-10 border border-primary/50 rounded-full z-[9999] pointer-events-none mix-blend-difference hidden md:block"
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: "-50%",
                    translateY: "-50%",
                    scale: isHovered ? 1.5 : (isTyping ? 0.3 : 1),
                    scaleX: isTyping ? 0.05 : 1,
                    scaleY: isTyping ? 1.4 : 1,
                    opacity: isVisible ? 1 : 0,
                    backgroundColor: isHovered ? "hsla(190, 100%, 50%, 0.2)" : (isTyping ? "hsl(190 100% 50%)" : "transparent"),
                    border: isTyping ? "none" : "1.5px solid hsl(190 100% 50%)",
                    borderRadius: isTyping ? "1px" : "9999px",
                    filter: "drop-shadow(0 0 4px hsl(190 100% 50%)) drop-shadow(0 0 15px hsl(190 100% 50%)) drop-shadow(0 0 30px hsla(190, 100%, 60%, 0.6))",
                }}
                animate={isTyping ? {
                    opacity: [1, 0.4, 1],
                } : {}}
                transition={isTyping ? {
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                } : {}}
            />
            {/* Central Dot */}
            <motion.div
                className="fixed top-0 left-0 w-1.5 h-1.5 bg-primary rounded-full z-[10000] pointer-events-none hidden md:block"
                style={{
                    x: mouseX,
                    y: mouseY,
                    translateX: "-50%",
                    translateY: "-50%",
                    scale: (isHovered || isTyping) ? 0 : 1,
                    opacity: isVisible ? 1 : 0,
                    backgroundColor: "hsl(190 100% 50%)",
                    boxShadow: "0 0 10px hsl(190 100% 50%)",
                }}
            />
        </>
    )
}
