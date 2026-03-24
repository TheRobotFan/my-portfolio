"use client"

import { useLanguage } from "@/components/providers/language-provider"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, ShieldCheck } from "lucide-react"
import { BackgroundBeams } from "@/components/background-beams"

export default function PrivacyPolicy() {
    const { language } = useLanguage()

    const content = {
        EN: {
            title: "Privacy Policy",
            lastUpdated: "Last Updated: October 2026",
            intro: "AetherDev respects your privacy and is committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.",
            sections: [
                {
                    header: "1. Data We Collect",
                    body: "We may collect, use, store and transfer different kinds of personal data about you. When you use our Contact Form to initiate a collaboration, we securely collect your Name, Email Address, and the contents of your message. We do not collect any Special Categories of Personal Data."
                },
                {
                    header: "2. How We Use Your Data",
                    body: "We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances: to respond to your collaboration inquiries, to manage our relationship with you, and to occasionally send you relevant architectural updates if you explicitly opted in."
                },
                {
                    header: "3. Data Security",
                    body: "We have put in place highly optimized and secure server-side measures (including strict Zod cryptographic validation) to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. Data entered in the contact form is transmitted securely via standard HTTPS encryption."
                },
                {
                    header: "4. Third-Party Links",
                    body: "This website may include links to third-party live deployed projects, case studies, or social networks. Clicking on those links or enabling those connections may allow third parties to collect or share data about you. We do not control these third-party websites and are not responsible for their privacy statements."
                },
                {
                    header: "5. Your Legal Rights",
                    body: "Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, erasure, or restriction of processing of your personal data. If you wish to exercise any of these rights, please contact us."
                }
            ],
            backBtn: "Return to Hub"
        },
        IT: {
            title: "Informativa sulla Privacy",
            lastUpdated: "Ultimo Aggiornamento: Ottobre 2026",
            intro: "AetherDev rispetta la tua privacy e si impegna a proteggere i tuoi dati personali. Questa informativa sulla privacy ti illustrerà come gestiamo i tuoi dati personali quando visiti il nostro sito web e ti informerà sui tuoi diritti in materia di privacy e su come la legge ti protegge.",
            sections: [
                {
                    header: "1. Dati che Raccogliamo",
                    body: "Possiamo raccogliere, utilizzare, archiviare e trasferire diversi tipi di dati personali. Quando utilizzi il nostro Modulo di Contatto per avviare una collaborazione, raccogliamo in modo sicuro il tuo Nome, Indirizzo Email e il contenuto del tuo messaggio. Non raccogliamo Categorie Particolari di Dati Personali."
                },
                {
                    header: "2. Come Utilizziamo i Tuoi Dati",
                    body: "Utilizzeremo i tuoi dati personali solo quando la legge ce lo consente. Più comunemente, utilizzeremo i tuoi dati personali nelle seguenti circostanze: per rispondere alle tue richieste di collaborazione, per gestire il nostro rapporto con te e, occasionalmente, per inviarti aggiornamenti architetturali rilevanti se hai dato il consenso esplico."
                },
                {
                    header: "3. Sicurezza dei Dati",
                    body: "Abbiamo messo in atto misure lato server altamente ottimizzate e sicure (inclusa una rigorosa validazione crittografica tramite Zod) per evitare che i tuoi dati personali vengano accidentalmente persi, utilizzati o acceduti in modo non autorizzato, alterati o divulgati. I dati inseriti nel form di contatto sono trasmessi in modo sicuro tramite crittografia HTTPS standard."
                },
                {
                    header: "4. Link di Terze Parti",
                    body: "Questo sito web può includere link a progetti live, case study o social network di terze parti. Cliccare su quei link o abilitare tali connessioni potrebbe consentire a terze parti di raccogliere o condividere dati su di te. Non controlliamo questi siti web di terze parti e non siamo responsabili delle loro informative sulla privacy."
                },
                {
                    header: "5. I Tuoi Diritti Legali",
                    body: "In determinate circostanze, hai diritti previsti dalle leggi sulla protezione dei dati in relazione ai tuoi dati personali, incluso il diritto di richiedere l'accesso, la correzione, la cancellazione o la limitazione del trattamento dei tuoi dati. Se desideri esercitare uno di questi diritti, ti preghiamo di contattarci."
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
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                            <ShieldCheck className="w-4 h-4" />
                            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">GDPR/CCPA Compliant</span>
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
