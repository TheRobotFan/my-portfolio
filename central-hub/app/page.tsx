"use client"

import { Hero } from "@/components/hero"
import { ProjectCard } from "@/components/project-card"
import { BackgroundBeams } from "@/components/background-beams"
import { ExperienceTimeline } from "@/components/experience-timeline"
import { TechMarquee } from "@/components/tech-marquee"
import { FloatingCV } from "@/components/ui/floating-cv"
import { CaseStudyModal, CaseStudyData } from "@/components/case-study-modal"
import { useContact } from "@/components/providers/contact-provider"
import { useLanguage } from "@/components/providers/language-provider"
import { motion, useScroll, useSpring } from "framer-motion"
import Link from "next/link"
import {
  Globe,
  Palette,
  BookOpen,
  Languages,
  Dices,
  Terminal,
  School,
  ShoppingCart,
  Code2,
  Cpu,
  Layers,
  Layout,
  Sparkles,
  ArrowRight,
  Monitor,
  Smartphone,
  Rocket,
  Activity
} from "lucide-react"
import { useRef, useState } from "react"

export default function Hub() {
  const { openContact } = useContact()
  const { t } = useLanguage()
  const { scrollYProgress } = useScroll()
  const [selectedProject, setSelectedProject] = useState<CaseStudyData | null>(null)

  const projects: (CaseStudyData & { className: string; port: number })[] = [
    {
      ...t("projects").python,
      description: t("projects").python.desc,
      techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Monaco Editor"],
      icon: Terminal,
      href: "http://localhost:3006",
      port: 3006,
      color: "from-blue-500 to-cyan-500",
      className: "md:col-span-2 md:row-span-2",
    },
    {
      ...t("projects").grocery,
      description: t("projects").grocery.desc,
      techStack: ["React", "Next.js", "Zustand", "Stripe API", "Vercel"],
      icon: ShoppingCart,
      href: "http://localhost:3008",
      port: 3008,
      color: "from-emerald-500 to-teal-500",
      className: "md:col-span-1 md:row-span-2",
    },
    {
      ...t("projects").climate,
      description: t("projects").climate.desc,
      techStack: ["Next.js", "Chart.js", "React Query", "Tailwind CSS"],
      icon: Globe,
      href: "http://localhost:3001",
      port: 3001,
      color: "from-green-500 to-emerald-500",
      className: "md:col-span-1 md:row-span-1",
    },
    {
      ...t("projects").diary,
      description: t("projects").diary.desc,
      techStack: ["React Native", "Expo", "SQLite", "Local AI"],
      icon: BookOpen,
      href: "http://localhost:3003",
      port: 3003,
      color: "from-indigo-500 to-blue-500",
      className: "md:col-span-1 md:row-span-1",
    },
    {
      ...t("projects").translator,
      description: t("projects").translator.desc,
      techStack: ["Next.js", "WebSockets", "OpenAI API", "Framer Motion"],
      icon: Languages,
      href: "http://localhost:3004",
      port: 3004,
      color: "from-fuchsia-500 to-pink-500",
      className: "md:col-span-3 md:row-span-1",
    },
    {
      ...t("projects").meme,
      description: t("projects").meme.desc,
      techStack: ["React", "HTML5 Canvas", "Fabric.js", "Tailwind CSS"],
      icon: Palette,
      href: "http://localhost:3002",
      port: 3002,
      color: "from-pink-500 to-rose-500",
      className: "md:col-span-1 md:row-span-2",
    },
    {
      ...t("projects").domino,
      description: t("projects").domino.desc,
      techStack: ["Node.js", "Socket.io", "React", "Redis"],
      icon: Dices,
      href: "http://localhost:3005",
      port: 3005,
      color: "from-violet-500 to-purple-500",
      className: "md:col-span-2 md:row-span-1",
    },
    {
      ...t("projects").portal,
      description: t("projects").portal.desc,
      techStack: ["Next.js", "PostgreSQL", "Prisma", "Tailwind CSS"],
      icon: School,
      href: "http://localhost:3007",
      port: 3007,
      color: "from-amber-500 to-yellow-500",
      className: "md:col-span-1 md:row-span-1",
    },
  ]

  const services = [
    { name: t("service_mvp"), desc: t("service_mvp_desc"), icon: Rocket },
    { name: t("service_frontend"), desc: t("service_frontend_desc"), icon: Layout },
    { name: t("service_perf"), desc: t("service_perf_desc"), icon: Activity },
    { name: t("service_sys"), desc: t("service_sys_desc"), icon: Cpu },
  ]
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <div className="min-h-screen">
      <FloatingCV />
      <BackgroundBeams />

      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-[100] origin-left"
        style={{ scaleX }}
      />

      <Hero />

      <TechMarquee />

      <ExperienceTimeline />

      {/* Grid Section */}
      <section id="projects" className="relative container mx-auto px-4 py-20 md:py-32">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-primary/10 blur-[100px] pointer-events-none" />

        {/* Interconnected Web Background */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.15]">
          <svg className="w-full h-full mix-blend-screen" viewBox="0 0 1000 1000" preserveAspectRatio="none">
            <path d="M100 200 C 400 100, 600 400, 900 300 S 800 800, 500 900 S 200 600, 100 200" fill="none" stroke="url(#gradient)" strokeWidth="6" />
            <path d="M200 800 C 500 600, 300 300, 800 100" fill="none" stroke="url(#gradient)" strokeWidth="3" />
            <path d="M800 500 C 600 500, 700 800, 300 900" fill="none" stroke="url(#gradient)" strokeWidth="3" opacity="0.5" />
            <circle cx="100" cy="200" r="10" fill="white" />
            <circle cx="900" cy="300" r="15" fill="none" stroke="white" strokeWidth="2" />
            <circle cx="500" cy="900" r="20" fill="none" stroke="white" strokeWidth="2" />
            <circle cx="200" cy="800" r="10" fill="white" />
            <circle cx="800" cy="100" r="12" fill="none" stroke="white" strokeWidth="2" />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="relative mb-24 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4"
          >
            <div className="h-[1px] w-12 bg-primary/50" />
            <span className="text-primary font-mono text-sm uppercase tracking-[0.3em]">{t("section_curated")}</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-7xl font-bold tracking-tight"
          >
            {t("section_projects")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg md:text-xl max-w-2xl font-light leading-relaxed"
          >
            {t("section_projects_desc")}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-4 gap-6 auto-rows-[300px] min-h-[1200px]">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.title}
              {...project}
              index={index}
              onClick={() => setSelectedProject(project)}
            />
          ))}
        </div>
      </section>

      {/* Philosophy Section */}
      <section id="about" className="relative py-24 md:py-40 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative p-8 md:p-24 rounded-3xl md:rounded-[3rem] bg-white/[0.02] border border-white/10 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
                <div className="space-y-6 md:space-y-8">
                  <h3 className="text-3xl md:text-6xl font-black tracking-tighter leading-[1] md:leading-[0.9]">
                    {t("section_philosophy")}
                  </h3>
                  <div className="space-y-6 text-lg text-muted-foreground font-light leading-relaxed">
                    <p>
                      {t("about_greeting")} <strong className="text-white font-bold">Abdel</strong>. {t("about_p1")}
                    </p>
                    <p>
                      {t("about_p2")} <strong className="text-white font-bold">{t("about_p2_highlight1")}</strong> & <strong className="text-white font-bold">{t("about_p2_highlight2")}</strong>, {t("about_p2_end")}
                    </p>
                    <p>
                      {t("about_p3")}
                    </p>
                  </div>
                </div>

                <div className="relative aspect-square lg:aspect-video flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute w-64 h-64 border-2 border-primary/20 rounded-full"
                  />
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute w-48 h-48 border-2 border-accent/20 rounded-full"
                  />
                  <div className="relative text-7xl font-playfair italic text-white/10 select-none uppercase tracking-[0.2em] [writing-mode:vertical-lr] rotate-180">
                    {t("about_vision")}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="bg-black/40 backdrop-blur-xl border-y border-white/5 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { label: t("metric_performance"), value: "100", suffix: "/100", icon: Cpu },
              { label: t("metric_availability"), value: "99.9", suffix: "%", icon: Globe },
              { label: t("metric_complexity"), value: t("metric_complexity_val"), suffix: "", icon: Code2 },
              { label: t("metric_experience"), value: t("metric_experience_val"), suffix: "", icon: Sparkles }
            ].map((metric, i) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center space-y-4"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <metric.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-5xl font-black tracking-tighter text-white">
                  {metric.value}<span className="text-primary text-xl ml-1">{metric.suffix}</span>
                </div>
                <div className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground font-bold italic">
                  {metric.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="relative py-24 md:py-40 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
            <div className="space-y-8 md:space-y-10">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-4"
              >
                <div className="h-[1px] w-12 bg-primary/50" />
                <span className="text-primary font-mono text-sm uppercase tracking-[0.3em]">{t("skills_rigor")}</span>
              </motion.div>
              <h2 className="text-4xl md:text-8xl font-bold tracking-tighter leading-tight md:leading-none">
                {t("skills_title")}
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed max-w-xl">
                {t("skills_desc")}
              </p>

              <div className="flex gap-8 pt-4">
                <div className="space-y-1">
                  <div className="text-4xl font-bold text-white">99%</div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{t("skills_perf_score")}</div>
                </div>
                <div className="w-[1px] h-12 bg-white/10" />
                <div className="space-y-1">
                  <div className="text-4xl font-bold text-white">50+</div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{t("skills_proj_deliv")}</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((service, index) => (
                <motion.div
                  key={service.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-10 rounded-[2rem] bg-white/[0.02] border border-white/10 hover:border-primary/50 transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-5 h-5 -rotate-45" />
                  </div>
                  <service.icon className="w-12 h-12 text-primary mb-8 group-hover:scale-110 transition-transform duration-500" />
                  <h4 className="text-xl font-bold mb-3 tracking-tight">{service.name}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed font-light">{service.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative container mx-auto px-4 py-32 md:py-60 text-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto space-y-12 md:space-y-16"
        >
          <h2 className="text-5xl md:text-[10rem] font-black tracking-tighter leading-[1] md:leading-[0.8] mb-8 md:mb-12">
            {t("cta_ready")}
          </h2>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-10">
            <button
              onClick={openContact}
              className="w-full sm:w-auto px-10 py-5 md:px-16 md:py-8 bg-primary text-background rounded-full text-base md:text-xl font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_20px_60px_rgba(var(--primary),0.3)]"
            >
              {t("cta_btn")}
            </button>
          </div>
        </motion.div>

        {/* Decorative element for CTA */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] -z-10 opacity-[0.02]">
          <div className="w-full h-full bg-[radial-gradient(circle,_var(--primary)_0%,_transparent_70%)]" />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-16 md:py-24 bg-[#020205]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-16">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center font-black text-background shadow-2xl shadow-primary/20">
                  A
                </div>
                <span className="font-black tracking-[0.2em] text-sm uppercase text-white">AetherDev di Abdel</span>
              </div>
              <p className="max-w-xs text-muted-foreground text-xs font-light leading-relaxed">
                {t("footer_desc")}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-16 text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em]">
              <div className="space-y-6">
                <div className="text-white">{t("footer_social")}</div>
                <div className="flex flex-col gap-4">
                  <Link href="#" className="hover:text-primary transition-colors">Github</Link>
                  <Link href="#" className="hover:text-primary transition-colors">Linkedin</Link>
                  <Link href="#" className="hover:text-primary transition-colors">X / Twitter</Link>
                </div>
              </div>
              <div className="space-y-6">
                <div className="text-white">{t("footer_focus")}</div>
                <div className="flex flex-col gap-4">
                  <span>{t("footer_focus_1")}</span>
                  <span>{t("footer_focus_2")}</span>
                  <span>{t("footer_focus_3")}</span>
                </div>
              </div>
              <div className="space-y-6">
                <div className="text-white">{t("footer_contact")}</div>
                <div className="flex flex-col gap-4">
                  <Link href="mailto:abdel@example.com" className="hover:text-primary transition-colors lowercase font-normal italic">abdel@example.com</Link>
                </div>
              </div>
            </div>
          </div>

            <div className="mt-24 pt-12 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
              <span className="text-[10px] text-muted-foreground/50 tracking-widest uppercase">
                &copy; 2026 {t("footer_rights")}
              </span>
              <div className="flex gap-8 text-[10px] text-muted-foreground/50 tracking-widest uppercase">
                <Link href="/privacy" className="hover:text-primary transition-colors">{t("footer_privacy")}</Link>
                <Link href="/terms" className="hover:text-primary transition-colors">{t("footer_terms")}</Link>
              </div>
            </div>
        </div>
      </footer>

      <CaseStudyModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  )
}
