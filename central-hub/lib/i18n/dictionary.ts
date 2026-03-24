export type Language = "EN" | "IT";

export const dictionary = {
    EN: {
        // Header
        nav_work: "Work",
        nav_philosophy: "Philosophy",
        nav_contact: "Contact",
        brand_subtext: "by Abdel",

        // Hero
        hero_badge: "Engineering the Future of the Web",
        hero_title: "Building Sovereign",
        hero_title_highlight: "Digital Architectures",
        hero_subtitle: "I architect scalable, ultra-fast web experiences focusing on performance, elegant system design, and cutting-edge aesthetics.",
        hero_cta: "View My Work",

        // Marquee
        marquee_title: "Technologies & Frameworks",

        // Section Headers
        section_curated: "Curated Work",
        section_projects: "Project Showcase",
        section_projects_desc: "A collection of engineering projects focused on scalability, performance, and user-centric design.",
        section_philosophy: "The Engineer & the Craft",

        // About Me
        about_greeting: "Hi, I'm",
        about_p1: "I believe that software is more than just code; it's a digital craft that requires both mathematical precision and artistic intuition.",
        about_p2: "With a deep focus on",
        about_p2_highlight1: "Frontend Architecture",
        about_p2_highlight2: "System Engineering",
        about_p2_end: "I build digital environments that are not just functional, but enduring. From concept to deployment, I ensure every pixel, micro-interaction, and millisecond of latency is optimized.",
        about_p3: "My ultimate goal isn't just to write code, but to unify cutting-edge technologies and uncompromising aesthetic design, delivering digital products that redefine end-user expectations.",
        about_vision: "Vision",

        // Metrics
        metric_performance: "Performance",
        metric_availability: "Availability",
        metric_complexity: "Complexity",
        metric_complexity_val: "Minimal",
        metric_experience: "Experience",
        metric_experience_val: "Premium",

        // Skills/Services overview
        skills_rigor: "Architectural Rigor",
        skills_title: "Mastering the Digital Craft",
        skills_desc: "My approach combines engineering precision with aesthetic sensitivity. I build digital environments that perform flawlessly and inspire users.",
        skills_perf_score: "Performance Score",
        skills_proj_deliv: "Projects Delivered",

        // Services
        service_mvp: "MVP Development",
        service_mvp_desc: "Turn ideas into robust, scalable products in record time. Full-stack execution from zero to one.",
        service_frontend: "Frontend Architecture",
        service_frontend_desc: "Revamp complex UIs with Next.js & React. Focus on pixel-perfect implementations and ultra-low latency.",
        service_perf: "Performance Auditing",
        service_perf_desc: "Deep dive into your codebase to eliminate bottlenecks, optimize bundles, and achieve 99% Lighthouse scores.",
        service_sys: "System Engineering",
        service_sys_desc: "Design resilient backend architectures, real-time sync systems, and highly optimized database workflows.",

        // Final CTA
        cta_ready: "Ready to Defy Gravity?",
        cta_btn: "Start Collaboration",

        // Footer
        footer_desc: "Building sovereign digital architectures for a more refined and performant internet.",
        footer_social: "Social",
        footer_focus: "Focus",
        footer_focus_1: "Architecture",
        footer_focus_2: "Aesthetics",
        footer_focus_3: "Performance",
        footer_contact: "Contact",
        footer_rights: "Developed by Abdel. All rights reserved.",
        footer_privacy: "Privacy Policy",
        footer_terms: "Terms of Service",

        // Contact Form
        contact_badge: "Collaborate",
        contact_title: "Ready to build",
        contact_title_highlight: "Something Great?",
        contact_subtitle: "Whether you have a specific project in mind or just want to explore possibilities, I'm here to engineer your vision.",
        contact_name_label: "Your Name",
        contact_email_label: "Email Address",
        contact_msg_label: "What is your vision?",
        contact_msg_placeholder: "Tell me about your project, goals, and any specific inspiration...",
        contact_send: "Launch Message",
        contact_sending: "Transmitting...",
        contact_sent: "Success! Transmission Received",
        contact_policy_1: "I consent to the processing of personal data in accordance with the ",
        contact_policy_2: "Privacy Policy",
        contact_policy_3: " to handle this request.",

        // Floating CV
        cv_download: "Download CV",
        cv_preparing: "Preparing Resume...",
        cv_hire: "Hire the Vision",

        // Modal
        modal_challenge: "The Challenge",
        modal_architecture: "Architecture & Design",
        modal_tech: "Core Technologies",
        modal_impact: "Impact & Metrics",
        modal_label: "Case Study",
        modal_visit: "Visit Live Site",
        modal_port: "Port",
        modal_deploy: "Deploy",

        // Experience Timeline
        exp_section_label: "Professional Journey",
        exp_section_title: "Experience & Evolution",
        exp_1_title: "Senior Full-Stack Engineer",
        exp_1_desc: "Architecting enterprise-scale applications and high-performance interfaces for global clients.",
        exp_2_title: "Frontend Architect",
        exp_2_desc: "Led the migration of legacy systems to modern React/Next.js stacks, improving performance by 40%.",
        exp_3_title: "Software Engineer",
        exp_3_desc: "Developed and maintained full-stack applications using React, Node.js, and PostgreSQL.",
        exp_4_title: "Computer Science Degree",
        exp_4_company: "University of Technology",
        exp_4_desc: "Graduated with honors. Specialized in distributed systems and human-computer interaction.",

        // Projects Data
        projects: {
            python: {
                title: "Python Masterclass",
                desc: "A comprehensive, interactive educational platform architected from the ground up for learning Python.",
                challenge: "Creating an engaging, zero-setup environment where beginners could write and execute real Python code without the complexity of local environment configuration.",
                architecture: "Built on a modern Next.js 14 App Router, utilizing a robust monolithic structure with server-side AST parsing and isolated code execution sandboxes.",
                impact: "Successfully reduced the barrier to entry for Python learners, providing a seamless transition from basic syntax to complex object-oriented patterns."
            },
            grocery: {
                title: "Grocery Engine",
                desc: "A highly scalable, modern e-commerce infrastructure engineered for daily essentials.",
                challenge: "Handling complex cart state synchronization and precise inventory tracking across multiple concurrent user sessions without latency.",
                architecture: "Leveraging a headless commerce approach with a responsive Next.js frontend, backed by a resilient API layer and optimistic UI updates for real-time feel.",
                impact: "Achieved sub-100ms interaction times for cart operations, delivering a frictionless shopping experience that maximizes conversion rates."
            },
            climate: {
                title: "Climate Action Hub",
                desc: "Empowering global change through actionable climate insights.",
                challenge: "Visualizing complex, high-volume environmental datasets in an intuitive and performant manner for non-technical users.",
                architecture: "Implementing a data-rich dashboard architecture with efficient client-side data caching and progressive rendering techniques.",
                impact: "Created an accessible platform that translates raw climate data into clear, actionable metrics for ecological awareness."
            },
            diary: {
                title: "My Digital Diary",
                desc: "Secure, personal journaling application with sentiment analysis.",
                challenge: "Ensuring absolute data privacy while providing intelligent, context-aware analysis of personal entries.",
                architecture: "Client-first architecture with end-to-end encryption concepts and lightweight, localized sentiment analysis processing.",
                impact: "Delivered a highly secure, private digital space that helps users track their emotional well-being over time."
            },
            translator: {
                title: "Polyglot Translator",
                desc: "A seamless multi-language translation ecosystem leveraging custom NLP models and low-latency websockets.",
                challenge: "Minimizing translation latency and maintaining context across long, complex conversational threads in real-time.",
                architecture: "Event-driven WebSocket architecture paired with streaming API responses, allowing for character-by-character translation delivery.",
                impact: "Broke down language barriers with near-instantaneous, contextually accurate translations for global fluid communication."
            },
            meme: {
                title: "Meme Generator",
                desc: "A viral content creation suite equipped with hardware-accelerated image processing capabilities.",
                challenge: "Building a highly responsive, feature-rich image manipulation engine entirely within the browser without sacrificing performance.",
                architecture: "Canvas API-driven core wrapped in a React state management layer, utilizing Web Workers for heavy image processing tasks.",
                impact: "Empowered creators with a professional-grade yet accessible tool, driving high user engagement and content sharing."
            },
            domino: {
                title: "Domino Online",
                desc: "A real-time multiplayer competitive gaming arena featuring custom bi-dimensional physics.",
                challenge: "Synchronizing game state perfectly across diverse network conditions and implementing a fair, responsive real-time multiplayer experience.",
                architecture: "Authoritative server model with client-side prediction and interpolation, backed by a scalable WebSocket infrastructure.",
                impact: "Created a highly addictive, technically robust multiplayer environment capable of handling thousands of concurrent matches."
            },
            portal: {
                title: "Class Portal",
                desc: "Next-generation educational hub connecting students and teachers.",
                challenge: "Designing an intuitive, unified interface that serves the distinct needs of both educators and students seamlessly.",
                architecture: "Role-based access control architecture with deeply nested routing and dynamic dashboard generation based on user context.",
                impact: "Streamlined administrative workflows and enhanced student engagement through a centralized, modern educational platform."
            }
        }
    },
    IT: {
        // Header
        nav_work: "Lavori",
        nav_philosophy: "Filosofia",
        nav_contact: "Contatti",
        brand_subtext: "di Abdel",

        // Hero
        hero_badge: "Ingegnerizzare il Futuro del Web",
        hero_title: "Costruisco Architetture",
        hero_title_highlight: "Digitali Sovrane",
        hero_subtitle: "Progetto esperienze web scalabili e ultra-veloci concentrandomi su performance, design di sistema elegante ed estetica all'avanguardia.",
        hero_cta: "Guarda i miei Progetti",

        // Marquee
        marquee_title: "Tecnologie e Framework",

        // Section Headers
        section_curated: "Lavori Selezionati",
        section_projects: "Showcase dei Progetti",
        section_projects_desc: "Una collezione di progetti ingegneristici focalizzati su scalabilità, performance e design incentrato sull'utente.",
        section_philosophy: "L'Ingegnere e il Mestiere",

        // About Me
        about_greeting: "Ciao, sono",
        about_p1: "Credo che il software sia più che semplice codice; è un mestiere digitale che richiede sia precisione matematica che intuizione artistica.",
        about_p2: "Con un profondo focus su",
        about_p2_highlight1: "Architettura Frontend",
        about_p2_highlight2: "System Engineering",
        about_p2_end: "costruisco ambienti digitali che non sono solo funzionali, ma durevoli. Dal concetto al rilascio, mi assicuro che ogni pixel, micro-interazione e millisecondo di latenza sia ottimizzato.",
        about_p3: "Il mio scopo non è scrivere semplicemente codice, ma unificare tecnologie all'avanguardia e design senza compromessi per consegnare prodotti digitali che ridefiniscono le aspettative dell'utente finale.",
        about_vision: "Visione",

        // Metrics
        metric_performance: "Prestazioni",
        metric_availability: "Disponibilità",
        metric_complexity: "Complessità",
        metric_complexity_val: "Minima",
        metric_experience: "Esperienza",
        metric_experience_val: "Premium",

        // Skills/Services overview
        skills_rigor: "Rigore Architetturale",
        skills_title: "Padroneggiare il Mestiere Digitale",
        skills_desc: "Il mio approccio unisce precisione ingegneristica e sensibilità estetica. Costruisco ambienti digitali che funzionano in modo impeccabile e ispirano gli utenti.",
        skills_perf_score: "Punteggio Prestazioni",
        skills_proj_deliv: "Progetti Consegnati",

        // Services
        service_mvp: "Sviluppo MVP",
        service_mvp_desc: "Trasforma idee in prodotti robusti e scalabili a tempo di record. Esecuzione full-stack da zero a uno.",
        service_frontend: "Architettura Frontend",
        service_frontend_desc: "Rinnova UI complesse con Next.js & React. Focus su implementazioni pixel-perfect e latenza ultra-bassa.",
        service_perf: "Auditing delle Prestazioni",
        service_perf_desc: "Analisi approfondita del codice per eliminare i colli di bottiglia, ottimizzare i bundle e raggiungere 99% su Lighthouse.",
        service_sys: "System Engineering",
        service_sys_desc: "Progettazione di architetture backend resilienti, sistemi di sincronizzazione in tempo reale e flussi di database altamente ottimizzati.",

        // Final CTA
        cta_ready: "Pronto a Sfidare la Gravità?",
        cta_btn: "Inizia una Collaborazione",

        // Footer
        footer_desc: "Costruisco architetture digitali sovrane per un internet più raffinato e performante.",
        footer_social: "Social Network",
        footer_focus: "Focus Principale",
        footer_focus_1: "Architettura",
        footer_focus_2: "Estetica",
        footer_focus_3: "Prestazioni",
        footer_contact: "Contattami",
        footer_rights: "Sviluppato da Abdel. Tutti i diritti riservati.",
        footer_privacy: "Privacy Policy",
        footer_terms: "Termini di Servizio",

        // Contact Form
        contact_badge: "Collaboriamo",
        contact_title: "Pronti a costruire",
        contact_title_highlight: "Qualcosa di Grande?",
        contact_subtitle: "Che tu abbia un progetto specifico in mente o voglia semplicemente esplorare le possibilità, sono qui per dare forma alla tua visione.",
        contact_name_label: "Il tuo Nome",
        contact_email_label: "Indirizzo Email",
        contact_msg_label: "Qual è la tua visione?",
        contact_msg_placeholder: "Raccontami del tuo progetto, degli obiettivi e di eventuali ispirazioni...",
        contact_send: "Invia Messaggio",
        contact_sending: "Trasmissione in corso...",
        contact_sent: "Inviato! Messaggio ricevuto",
        contact_policy_1: "Acconsento al trattamento dei dati personali in conformità con la ",
        contact_policy_2: "Privacy Policy",
        contact_policy_3: " per gestire questa richiesta.",

        // Floating CV
        cv_download: "Scarica il CV",
        cv_preparing: "Preparazione CV...",
        cv_hire: "Assumi la Visione",

        // Modal
        modal_challenge: "La Sfida",
        modal_architecture: "Architettura & Design",
        modal_tech: "Tecnologie Core",
        modal_impact: "Impatto & Metriche",
        modal_label: "Caso di Studio",
        modal_visit: "Visita il Sito Live",
        modal_port: "Porta",
        modal_deploy: "Visita",

        // Experience Timeline
        exp_section_label: "Percorso Professionale",
        exp_section_title: "Esperienza & Evoluzione",
        exp_1_title: "Senior Full-Stack Engineer",
        exp_1_desc: "Progettazione di applicazioni su scala enterprise e interfacce ad alte prestazioni per clienti globali.",
        exp_2_title: "Frontend Architect",
        exp_2_desc: "Ho guidato la migrazione di sistemi legacy a stack moderni con React/Next.js, migliorando le performance del 40%.",
        exp_3_title: "Software Engineer",
        exp_3_desc: "Sviluppo e manutenzione di applicazioni full-stack con React, Node.js e PostgreSQL.",
        exp_4_title: "Laurea in Informatica",
        exp_4_company: "Università di Tecnologia",
        exp_4_desc: "Laureato con lode. Specializzazione in sistemi distribuiti e interazione uomo-computer.",

        // Projects Data
        projects: {
            python: {
                title: "Python Masterclass",
                desc: "Una piattaforma educativa interattiva e completa, progettata da zero per l'apprendimento di Python.",
                challenge: "Creare un ambiente coinvolgente con zero setup dove i principianti potessero scrivere ed eseguire vero codice Python senza la complessità della configurazione locale.",
                architecture: "Costruito su un moderno Next.js 14 App Router, utilizzando una struttura monolitica robusta con parsing AST lato server e sandbox isolate per l'esecuzione del codice.",
                impact: "Barriera all'ingresso per i principianti di Python ridotta con successo, fornendo una transizione fluida dalla sintassi base a complessi pattern orientati agli oggetti."
            },
            grocery: {
                title: "Grocery Engine",
                desc: "Un'infrastruttura e-commerce moderna e altamente scalabile progettata per i beni di prima necessità.",
                challenge: "Gestire la complessa sincronizzazione dello stato del carrello e il tracciamento preciso dell'inventario su più sessioni utente simultanee senza latenza.",
                architecture: "Sfruttamento di un approccio headless commerce con un frontend Next.js reattivo, supportato da un livello API resiliente e aggiornamenti ottimistici della UI per un feeling in tempo reale.",
                impact: "Raggiunti tempi di interazione inferiori a 100ms per le operazioni del carrello, offrendo un'esperienza di acquisto senza attriti che massimizza i tassi di conversione."
            },
            climate: {
                title: "Climate Action Hub",
                desc: "Migliorare il cambiamento globale attraverso insight climatici traducibili in azioni.",
                challenge: "Visualizzare dataset ambientali complessi e di grande volume in modo intuitivo e performante per utenti non tecnici.",
                architecture: "Implementazione di un'architettura dashboard ricca di dati con efficiente caching client-side e tecniche di rendering progressivo.",
                impact: "Creata una piattaforma accessibile che traduce dati climatici grezzi in metriche chiare e azionabili per la consapevolezza ecologica."
            },
            diary: {
                title: "My Digital Diary",
                desc: "Applicazione di journaling personale e sicura con analisi del sentiment.",
                challenge: "Garantire assoluta privacy dei dati pur fornendo un'analisi intelligente e consapevole del contesto delle annotazioni personali.",
                architecture: "Architettura client-first con concetti di crittografia end-to-end e processamento leggero e localizzato dell'analisi del sentiment.",
                impact: "Consegnato uno spazio digitale altamente sicuro e privato che aiuta gli utenti a tracciare il loro benessere emotivo nel tempo."
            },
            translator: {
                title: "Polyglot Translator",
                desc: "Un ecosistema di traduzione multi-lingua senza interruzioni che sfrutta modelli NLP personalizzati e websocket a bassa latenza.",
                challenge: "Minimizzare la latenza di traduzione e mantenere il contesto attraverso thread conversazionali lunghi e complessi in tempo reale.",
                architecture: "Architettura WebSocket orientata agli eventi abbinata a risposte API in streaming, consentendo la consegna della traduzione carattere per carattere.",
                impact: "Abbagnate le barriere linguistiche con traduzioni quasi istantanee e contestualmente accurate per una comunicazione globale fluida."
            },
            meme: {
                title: "Meme Generator",
                desc: "Una suite per la creazione di contenuti virali dotata di capacità di elaborazione delle immagini accelerate via hardware.",
                challenge: "Costruire un motore di manipolazione delle immagini altamente reattivo e ricco di funzionalità interamente all'interno del browser senza sacrificare le prestazioni.",
                architecture: "Core basato su Canvas API avvolto in un livello di gestione dello stato React, utilizzando Web Workers per compiti pesanti di elaborazione delle immagini.",
                impact: "Creatori potenziati con uno strumento di livello professionale ma accessibile, guidando l'alto coinvolgimento degli utenti e la condivisione dei contenuti."
            },
            domino: {
                title: "Domino Online",
                desc: "Un'arena di gioco competitivo multiplayer in tempo reale con fisica bidimensionale personalizzata.",
                challenge: "Sincronizzare perfettamente lo stato del gioco in diverse condizioni di rete e implementare un'esperienza multiplayer in tempo reale equa e reattiva.",
                architecture: "Modello server autoritativo con previsione e interpolazione lato client, supportato da un'infrastruttura WebSocket scalabile.",
                impact: "Creato un ambiente multiplayer altamente avvincente e tecnicamente robusto in grado di gestire migliaia di partite simultanee."
            },
            portal: {
                title: "Class Portal",
                desc: "Hub educativo di nuova generazione che connette studenti e insegnanti.",
                challenge: "Progettare un'interfaccia intuitiva e unificata che serva senza interruzioni le esigenze distinte sia degli educatori che degli studenti.",
                architecture: "Architettura di controllo degli accessi basta sui ruoli con routing profondamente annidato e generazione dinamica della dashboard in base al contesto dell'utente.",
                impact: "Semplificati i flussi di lavoro amministrativi e aumentato il coinvolgimento degli studenti attraverso una piattaforma educativa centralizzata e moderna."
            }
        }
    }
};
