"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ExternalLink, X, ChevronRight, Layers, Cpu, Zap, Trophy } from "lucide-react"
import Link from "next/link"
import React, { useEffect } from "react"
import { useLanguage } from "./providers/language-provider"

export interface CaseStudyData {
    title: string
    description: string
    icon: any
    href: string
    color: string
    challenge: string
    architecture: string
    techStack: string[]
    impact: string
}

interface CaseStudyModalProps {
    project: CaseStudyData | null
    isOpen: boolean
    onClose: () => void
}

export function CaseStudyModal({ project, isOpen, onClose }: CaseStudyModalProps) {
    const { t } = useLanguage()

    // Prevent scrolling on body when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "unset"
        }
        return () => {
            document.body.style.overflow = "unset"
        }
    }, [isOpen])

    if (!project) return null
    const Icon = project.icon

    return (
        <AnimatePresence>
            {isOpen && (
                <React.Fragment>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md cursor-pointer"
                    />

                    {/* Modal Container */}
                    <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 md:p-8 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative w-full max-w-4xl max-h-[90vh] bg-black/90 border border-white/10 rounded-[2rem] overflow-hidden flex flex-col pointer-events-auto"
                            // Stop propagation to prevent backdrop click closing the modal when clicking inside it
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header Gradient Line */}
                            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${project.color}`} />

                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors z-10"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Scrollable Content Area */}
                            <div className="overflow-y-auto no-scrollbar flex-grow">
                                {/* Hero Section */}
                                <div className="relative p-8 md:p-12 border-b border-white/5 overflow-hidden">
                                    <div className={`absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br ${project.color} opacity-10 blur-[100px] rounded-full pointer-events-none`} />

                                    <div className="flex flex-col md:flex-row gap-8 items-start md:items-center relative z-10">
                                        <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${project.color} p-5 shadow-2xl shrink-0`}>
                                            <Icon className="w-full h-full text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-2">
                                                {project.title}
                                            </h2>
                                            <p className="text-muted-foreground text-lg font-light max-w-2xl">
                                                {project.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Case Study Content Grid */}
                                <div className="p-8 md:p-12 space-y-12">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                        {/* Left Column */}
                                        <div className="space-y-12">
                                            {/* The Challenge */}
                                            <section className="space-y-4">
                                                <div className="flex items-center gap-3 text-white">
                                                    <Layers className="w-5 h-5 text-primary" />
                                                    <h3 className="text-xl font-bold tracking-tight">{t("modal_challenge")}</h3>
                                                </div>
                                                <p className="text-muted-foreground font-light leading-relaxed">
                                                    {project.challenge}
                                                </p>
                                            </section>

                                            {/* The Architecture */}
                                            <section className="space-y-4">
                                                <div className="flex items-center gap-3 text-white">
                                                    <Cpu className="w-5 h-5 text-primary" />
                                                    <h3 className="text-xl font-bold tracking-tight">{t("modal_architecture")}</h3>
                                                </div>
                                                <p className="text-muted-foreground font-light leading-relaxed">
                                                    {project.architecture}
                                                </p>
                                            </section>
                                        </div>

                                        {/* Right Column */}
                                        <div className="space-y-12">
                                            {/* Tech Stack */}
                                            <section className="space-y-4">
                                                <div className="flex items-center gap-3 text-white">
                                                    <Zap className="w-5 h-5 text-primary" />
                                                    <h3 className="text-xl font-bold tracking-tight">{t("modal_tech")}</h3>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {project.techStack.map((tech) => (
                                                        <span
                                                            key={tech}
                                                            className="px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-xs text-white/80 font-mono"
                                                        >
                                                            {tech}
                                                        </span>
                                                    ))}
                                                </div>
                                            </section>

                                            {/* Impact */}
                                            <section className="space-y-4">
                                                <div className="flex items-center gap-3 text-white">
                                                    <Trophy className="w-5 h-5 text-primary" />
                                                    <h3 className="text-xl font-bold tracking-tight">{t("modal_impact")}</h3>
                                                </div>
                                                <p className="text-muted-foreground font-light leading-relaxed">
                                                    {project.impact}
                                                </p>
                                            </section>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Footer */}
                            <div className="p-6 border-t border-white/5 bg-black/50 backdrop-blur-xl flex justify-between items-center shrink-0">
                                <span className="text-xs uppercase tracking-[0.2em] font-bold text-muted-foreground">{t("modal_label")}</span>
                                <Link
                                    href={project.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-bold uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all outline-none"
                                >
                                    {t("modal_visit")}
                                    <ExternalLink className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                                </Link>
                            </div>

                        </motion.div>
                    </div>
                </React.Fragment>
            )}
        </AnimatePresence>
    )
}
