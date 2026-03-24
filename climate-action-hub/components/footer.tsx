import Link from "next/link"
import { Leaf, Heart, Github, Twitter, Linkedin, ArrowUpRight, Globe, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-foreground text-primary-foreground relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-6 group">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center transition-transform group-hover:scale-110">
                <Leaf className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-tight">Climate Action</span>
                <span className="text-xs opacity-70 leading-tight">Hub</span>
              </div>
            </Link>
            <p className="text-primary-foreground/70 leading-relaxed mb-6">
              Ogni azione conta. Insieme possiamo fare la differenza per il nostro pianeta e costruire un futuro sostenibile.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Twitter, label: "Twitter", href: "#" },
                { icon: Github, label: "GitHub", href: "#" },
                { icon: Linkedin, label: "LinkedIn", href: "#" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Navigazione</h3>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Home" },
                { href: "/calcolatore", label: "Calcolatore CO2" },
                { href: "/agisci", label: "Agisci" },
                { href: "/impara", label: "Impara di piu" },
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Risorse esterne</h3>
            <ul className="space-y-3">
              {[
                { href: "https://www.un.org/en/climatechange", label: "ONU - Clima" },
                { href: "https://climate.nasa.gov/", label: "NASA Climate" },
                { href: "https://www.ipcc.ch/", label: "IPCC" },
                { href: "https://europeanclimate.org/", label: "European Climate" },
              ].map((link) => (
                <li key={link.href}>
                  <a 
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter / Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Resta informato</h3>
            <p className="text-primary-foreground/70 text-sm mb-4">
              Segui le ultime notizie sul clima e ricevi consigli per vivere in modo sostenibile.
            </p>
            <div className="space-y-3">
              <a 
                href="mailto:info@climateactionhub.it"
                className="flex items-center gap-3 text-primary-foreground/70 hover:text-primary-foreground transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-primary-foreground/10 flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-sm">info@climateactionhub.it</span>
              </a>
              <a 
                href="#"
                className="flex items-center gap-3 text-primary-foreground/70 hover:text-primary-foreground transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-primary-foreground/10 flex items-center justify-center">
                  <Globe className="w-4 h-4" />
                </div>
                <span className="text-sm">climateactionhub.it</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/50 text-sm">
            © {new Date().getFullYear()} Climate Action Hub. Progetto Hackathon per un futuro sostenibile.
          </p>
          <p className="flex items-center gap-2 text-primary-foreground/50 text-sm">
            Fatto con 
            <Heart className="w-4 h-4 text-destructive fill-destructive animate-pulse" /> 
            per il nostro pianeta
          </p>
        </div>
      </div>
    </footer>
  )
}
