"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Send, User, Mail, MessageSquare, Sparkles, X, CheckCircle2, AlertCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { useLanguage } from "./providers/language-provider"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { submitContactForm } from "@/actions/contact"
import { contactSchema, ContactFormData } from "@/lib/validations/contact"

interface ContactFormProps {
    isOpen: boolean
    onClose: () => void
}

export function ContactForm({ isOpen, onClose }: ContactFormProps) {
    const { t } = useLanguage()
    const [isSuccess, setIsSuccess] = useState(false)
    const [serverError, setServerError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
        defaultValues: { name: "", email: "", message: "", policy: false }
    })
    const { register: registerTrap, getValues: getTrapValues } = useForm<{ _trap: string }>({
        defaultValues: { _trap: "" }
    })

    // Disable scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden"
            setIsSuccess(false)
            setServerError(null)
            reset()
        } else {
            document.body.style.overflow = "unset"
        }
        return () => {
            document.body.style.overflow = "unset"
        }
    }, [isOpen, reset])

    const onSubmit = async (data: ContactFormData) => {
        setServerError(null)
        try {
            // Merge honeypot field into form data for server-side check
            const result = await submitContactForm({ ...data, _trap: getTrapValues()._trap })
            if (result.success) {
                setIsSuccess(true)
                setTimeout(() => {
                    onClose()
                }, 3000)
            } else {
                setServerError(result.message || "Transmission failed.")
            }
        } catch (error) {
            setServerError("An unexpected anomaly occurred.")
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 md:p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-xl"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-4xl glass-morphism p-8 md:p-12 rounded-[2.5rem] overflow-hidden"
                    >
                        {/* Background accents */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-20 pointer-events-none">
                            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 blur-[120px] rounded-full" />
                            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 blur-[120px] rounded-full" />
                        </div>

                        {/* Close Button */}
                        <motion.button
                            onClick={(e) => {
                                e.stopPropagation();
                                onClose();
                            }}
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                            className="absolute top-8 right-8 p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white z-[50]"
                        >
                            <X className="w-6 h-6" />
                        </motion.button>

                        <div className="relative z-10 min-h-[400px] flex flex-col justify-center">
                            <AnimatePresence mode="wait">
                                {!isSuccess ? (
                                    <motion.div
                                        key="form"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20, transition: { duration: 0.3 } }}
                                    >
                                        <div className="text-center mb-10">
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6"
                                            >
                                                <Sparkles className="w-4 h-4 text-primary" />
                                                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground">{t("contact_badge")}</span>
                                            </motion.div>
                                            <h2 className="text-4xl md:text-5xl font-black mb-4">
                                                {t("contact_title")} <br className="hidden md:block" />
                                                <span className="font-playfair italic text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">{t("contact_title_highlight")}</span>
                                            </h2>
                                            <p className="text-muted-foreground max-w-xl mx-auto font-light">
                                                {t("contact_subtitle")}
                                            </p>
                                        </div>

                                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                            {/* Honeypot — hidden from real users, bots fill it automatically */}
                                            <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}>
                                                <input type="text" tabIndex={-1} autoComplete="off" {...registerTrap("_trap")} />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">{t("contact_name_label")}</label>
                                                    <div className="relative group">
                                                        <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${errors.name ? "text-red-400" : "text-muted-foreground group-focus-within:text-primary"}`} />
                                                        <input
                                                            type="text"
                                                            {...register("name")}
                                                            placeholder="John Doe"
                                                            className={`w-full bg-white/5 border rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-light ${errors.name ? "border-red-500/50 bg-red-500/5 focus:ring-red-500/20" : "border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 hover:bg-white/10"}`}
                                                        />
                                                    </div>
                                                    <AnimatePresence>
                                                        {errors.name && (
                                                            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="text-red-400 text-[10px] uppercase tracking-wider font-bold ml-1 flex items-center gap-1">
                                                                <AlertCircle className="w-3 h-3" /> {errors.name.message}
                                                            </motion.p>
                                                        )}
                                                    </AnimatePresence>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">{t("contact_email_label")}</label>
                                                    <div className="relative group">
                                                        <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${errors.email ? "text-red-400" : "text-muted-foreground group-focus-within:text-primary"}`} />
                                                        <input
                                                            type="email"
                                                            {...register("email")}
                                                            placeholder="john@example.com"
                                                            className={`w-full bg-white/5 border rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-light ${errors.email ? "border-red-500/50 bg-red-500/5 focus:ring-red-500/20" : "border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 hover:bg-white/10"}`}
                                                        />
                                                    </div>
                                                    <AnimatePresence>
                                                        {errors.email && (
                                                            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="text-red-400 text-[10px] uppercase tracking-wider font-bold ml-1 flex items-center gap-1">
                                                                <AlertCircle className="w-3 h-3" /> {errors.email.message}
                                                            </motion.p>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">{t("contact_msg_label")}</label>
                                                <div className="relative group">
                                                    <MessageSquare className={`absolute left-4 top-6 w-5 h-5 transition-colors ${errors.message ? "text-red-400" : "text-muted-foreground group-focus-within:text-primary"}`} />
                                                    <textarea
                                                        {...register("message")}
                                                        placeholder={t("contact_msg_placeholder")}
                                                        rows={4}
                                                        className={`w-full bg-white/5 border rounded-3xl py-4 pl-12 pr-4 outline-none transition-all font-light resize-none ${errors.message ? "border-red-500/50 bg-red-500/5 focus:ring-red-500/20" : "border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 hover:bg-white/10"}`}
                                                    />
                                                </div>
                                                <AnimatePresence>
                                                    {errors.message && (
                                                        <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="text-red-400 text-[10px] uppercase tracking-wider font-bold ml-1 flex items-center gap-1">
                                                            <AlertCircle className="w-3 h-3" /> {errors.message.message}
                                                        </motion.p>
                                                    )}
                                                </AnimatePresence>
                                            </div>

                                            <AnimatePresence>
                                                {serverError && (
                                                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-200 text-sm">
                                                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                                        <p>{serverError}</p>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            <div className="flex items-start gap-4 pt-2">
                                                <div className="flex items-center h-5">
                                                    <input
                                                        id="policy"
                                                        type="checkbox"
                                                        {...register("policy")}
                                                        className={`w-4 h-4 rounded border-white/20 bg-white/5 focus:ring-primary/50 focus:ring-2 focus:ring-offset-0 focus:ring-offset-transparent cursor-pointer transition-all ${errors.policy ? "border-red-500/50 text-red-500" : "text-primary"}`}
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <label htmlFor="policy" className="text-xs text-muted-foreground font-light leading-snug cursor-pointer select-none">
                                                        {t("contact_policy_1")}<Link href="/privacy" onClick={onClose} className="text-primary hover:underline underline-offset-2">{t("contact_policy_2")}</Link>{t("contact_policy_3")}
                                                    </label>
                                                    <AnimatePresence>
                                                        {errors.policy && (
                                                            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="text-red-400 text-[10px] uppercase tracking-wider font-bold flex items-center gap-1">
                                                                <AlertCircle className="w-3 h-3" /> {errors.policy.message}
                                                            </motion.p>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            </div>

                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                disabled={isSubmitting}
                                                className="relative w-full py-5 rounded-2xl overflow-hidden font-bold text-lg flex items-center justify-center gap-3 disabled:opacity-70 group/btn"
                                            >
                                                <div className="absolute inset-0 transition-opacity bg-primary" />
                                                <div className="absolute inset-0 transition-opacity opacity-0 group-hover/btn:opacity-100 bg-white" />
                                                
                                                <div className="relative z-10 flex items-center gap-3 text-white group-hover/btn:text-black transition-colors">
                                                    {isSubmitting ? (
                                                        <>
                                                            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                            {t("contact_sending")}
                                                        </>
                                                    ) : (
                                                        <>
                                                            {t("contact_send")}
                                                            <Send className="w-5 h-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                                        </>
                                                    )}
                                                </div>
                                            </motion.button>
                                        </form>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex flex-col items-center justify-center text-center space-y-6 py-20"
                                    >
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1, rotate: 360 }}
                                            transition={{ type: "spring", damping: 15, stiffness: 200 }}
                                            className="w-24 h-24 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.3)]"
                                        >
                                            <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                                        </motion.div>
                                        
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                            className="space-y-2"
                                        >
                                            <h3 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-teal-200">
                                                {t("contact_sent")}
                                            </h3>
                                            <p className="text-muted-foreground font-light text-lg">
                                                I will process this transmission shortly.
                                            </p>
                                        </motion.div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
