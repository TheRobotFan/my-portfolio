import { ArrowRight, Code, Play, Terminal, HelpCircle, ChefHat, Utensils, BookOpen, Lightbulb, CheckCircle, Table, AlertTriangle, ArrowDown, Activity, Layers, Repeat, Monitor } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { GlobalHeader } from './components/GlobalHeader';

// --- Components ---

// --- Components ---

const Hero = () => (
  <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
    {/* Animated background orbs */}
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute top-1/3 left-1/4 w-[700px] h-[700px] rounded-full bg-primary/5 blur-[140px]" />
      <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] rounded-full bg-violet-600/4 blur-[120px]" />
    </div>

    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-5xl"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex justify-center mb-10"
      >
        <span className="px-5 py-1.5 rounded-full bg-white/4 text-slate-300 border border-white/8 text-xs font-semibold uppercase tracking-[0.25em] flex items-center gap-2.5 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          Guida Essenziale · Funzioni Python
        </span>
      </motion.div>

      <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.88] text-white">
        Impara le Funzioni
        <br />
        <span className="text-primary italic">Semplici</span>
        <span className="text-white">, Passo dopo Passo.</span>
      </h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="text-xl md:text-2xl text-slate-400 mb-14 max-w-2xl mx-auto leading-relaxed font-medium"
      >
        Le funzioni sono blocchi di codice pronti all'uso.
        Scopri come organizzare il tuo codice in modo ordinato.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="flex flex-col sm:flex-row gap-5 justify-center items-center"
      >
        <button
          onClick={() => document.getElementById('intro').scrollIntoView({ behavior: 'smooth' })}
          className="px-10 py-4 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-base tracking-wide transition-all duration-300 flex items-center justify-center gap-3 group shadow-lg shadow-primary/20 active:scale-95"
        >
          Inizia da qui
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-200" />
        </button>
      </motion.div>
    </motion.div>
  </section>
);

const CodeBlock = ({ code, filename = "main.py" }) => {
  const highlight = (line) => {
    const placeholders = [];
    let processed = line
      .replace(/#.*/g, (match) => {
        placeholders.push(`<span class="text-slate-500 italic">${match}</span>`);
        return `__COMMENT_${placeholders.length - 1}__`;
      })
      .replace(/(".*?"|'.*?')/g, (match) => {
        placeholders.push(`<span class="text-emerald-400 font-medium">${match}</span>`);
        return `__STRING_${placeholders.length - 1}__`;
      });

    processed = processed
      .replace(/\b(def|return|import|as|from|if|else|for|in|while)\b/g, '<span class="text-indigo-400 font-bold">$1</span>')
      .replace(/\b(print)\b/g, '<span class="text-orange-400 font-medium">$1</span>')
      .replace(/\b([a-zA-Z0-9_]+)(?=\()/g, '<span class="text-blue-400 font-medium">$1</span>');

    processed = processed.replace(/__(COMMENT|STRING)_(\d+)__/g, (_, type, index) => {
      return placeholders[parseInt(index)];
    });

    return processed;
  };

  return (
    <div className="group relative rounded-3xl bg-[#070a14] border border-slate-800/50 p-8 overflow-hidden shadow-2xl my-10 font-mono code-block-hover transition-all duration-500">
      {/* Subtle top gradient line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="flex items-center justify-between mb-6 text-slate-500 border-b border-slate-800/50 pb-4">
        <div className="flex gap-2 items-center">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/50 border border-red-500/30 group-hover:bg-red-500/80 transition-colors duration-300" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/50 border border-yellow-500/30 group-hover:bg-yellow-500/80 transition-colors duration-300" style={{ transitionDelay: '50ms' }} />
            <div className="w-3 h-3 rounded-full bg-green-500/50 border border-green-500/30 group-hover:bg-green-500/80 transition-colors duration-300" style={{ transitionDelay: '100ms' }} />
          </div>
          <span className="text-[10px] font-bold ml-4 uppercase tracking-[0.2em] text-slate-600 group-hover:text-primary/60 transition-colors">{filename}</span>
        </div>
      </div>
      <pre className="text-sm md:text-base leading-[1.8] overflow-x-auto selection:bg-primary/40">
        <code>
          {code.split('\n').map((line, i) => (
            <div key={i} className="flex group/line px-2 hover:bg-slate-800/20 transition-colors">
              <span className="w-10 text-slate-700 select-none text-right mr-6 text-xs">{i + 1}</span>
              <span dangerouslySetInnerHTML={{ __html: highlight(line) }} />
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
};

const StepSection = ({ id, title, subtitle, icon: Icon, children, dark = false }) => (
  <section
    id={id}
    className={`py-32 px-6 relative overflow-hidden section-divider`}
    style={{
      background: dark
        ? 'hsl(248 20% 4.5%)'
        : 'linear-gradient(180deg, hsl(248 20% 4.5%) 0%, hsl(255 18% 5.5%) 50%, hsl(248 20% 4.5%) 100%)'
    }}
  >
    {/* Ambient violet orb per sezione */}
    <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
      <div className="absolute -top-1/4 right-0 w-[500px] h-[500px] rounded-full"
        style={{ background: 'radial-gradient(circle, hsl(247 60% 30% / 0.06) 0%, transparent 70%)' }}
      />
    </div>
    <div className="max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mb-16"
      >
        <div className="flex items-center gap-5 mb-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-primary transition-all duration-400 hover:scale-105"
            style={{ background: 'hsl(247 50% 20% / 0.4)', border: '1px solid hsl(247 40% 28% / 0.5)' }}
          >
            <Icon size={26} />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: 'hsl(247 60% 65%)' }}>{subtitle}</span>
            <h2 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight">{title}</h2>
          </div>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ delay: 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="text-slate-400 text-lg md:text-xl leading-relaxed space-y-8"
      >
        {children}
      </motion.div>
    </div>
  </section>
);

const QUIZ_QUESTIONS = [
  {
    id: 1,
    domanda: 'Quale sarà l\'output a schermo?',
    code: `def raddoppia(n):\n    print(n * 2)\n\nraddoppia(5)`,
    options: [
      { id: 'A', text: '10', correct: true },
      { id: 'B', text: '5', correct: false },
      { id: 'C', text: 'raddoppia', correct: false },
    ],
    spiegazione: 'n vale 5, quindi n * 2 = 10. La funzione lo stampa con print().'
  },
  {
    id: 2,
    domanda: 'Cosa restituisce questa funzione?',
    code: `def saluta(nome):\n    return "Ciao, " + nome\n\nrisultato = saluta("Luca")\nprint(risultato)`,
    options: [
      { id: 'A', text: 'Niente, non stampa nulla', correct: false },
      { id: 'B', text: 'Ciao, Luca', correct: true },
      { id: 'C', text: 'nome', correct: false },
    ],
    spiegazione: 'return unisce le due stringhe e le consegna. print(risultato) le mostra a schermo.'
  },
  {
    id: 3,
    domanda: 'Qual è la sintassi CORRETTA per definire una funzione?',
    code: `# Quale opzione è giusta?`,
    options: [
      { id: 'A', text: 'function ciao():', correct: false },
      { id: 'B', text: 'def ciao():', correct: true },
      { id: 'C', text: 'define ciao():', correct: false },
    ],
    spiegazione: 'In Python si usa sempre la parola chiave def per definire una funzione.'
  }
];

const Quiz = () => {
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = QUIZ_QUESTIONS[qIndex];

  const handleCheck = () => {
    if (!selected) return;
    if (selected.correct) setScore(s => s + 1);
    setShowResult(true);
  };

  const handleNext = () => {
    if (qIndex < QUIZ_QUESTIONS.length - 1) {
      setQIndex(i => i + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      setFinished(true);
    }
  };

  const handleReset = () => {
    setQIndex(0); setSelected(null); setShowResult(false); setScore(0); setFinished(false);
  };

  return (
    <div className="card-violet rounded-3xl p-8 max-w-4xl mx-auto my-12 overflow-hidden relative" style={{ boxShadow: '0 4px 40px -10px hsl(247 50% 20% / 0.3)' }}>
      <div className="absolute inset-x-0 top-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, hsl(247 72% 58% / 0.3), transparent)' }} />
      <div className="absolute top-0 right-0 py-8 px-12 opacity-5 text-white pointer-events-none">
        <HelpCircle size={240} className="rotate-12" />
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-3 mb-8">
        <Activity size={22} className="text-primary" />
        <h3 className="text-xl font-bold text-white">Quiz — Domanda {qIndex + 1} di {QUIZ_QUESTIONS.length}</h3>
        <div className="ml-auto flex gap-2">
          {QUIZ_QUESTIONS.map((_, i) => (
            <div key={i} className={`w-3 h-3 rounded-full transition-all ${i < qIndex ? 'bg-emerald-400' : i === qIndex ? 'bg-primary' : 'bg-slate-700'
              }`} />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!finished ? (
          <motion.div key={qIndex} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
            <p className="text-emerald-400 font-bold mb-4 text-lg">{q.domanda}</p>
            <CodeBlock code={q.code} />
            <div className="space-y-3 mt-6">
              {q.options.map((opt) => (
                <button
                  key={opt.id}
                  disabled={showResult}
                  onClick={() => { setSelected(opt); setShowResult(false); }}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between ${showResult
                    ? opt.correct
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                      : selected?.id === opt.id
                        ? 'border-red-500 bg-red-500/10 text-red-300'
                        : 'border-slate-800 bg-slate-900 text-slate-600 opacity-50'
                    : selected?.id === opt.id
                      ? 'border-primary bg-primary/10 text-white'
                      : 'border-slate-800 bg-slate-900 hover:border-slate-600 text-slate-400'
                    }`}
                >
                  <span>{opt.id}. {opt.text}</span>
                  {showResult && opt.correct && <CheckCircle size={18} className="text-emerald-400" />}
                </button>
              ))}
            </div>

            <AnimatePresence>
              {showResult && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`mt-6 p-4 rounded-2xl text-sm leading-relaxed ${selected?.correct ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300' : 'bg-red-500/10 border border-red-500/30 text-red-300'
                  }`}>
                  <span className="font-bold">{selected?.correct ? 'Corretto! ' : 'Non esatto. '}</span>
                  {q.spiegazione}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-8 flex gap-4">
              {!showResult ? (
                <button disabled={!selected} onClick={handleCheck}
                  className="px-8 py-3 bg-primary disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary-dark text-white rounded-xl font-bold transition-all">
                  Verifica Risposta
                </button>
              ) : (
                <button onClick={handleNext}
                  className="px-8 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold transition-all flex items-center gap-2">
                  {qIndex < QUIZ_QUESTIONS.length - 1 ? 'Prossima Domanda' : 'Vedi Risultato'} <ArrowRight size={16} />
                </button>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
            <div className={`text-7xl font-black mb-4 ${score === QUIZ_QUESTIONS.length ? 'text-emerald-400' : score >= 2 ? 'text-primary' : 'text-red-400'
              }`}>{score}/{QUIZ_QUESTIONS.length}</div>
            <p className="text-xl text-white font-bold mb-2">
              {score === QUIZ_QUESTIONS.length ? 'Perfetto! Hai capito tutto!' : score >= 2 ? 'Ottimo lavoro!' : 'Rileggi le sezioni e riprova!'}
            </p>
            <p className="text-slate-400 mb-8">Hai risposto correttamente a {score} domande su {QUIZ_QUESTIONS.length}.</p>
            <button onClick={handleReset} className="px-8 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold transition-all">
              Ricomincia il Quiz
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const DataJourney = () => (
  <div className="grid md:grid-cols-4 gap-8 my-16">
    {[
      { step: "01", icon: ArrowDown, label: "CHIAMATA", desc: "Diciamo a Python di usare la funzione.", color: "indigo" },
      { step: "02", icon: Repeat, label: "ESEGUI", desc: "Il codice dentro la funzione parte.", color: "blue" },
      { step: "03", icon: Layers, label: "AZIONE", desc: "La funzione fa quello per cui è stata scritta.", color: "emerald" },
      { step: "04", icon: Play, label: "FINE", desc: "La funzione termina il suo compito.", color: "primary" },
    ].map((item, index) => (
      <motion.div
        key={item.step}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 }}
        className="relative p-6 rounded-3xl bg-slate-900/30 border border-slate-800/60 overflow-hidden group hover:scale-105 hover:bg-slate-800/40 transition-all duration-500"
      >
        <div className={`text-${item.color}-400 font-black text-4xl mb-6 opacity-30`}>{item.step}</div>
        <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-all">
          <item.icon size={22} />
        </div>
        <h4 className="text-white font-black text-lg mb-2 tracking-tighter">{item.label}</h4>
        <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
      </motion.div>
    ))}
  </div>
);

// --- Main App ---

export default function App() {
  const [showPro, setShowPro] = useState(false);

  return (
    <div className="bg-dark-bg min-h-screen text-slate-200 selection:bg-primary/30 selection:text-white font-sans antialiased relative">
      <div className="noise" />
      <GlobalHeader isSubProject={false} />
      <Hero />

      <main className="">

        <StepSection id="intro" title="Perché usare le Funzioni?" subtitle="Il Principio DRY" icon={Lightbulb}>
          <div className="space-y-12">
            <div className="max-w-3xl">
              <p className="text-2xl font-bold text-white mb-6">In informatica, c'è un principio sacro: <span className="text-primary italic">DRY.</span></p>
              <p className="text-xl leading-relaxed text-slate-300">
                È l'acronimo di <strong>Don't Repeat Yourself</strong> (letteralmente: "Non ripeterti").<br />
                Scrivere lo stesso codice più volte è il modo più rapido per creare bug e perdere tempo.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-start">
              <div className="space-y-8">
                <motion.div
                  whileHover={{ y: -3 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                  className="p-8 rounded-3xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, hsl(247 40% 10% / 0.8) 0%, hsl(247 30% 8% / 0.6) 100%)',
                    border: '1px solid hsl(247 30% 20% / 0.5)'
                  }}
                >
                  <div className="absolute inset-x-0 top-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, hsl(247 72% 58% / 0.4), transparent)' }} />
                  <h4 className="font-black uppercase tracking-widest text-sm mb-6 flex items-center gap-2" style={{ color: 'hsl(247 60% 68%)' }}>
                    <CheckCircle size={16} style={{ color: 'hsl(247 60% 65%)' }} />
                    PRO TIP: Le 3 R del Successo
                  </h4>
                  <ul className="space-y-6">
                    <li className="flex gap-4">
                      <span className="text-primary font-bold">1.</span>
                      <div>
                        <strong>Riutilizzabilità:</strong>
                        <p className="text-slate-400 text-sm">Definisci una logica e usala quante volte vuoi.</p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <span className="text-primary font-bold">2.</span>
                      <div>
                        <strong>Ridondanza Zero:</strong>
                        <p className="text-slate-400 text-sm">Se devi cambiare qualcosa, lo fai in un solo punto.</p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <span className="text-primary font-bold">3.</span>
                      <div>
                        <strong>Readability:</strong>
                        <p className="text-slate-400 text-sm">Il codice si legge come una storia: calcola_tasse() è più chiaro di 10 righe di calcoli.</p>
                      </div>
                    </li>
                  </ul>
                </motion.div>
              </div>

              <CodeBlock filename="dry_example.py" code={`# SENZA FUNZIONI (Errore se decidi di cambiare l'IVA)
p1 = 100 * 1.22
p2 = 250 * 1.22
p3 = 45 * 1.22

# CON LE FUNZIONI (Modifichi in un punto solo!)
def stampa_prezzo_iva(prezzo):
    print(prezzo * 1.22)

stampa_prezzo_iva(100)
stampa_prezzo_iva(250)`} />
            </div>
          </div>
        </StepSection>

        <StepSection id="syntax" title="Crea la tua Funzione" subtitle="Esempio" icon={Terminal} dark={true}>
          <p className="text-xl">Inizia con <code>def</code>, dagli un nome e aggiungi le parentesi.</p>
          <CodeBlock code={`def messaggio():
    print("Buongiorno!")
    print("Benvenuti a lezione")

# Chiama la funzione per usarla:
messaggio()`} />
        </StepSection>

        <StepSection id="builtins" title="Funzioni di Python" subtitle="Già Pronte" icon={Utensils}>
          <p className="text-xl">Python ha già tanti strumenti pronti che puoi usare subito, senza doverli creare tu:</p>
          <div className="grid md:grid-cols-2 gap-6 my-8">
            {[
              { fn: 'print()', desc: 'Mostra un valore a schermo.', code: 'print("Ciao!")  # Output: Ciao!' },
              { fn: 'len()', desc: 'Conta quanti elementi ci sono.', code: 'len("Python")   # Output: 6' },
              { fn: 'input()', desc: 'Chiede un valore all\'utente.', code: 'nome = input("Come ti chiami? ")' },
              { fn: 'type()', desc: 'Dice che tipo di dato è.', code: 'type(42)        # Output: <class \'int\'>' },
            ].map((item) => (
              <div key={item.fn} className="group p-6 border border-slate-800 rounded-2xl hover:border-primary/40 hover:bg-primary/5 transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono font-black text-primary text-lg">{item.fn}</span>
                </div>
                <p className="text-slate-400 text-sm mb-4">{item.desc}</p>
                <div className="bg-[#070a14] rounded-xl px-4 py-3 font-mono text-xs text-emerald-400 border border-slate-800/60">{item.code}</div>
              </div>
            ))}
          </div>
        </StepSection>


        {!showPro ? (
          <section className="py-32 px-6 text-center relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0 -z-10 flex items-center justify-center">
              <div className="w-[600px] h-[300px] bg-primary/8 rounded-full blur-[100px]" />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-2xl mx-auto p-14 rounded-[3rem] border-gradient relative overflow-hidden shadow-2xl"
            >
              {/* Top shimmer line */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mx-auto mb-8 border border-white/5 shadow-lg">
                <Layers className="text-primary" size={32} />
              </div>
              <h3 className="text-4xl font-black mb-6 italic text-gradient-subtle">Vuoi diventare un esperto?</h3>
              <p className="text-slate-400 mb-12 text-lg leading-relaxed">
                Scopri come far uscire i dati dalle funzioni e come usare i parametri
                per rendere il tuo codice davvero <span className="text-primary font-bold">dinamico</span>.
              </p>
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 20px 50px -10px hsl(258 90% 66% / 0.4)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { setShowPro(true); setTimeout(() => document.getElementById('advanced')?.scrollIntoView({ behavior: 'smooth' }), 100); }}
                className="btn-shimmer px-14 py-5 bg-gradient-to-r from-primary to-violet-600 text-white rounded-xl font-black text-lg tracking-wide transition-all shadow-xl shadow-primary/20 flex items-center gap-3 mx-auto"
              >
                Vai ai Contenuti Avanzati
                <ArrowRight size={20} />
              </motion.button>
            </motion.div>
          </section>
        ) : (
          <>
            <StepSection id="advanced" title="Sezione PRO" subtitle="Contenuti Avanzati" icon={Layers} dark={true}>
              <div className="space-y-12">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4">1. I Parametri (Dati in Ingresso)</h3>
                  <p className="mb-6">Puoi passare delle informazioni alla funzione usando i parametri nelle parentesi.</p>
                  <CodeBlock code={`def saluta(nome):
    print("Ciao")
    print(nome)

saluta("Abdel")`} />
                </div>

                <div className="pt-12 border-t border-slate-800">
                  <h3 className="text-2xl font-bold text-white mb-4">2. Il Return (Dati in Uscita)</h3>
                  <p className="mb-6">Il <code>return</code> serve per "far uscire" un valore dalla funzione e salvarlo in una variabile.</p>
                  <CodeBlock code={`def somma(a, b):
    risultato = a + b
    return risultato

totale = somma(10, 5)
print(totale)`} />
                </div>

                <div className="pt-12 border-t border-slate-800">
                  <h3 className="text-2xl font-bold text-indigo-400 mb-4">Print vs Return</h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700">
                      <h4 className="font-bold text-white mb-2">Stampa (print)</h4>
                      <p className="text-sm">Mostra solo il testo a schermo. Non puoi usare quel valore per fare calcoli dopo.</p>
                    </div>
                    <div className="p-6 bg-primary/10 rounded-2xl border border-primary/20">
                      <h4 className="font-bold text-white mb-2">Restituisci (return)</h4>
                      <p className="text-sm">Consegna il valore al programma. Puoi usarlo per altre operazioni o salvarlo.</p>
                    </div>
                  </div>
                </div>
              </div>
            </StepSection>

            <StepSection id="errori" title="Errori Frequenti" subtitle="Attenzione" icon={AlertTriangle}>
              <p className="text-xl">Questi sono gli errori più comuni che fanno i principianti. Impara a riconoscerli!</p>
              <div className="space-y-8 mt-8">
                <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
                  <h4 className="text-red-400 font-black text-lg mb-2 flex items-center gap-2"><AlertTriangle size={18} /> Errore 1: Dimenticare di chiamare la funzione</h4>
                  <p className="text-slate-400 text-sm mb-4">Definire una funzione non la esegue. Devi chiamarla!</p>
                  <CodeBlock code={`def saluta():
    print("Ciao!")

# SBAGLIATO: questo non fa nulla
# (hai scritto la ricetta, ma non hai cucinato)

# GIUSTO: chiama la funzione
saluta()`} />
                </div>
                <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-6">
                  <h4 className="text-yellow-400 font-black text-lg mb-2 flex items-center gap-2"><AlertTriangle size={18} /> Errore 2: Indentazione sbagliata</h4>
                  <p className="text-slate-400 text-sm mb-4">Il codice DENTRO la funzione deve essere spostato di 4 spazi. Senza indentazione, Python dà errore.</p>
                  <CodeBlock code={`# SBAGLIATO: IndentationError!
def calcola():
print("manca l'indentazione")  # ← nessuno spazio!

# GIUSTO
def calcola():
    print("tutto ok")  # ← 4 spazi`} />
                </div>
                <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-6">
                  <h4 className="text-indigo-400 font-black text-lg mb-2 flex items-center gap-2"><AlertTriangle size={18} /> Errore 3: Confondere print e return</h4>
                  <p className="text-slate-400 text-sm mb-4">print mostra solo a schermo. return consegna il valore al programma per usarlo dopo.</p>
                  <CodeBlock code={`def somma(a, b):
    print(a + b)  # ← mostra ma non salva!

risultato = somma(3, 4)
print(risultato)  # Output: None (non 7!)

# GIUSTO
def somma(a, b):
    return a + b

risultato = somma(3, 4)
print(risultato)  # Output: 7`} />
                </div>
              </div>
            </StepSection>

            <StepSection id="quiz" title="Sei pronto?" subtitle="Quiz" icon={CheckCircle} dark={true}>
              <Quiz />
            </StepSection>

            <section id="exercise" className="py-32 px-6 bg-[#020617] relative">
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-24">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center text-primary mx-auto mb-8 shadow-2xl"
                  >
                    <ChefHat size={40} />
                  </motion.div>
                  <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-none italic">
                    Sfida <span className="text-primary not-italic">PRO</span>
                  </h2>
                  <p className="text-slate-400 max-w-2xl mx-auto text-xl md:text-2xl font-medium">
                    È ora di sporcarsi le mani. Applica tutto quello che hai imparato per risolvere questa sfida finale.
                  </p>
                </div>

                <div className="bg-slate-900/40 border-2 border-primary/20 rounded-[3rem] p-8 md:p-16 relative shadow-[0_0_50px_-12px_rgba(99,102,241,0.2)]">
                  <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                      <div className="space-y-4">
                        <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Il Raddoppiatore</h3>
                        <p className="text-slate-300">
                          Crea una funzione che riceve un numero e restituisce il suo doppio usando <code>return</code>.
                        </p>
                      </div>
                      <ExerciseSolution />
                    </div>
                    <div className="opacity-40 grayscale hover:grayscale-0 transition-all duration-700 pointer-events-none lg:pointer-events-auto">
                      <CodeBlock filename="exercise_pro.py" code={`# Scrivi la tua soluzione qui sotto...`} />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="py-24 px-6 bg-[#010409]">
              <div className="max-w-5xl mx-auto">
                <CheatSheet />
              </div>
            </section>
          </>
        )}
      </main>

      <footer className="py-24 border-t border-slate-900/50 bg-[#010409]">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-16 items-start">
          <div className="space-y-6">
            <div className="flex items-center gap-2 font-black text-3xl tracking-tight text-white">
              <div className="bg-primary p-2 rounded-xl">
                <Code size={24} />
              </div>
              PythonEdu
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs font-medium">
              Semplifichiamo l'astrazione per la prossima generazione di programmatori.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h5 className="text-white font-bold text-xs uppercase tracking-[0.2em]">Percorso</h5>
              <ul className="text-slate-500 text-sm space-y-2 font-medium">
                <li><a href="#intro" className="hover:text-primary transition-colors">Basi</a></li>
                <li><a href="#syntax" className="hover:text-primary transition-colors">Sintassi</a></li>
                {showPro && <li><a href="#advanced" className="hover:text-primary transition-colors">Sezione PRO</a></li>}
              </ul>
            </div>
          </div>
          <div className="text-slate-500 text-sm space-y-6">
            <p className="opacity-50 tracking-tight font-medium">© 2026 PythonEdu - Per aspera ad astra.</p>
          </div>
        </div>
      </footer>

      {/* Glossary Sticky Button or Section */}
      <GlossarySection />
    </div >
  );
}

const CheatSheet = () => (
  <div className="card-violet rounded-[2.5rem] p-12 relative overflow-hidden border border-white/5 my-12">
    <div className="absolute top-0 right-0 p-12 opacity-5 text-white pointer-events-none">
      <Table size={200} />
    </div>
    <h3 className="text-3xl font-black text-white mb-10 flex items-center gap-4">
      <span className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
        <Table size={20} />
      </span>
      Quick Cheat Sheet
    </h3>
    <div className="grid md:grid-cols-3 gap-8">
      <div>
        <h4 className="text-primary font-bold mb-4 flex items-center gap-2 italic">Definizione</h4>
        <ul className="space-y-3 text-slate-400 text-sm">
          <li className="flex gap-2"><span>-</span> <code>def nome():</code></li>
          <li className="flex gap-2"><span>-</span> Parentesi obbligatorie</li>
          <li className="flex gap-2"><span>-</span> Due punti <code>:</code> finali</li>
          <li className="flex gap-2"><span>-</span> Indentazione di 4 spazi</li>
        </ul>
      </div>
      <div>
        <h4 className="text-emerald-400 font-bold mb-4 flex items-center gap-2 italic">Dati</h4>
        <ul className="space-y-3 text-slate-400 text-sm">
          <li className="flex gap-2"><span>-</span> <strong>Parametri:</strong> Input alla funzione</li>
          <li className="flex gap-2"><span>-</span> <strong>Return:</strong> Risultato in uscita</li>
          <li className="flex gap-2"><span>-</span> <strong>Snake Case:</strong> <code>mia_funzione</code></li>
        </ul>
      </div>
      <div>
        <h4 className="text-indigo-400 font-bold mb-4 flex items-center gap-2 italic">Perché usarle?</h4>
        <ul className="space-y-3 text-slate-400 text-sm">
          <li className="flex gap-2"><span>-</span> <strong>DRY:</strong> Non ripeterti</li>
          <li className="flex gap-2"><span>-</span> <strong>Ordine:</strong> Codice pulito</li>
          <li className="flex gap-2"><span>-</span> <strong>Facilità:</strong> Modifiche veloci</li>
        </ul>
      </div>
    </div>
  </div>
);


const GlossarySection = () => (
  <section id="glossary" className="py-24 px-6 bg-slate-900/10 border-t border-slate-900">
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-black text-white mb-10 flex items-center gap-3">
        <BookOpen className="text-primary" />
        Glossario Essenziale
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        {[
          { term: "DRY", desc: "Don't Repeat Yourself (Non Ripeterti). Fondamentale per evitare errori." },
          { term: "Snake Case", desc: "Esempio: mia_funzione." },
          { term: "Indentazione", desc: "Lo spazio di 4 battute che definisce il blocco di codice." },
          { term: "Bug", desc: "Un errore nel codice." }
        ].map((item, i) => (
          <div key={i} className="p-6 rounded-2xl bg-slate-800/20 border border-slate-800/40">
            <h4 className="text-primary font-bold mb-2">{item.term}</h4>
            <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

function ExerciseSolution() {
  const [show, setShow] = useState(false);
  return (
    <div className="pt-4">
      <button
        onClick={() => setShow(!show)}
        className="w-full py-4 bg-primary hover:bg-primary-dark text-white rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95"
      >
        {show ? 'Nascondi Soluzione' : 'Guarda la Soluzione'}
        <ArrowDown className={`transition-transform duration-300 ${show ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-8">
              <CodeBlock code={`def raddoppia(numero):
    risultato = numero * 2
    return risultato

# Test
print(raddoppia(10))`} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
