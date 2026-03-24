"use client"

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { ExternalLink, Shield, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import React, { MouseEvent, useState } from "react"

interface ProjectCardProps {
    title: string
    description: string
    icon: any
    href: string
    port: number
    color: string
    index: number
    className?: string
    onClick?: () => void
}

export function ProjectCard({ title, description, icon: Icon, href, port, color, index, className, onClick }: ProjectCardProps) {
    const [isHovered, setIsHovered] = useState(false)
    const x = useMotionValue(0)
    const y = useMotionValue(0)

    const mouseXSpring = useSpring(x)
    const mouseYSpring = useSpring(y)

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"])
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"])

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const width = rect.width
        const height = rect.height
        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top
        const xPct = mouseX / width - 0.5
        const yPct = mouseY / height - 0.5
        x.set(xPct)
        y.set(yPct)

        // Update local hover state for the beam effect
        const beamX = (mouseX / width) * 100
        const beamY = (mouseY / height) * 100
        e.currentTarget.style.setProperty("--x", `${beamX}%`)
        e.currentTarget.style.setProperty("--y", `${beamY}%`)
    }

    const handleMouseLeave = () => {
        x.set(0)
        y.set(0)
        setIsHovered(false)
    }

    const shapeStyles = [
        { borderRadius: "80px 200px 80px 200px" }, // Giant Leaf
        { borderRadius: "10% 90% 10% 90% / 50% 100% 50% 100%" }, // Crescent / Sharp Sweep
        { borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%" }, // Ergonomic Egg
        { borderRadius: "200px 40px 200px 40px" }, // Reverse Giant Leaf
        { borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%" }, // Organic Blob 1
        { borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%" }, // Morphing Blob 2
        { borderRadius: "0px 150px 0px 150px" }, // Mirrored Soft Slice (Domino Online)
        { borderRadius: "100px 100px 100px 100px" }, // Perfect Pill 
    ]

    const customShape = shapeStyles[index % shapeStyles.length];

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05, duration: 0.8, ease: "easeOut" }}
            className={className}
        >
            <div onClick={onClick} className="group block h-full cursor-pointer">
                <motion.div
                    onMouseMove={handleMouseMove}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={handleMouseLeave}
                    style={{
                        rotateX,
                        rotateY,
                        borderRadius: customShape.borderRadius,
                        transformStyle: "preserve-3d",
                        perspective: "1000px"
                    }}
                    className={`relative h-full bg-white/[0.02] border border-white/10 overflow-hidden transition-all duration-500 hover:border-primary/50 hover:bg-white/[0.04] shadow-2xl`}
                >
                    {/* Decorative abstract circles for the "luna e cerchi" vibe */}
                    <div className="absolute -top-20 -right-20 w-64 h-64 border-[40px] border-white/5 rounded-full pointer-events-none group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 border-[20px] border-primary/10 rounded-full pointer-events-none group-hover:scale-150 transition-transform duration-700" />

                    {/* Beam Effect Container */}
                    <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                        style={{
                            background: `radial-gradient(circle at var(--x, 50%) var(--y, 50%), rgba(255,255,255,0.08) 0%, transparent 60%)`
                        }}
                    />

                    <div className="relative h-full p-10 flex flex-col items-start gap-6">
                        <div
                            style={{ transform: "translateZ(50px)" }}
                            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} p-3.5 shadow-xl group-hover:scale-110 transition-transform duration-500`}
                        >
                            <Icon className="w-full h-full text-white" />
                        </div>

                        <div className="space-y-3 flex-grow" style={{ transform: "translateZ(30px)" }}>
                            <h3 className="text-2xl font-bold tracking-tight group-hover:text-primary transition-colors">
                                {title}
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed font-light line-clamp-3">
                                {description}
                            </p>
                        </div>

                        <div
                            style={{ transform: "translateZ(20px)" }}
                            className="w-full flex items-center justify-between pt-8 mt-auto border-t border-white/5"
                        >
                            <div className="flex items-center gap-2.5 px-4 py-1.5 bg-white/5 rounded-full border border-white/5">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
                                    Port {port}
                                </span>
                            </div>

                            <motion.div
                                animate={{ x: isHovered ? 0 : 10, opacity: isHovered ? 1 : 0 }}
                                className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest"
                            >
                                Deploy
                                <ArrowUpRight className="w-4 h-4" />
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    )
}
