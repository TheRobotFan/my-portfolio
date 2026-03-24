export type Language = "EN" | "IT"

export const dictionary = {
    EN: {
        // Navigation
        nav_modern: "Modern",
        nav_ancient: "Ancient",
        nav_features: "Work",
        nav_about: "Philosophy",
        nav_back: "Back",
        nav_by: "by Abdel",

        // Hero
        hero_badge: "Universal Communication",
        hero_title: "Breaking barriers through",
        hero_title_highlight: "technology",
        hero_subtitle: "An advanced translation engine bridging the gap between historical scripts and modern global languages with AetherDev precision.",
        hero_cta_start: "Start Translating",
        hero_cta_learn: "Learn More",

        // Translator General
        translator_mode_modern: "Modern Languages",
        translator_mode_ancient: "Ancient Scripts",
        translator_switch: "Switch Mode",
        translator_swap: "Swap Languages",
        translator_copy: "Copy to Clipboard",
        translator_copied: "Copied!",
        translator_speak: "Listen",
        translator_translating: "Translating...",
        translator_placeholder: "Type something to translate...",
        translator_no_results: "Translation will appear here...",

        // Modern Translator
        modern_title: "Modern Global Languages",
        modern_subtitle: "Fast and precise translations across major world languages using advanced linguistic models.",
        modern_characters: "characters",
        modern_common_phrases: "Common Phrases",
        modern_click_to_translate: "Click to translate",
        modern_supported_languages: "Supported Languages",

        // Ancient Translator
        ancient_title: "Ancient Scripts & Heritage",
        ancient_subtitle: "Detailed grammatical analysis and translation for historical research and linguistic study.",
        ancient_badge: "Academic Tool",
        ancient_analyze: "Analyze & Translate",
        ancient_analyzing: "Analyzing...",
        ancient_original: "Original Sentence",
        ancient_translation_literal: "Literal Translation",
        ancient_translation_fluent: "Fluent Translation",
        ancient_word_analysis: "Word-by-word Analysis",
        ancient_sentence_structure: "Sentence Structure",
        ancient_logic: "Logical Structure",
        ancient_constructions: "Special Constructions",
        ancient_word_order: "Word Order Notes",
        ancient_legend: "Syntactic Legend",
        ancient_lemma: "Lemma",
        ancient_pos: "Part of Speech",
        ancient_morphology: "Morphological Analysis",
        ancient_paradigm: "Paradigm",
        ancient_function: "Syntactic Function",
        ancient_examples: "Sample sentences to analyze",
        ancient_soon: "soon",

        // Features
        features_title: "Next-Gen Translation Interface",
        features_subtitle: "Powering global communication with a sophisticated, intuitive, and responsive design system.",
        feature_fast_title: "Instant Processing",
        feature_fast_desc: "Real-time translation results with sub-second latency for seamless conversation.",
        feature_academic_title: "Academic Depth",
        feature_academic_desc: "Deep linguistic analysis for dead languages, perfect for researchers and students.",
        feature_responsive_title: "Universal Design",
        feature_responsive_desc: "Pixel-perfect experience across all devices, from desktop to mobile.",

        // Footer
        footer_text: "Engineered with passion for global connectivity.",
        brand_subtext: "Engineering the Future of Language",
        cta_ready: "Ready to connect the world?",
        cta_start_free: "Start Now - It's Free",
    },
    IT: {
        // Navigation
        nav_modern: "Moderno",
        nav_ancient: "Antico",
        nav_features: "Lavori",
        nav_about: "Filosofia",
        nav_back: "Indietro",
        nav_by: "di Abdel",

        // Hero
        hero_badge: "Comunicazione Universale",
        hero_title: "Abbattiamo le barriere con la",
        hero_title_highlight: "tecnologia",
        hero_subtitle: "Un motore di traduzione avanzato che colma il divario tra scritti storici e lingue globali moderne con la precisione di AetherDev.",
        hero_cta_start: "Inizia a Tradurre",
        hero_cta_learn: "Scopri di più",

        // Translator General
        translator_mode_modern: "Lingue Moderne",
        translator_mode_ancient: "Lingue Antiche",
        translator_switch: "Cambia Modalità",
        translator_swap: "Inverti Lingue",
        translator_copy: "Copia negli Appunti",
        translator_copied: "Copiato!",
        translator_speak: "Ascolta",
        translator_translating: "Traduzione in corso...",
        translator_placeholder: "Inserisci il testo da tradurre...",
        translator_no_results: "La traduzione apparirà qui...",

        // Modern Translator
        modern_title: "Lingue Globali Moderne",
        modern_subtitle: "Traduzioni rapide e precise tra le principali lingue del mondo utilizzando modelli linguistici avanzati.",
        modern_characters: "caratteri",
        modern_common_phrases: "Frasi Comuni",
        modern_click_to_translate: "Clicca per tradurre",
        modern_supported_languages: "Lingue Supportate",

        // Ancient Translator
        ancient_title: "Lingue Antiche e Storia",
        ancient_subtitle: "Analisi grammaticale dettagliata e traduzione per la ricerca storica e lo studio linguistico.",
        ancient_badge: "Strumento Didattico",
        ancient_analyze: "Analizza e Traduci",
        ancient_analyzing: "Analisi in corso...",
        ancient_original: "Frase Originale",
        ancient_translation_literal: "Traduzione Letterale",
        ancient_translation_fluent: "Traduzione Scorrevole",
        ancient_word_analysis: "Analisi Parola per Parola",
        ancient_sentence_structure: "Analisi della Frase",
        ancient_logic: "Struttura Logica",
        ancient_constructions: "Costruzioni Particolari",
        ancient_word_order: "Ordine delle Parole",
        ancient_legend: "Legenda Funzioni Sintattiche",
        ancient_lemma: "Lemma",
        ancient_pos: "Parte del Discorso",
        ancient_morphology: "Analisi Morfologica",
        ancient_paradigm: "Paradigm",
        ancient_function: "Funzione Sintattica",
        ancient_examples: "Frasi di esempio da analizzare",
        ancient_soon: "presto",

        // Features
        features_title: "Interfaccia di Traduzione Next-Gen",
        features_subtitle: "Potenzia la comunicazione globale con un sistema di design sofisticato, intuitivo e reattivo.",
        feature_fast_title: "Elaborazione Istantanea",
        feature_fast_desc: "Risultati in tempo reale con latenza minima per una conversazione senza interruzioni.",
        feature_academic_title: "Profondità Accademica",
        feature_academic_desc: "Analisi linguistica profonda per lingue morte, perfetta per ricercatori e studenti.",
        feature_responsive_title: "Design Universale",
        feature_responsive_desc: "Esperienza perfetta su tutti i dispositivi, dal desktop al mobile.",

        // Footer
        footer_text: "Ingegnerizzato con passione per la connettività globale.",
        brand_subtext: "Ingegnerizzare il Futuro del Linguaggio",
        cta_ready: "Pronto a connettere il mondo?",
        cta_start_free: "Inizia Ora - È gratis",
    },
}

export type Dictionary = typeof dictionary.EN
export type DictionaryKey = keyof Dictionary
