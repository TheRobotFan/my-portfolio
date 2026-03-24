"use client"

import { useLanguage } from "@/components/providers/language-provider"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, FileText } from "lucide-react"
import { BackgroundBeams } from "@/components/background-beams"

export default function TermsOfService() {
    const { language } = useLanguage()

    const content = {
        EN: {
            title: "Terms of Service",
            lastUpdated: "Last Updated: October 2026",
            intro: "Welcome to AetherDev. These Terms of Service govern your use of our portfolio website and any communication or prospective collaboration initiated through it. By accessing this website, you agree to comply with and be bound by these terms.",
            sections: [
                {
                    header: "1. Intellectual Property Rights",
                    body: "The content, layout, design, data, databases and graphics on this website are protected by intellectual property laws and are owned by AetherDev. Unless expressly permitted, you cannot copy, reproduce, or commercially exploit any material from this site. The code in the showcased projects remains the property of AetherDev or its respective clients."
                },
                {
                    header: "2. Prospective Collaborations",
                    body: "Using the contact form to propose a collaboration does not constitute a legally binding service contract. Any formal engagement will be subject to a separate, comprehensive Statement of Work (SOW) and Master Services Agreement (MSA) agreed upon by both parties."
                },
                {
                    header: "3. Disclaimers and Warranties",
                    body: "This portfolio and its deployed case studies are provided on an 'as is' and 'as available' basis. While we strive for 99.9% uptime and optimal performance, AetherDev makes no guarantees regarding the continuous availability of the showcase projects or the absolute absence of errors."
                },
                {
                    header: "4. Limitations of Liability",
                    body: "AetherDev shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the portfolio website."
                },
                {
                    header: "5. Governing Law",
                    body: "These Terms shall be governed and construed in accordance with standard European tech compliance frameworks, without regard to its conflict of law provisions."
                }
            ],
            backBtn: "Return to Hub"
        },
        IT: {
            title: "Termini di Servizio",
            lastUpdated: "Ultimo Aggiornamento: Ottobre 2026",
            intro: "Benvenuto su AetherDev. Questi Termini di Servizio regolano l'utilizzo del nostro sito web portfolio e qualsiasi comunicazione o potenziale collaborazione avviata tramite esso. Accedendo a questo sito web, accetti di rispettare e di essere vincolato da questi termini.",
            sections: [
                {
                    header: "1. Diritti di Proprietà Intellettuale",
                    body: "Il contenuto, il layout, il design, i dati, i database e la grafica di questo sito web sono protetti dalle leggi sulla proprietà intellettuale e sono di proprietà di AetherDev. A meno che non sia espressamente consentito, non puoi copiare, riprodurre o sfruttare commercialmente alcun materiale di questo sito. Il codice dei progetti in evidenza rimane di proprietà di AetherDev o dei rispettivi clienti."
                },
                {
                    header: "2. Collaborazioni Potenziali",
                    body: "L'utilizzo del modulo di contatto per proporre una collaborazione non costituisce un contratto di servizio legalmente vincolante. Qualsiasi incarico formale sarà soggetto a un separato e completo Statement of Work (SOW) e Master Services Agreement (MSA) concordato da entrambe le parti."
                },
                {
                    header: "3. Dichiarazioni di Non Responsabilità e Garanzie",
                    body: "Questo portfolio e i case study distribuiti sono forniti 'così come sono' e 'come disponibili'. Pur puntando a un uptime del 99,9% e a prestazioni ottimali, AetherDev non offre alcuna garanzia in merito alla disponibilità continua dei progetti in evidenza o all'assoluta assenza di errori."
                },
                {
                    header: "4. Limitazioni di Responsabilità",
                    body: "AetherDev non sarà responsabile per eventuali danni indiretti, accidentali, speciali, consequenziali o punitivi, inclusi, a titolo esemplificativo, perdita di profitti, dati, uso, avviamento o altre perdite immateriali, derivanti dal tuo accesso, uso o incapacità di accedere o utilizzare il sito web del portfolio."
                },
                {
                    header: "5. Legge Applicabile",
                    body: "Questi Termini saranno regolati e interpretati in conformità ai quadri normativi tecnologici standard europei, senza riguardo alle disposizioni in materia di conflitti di legge."
                }
            ],
            backBtn: "Torna all'Hub",
        }
    }

    const t = content[language] || content["EN"]

    return (
        <div className="min-h-screen bg-background relative py-20 md:py-32 selection:bg-primary/30">
            <BackgroundBeams />
            
            <div className="container mx-auto px-4 max-w-4xl relative z-10">
                <Link href="/">
                    <motion.div 
                        whileHover={{ x: -5 }}
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-12"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-bold uppercase tracking-widest text-xs">{t.backBtn}</span>
                    </motion.div>
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-12"
                >
                    <header className="space-y-6 border-b border-white/10 pb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400">
                            <FileText className="w-4 h-4" />
                            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Legal Agreement</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter">
                            {t.title}
                        </h1>
                        <p className="text-muted-foreground font-mono text-sm">
                            {t.lastUpdated}
                        </p>
                    </header>

                    <div className="prose prose-invert prose-p:text-muted-foreground prose-headings:text-white max-w-none space-y-12">
                        <p className="text-lg leading-relaxed font-light">
                            {t.intro}
                        </p>

                        {t.sections.map((section, idx) => (
                            <motion.section 
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="space-y-4"
                            >
                                <h2 className="text-2xl font-bold tracking-tight text-white/90">
                                    {section.header}
                                </h2>
                                <p className="leading-relaxed font-light text-muted-foreground">
                                    {section.body}
                                </p>
                            </motion.section>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
