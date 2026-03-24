export interface WordAnalysis {
  word: string
  lemma: string
  partOfSpeech: string
  partOfSpeechFull: string
  morphology: string[]
  paradigm?: string
  syntacticFunction?: string
  translation: string
}

export interface SentenceAnalysis {
  original: string
  words: WordAnalysis[]
  structure: string
  constructions: string[]
  wordOrderNote: string
  literalTranslation: string
  fluentTranslation: string
}

// Grammar terminology tooltips
export const GRAMMAR_TOOLTIPS: Record<string, string> = {
  "nominativo": "Caso del soggetto e del predicato nominale",
  "genitivo": "Caso del complemento di specificazione",
  "dativo": "Caso del complemento di termine",
  "accusativo": "Caso del complemento oggetto e di moto a luogo",
  "vocativo": "Caso dell'invocazione e del richiamo",
  "ablativo": "Caso di vari complementi: mezzo, modo, causa, luogo",
  "singolare": "Indica una sola entità",
  "plurale": "Indica più entità",
  "maschile": "Genere grammaticale maschile",
  "femminile": "Genere grammaticale femminile",
  "neutro": "Genere grammaticale neutro",
  "presente": "Tempo dell'azione contemporanea",
  "imperfetto": "Tempo dell'azione durativa nel passato",
  "perfetto": "Tempo dell'azione compiuta nel passato",
  "piuccheperfetto": "Tempo dell'azione anteriore a un'altra passata",
  "futuro semplice": "Tempo dell'azione posteriore",
  "futuro anteriore": "Tempo dell'azione futura compiuta",
  "indicativo": "Modo della realtà e della certezza",
  "congiuntivo": "Modo della possibilità e del desiderio",
  "imperativo": "Modo del comando",
  "infinito": "Modo verbale non finito",
  "participio": "Forma nominale del verbo",
  "gerundio": "Forma nominale del verbo con funzione di complemento",
  "attivo": "Diatesi in cui il soggetto compie l'azione",
  "passivo": "Diatesi in cui il soggetto subisce l'azione",
  "deponente": "Verbo di forma passiva ma significato attivo",
  "soggetto": "Elemento che compie o subisce l'azione",
  "complemento oggetto": "Elemento su cui ricade l'azione",
  "complemento di termine": "Elemento a cui è destinata l'azione",
  "predicato verbale": "Il verbo che esprime l'azione",
  "attributo": "Aggettivo che si riferisce a un sostantivo",
  "apposizione": "Sostantivo che determina un altro sostantivo",
  "ablativo assoluto": "Costruzione participiale con valore circostanziale",
  "infinitiva": "Proposizione subordinata con il verbo all'infinito",
  "consecutiva": "Proposizione che esprime una conseguenza",
  "finale": "Proposizione che esprime uno scopo",
  "causale": "Proposizione che esprime una causa",
  "temporale": "Proposizione che indica circostanze di tempo",
}

// Sample Latin dictionary with grammatical information
export const LATIN_DICTIONARY: Record<string, Omit<WordAnalysis, "word">> = {
  // Verbs
  "amo": {
    lemma: "amo",
    partOfSpeech: "verbo",
    partOfSpeechFull: "verbo transitivo, I coniugazione",
    morphology: ["1ª persona", "singolare", "presente", "indicativo", "attivo"],
    paradigm: "amo, amas, amavi, amatum, amare",
    translation: "amo, io amo",
  },
  "amat": {
    lemma: "amo",
    partOfSpeech: "verbo",
    partOfSpeechFull: "verbo transitivo, I coniugazione",
    morphology: ["3ª persona", "singolare", "presente", "indicativo", "attivo"],
    paradigm: "amo, amas, amavi, amatum, amare",
    translation: "ama, egli/ella ama",
  },
  "amant": {
    lemma: "amo",
    partOfSpeech: "verbo",
    partOfSpeechFull: "verbo transitivo, I coniugazione",
    morphology: ["3ª persona", "plurale", "presente", "indicativo", "attivo"],
    paradigm: "amo, amas, amavi, amatum, amare",
    translation: "amano, essi amano",
  },
  "amare": {
    lemma: "amo",
    partOfSpeech: "verbo",
    partOfSpeechFull: "verbo transitivo, I coniugazione",
    morphology: ["infinito", "presente", "attivo"],
    paradigm: "amo, amas, amavi, amatum, amare",
    translation: "amare",
  },
  "sum": {
    lemma: "sum",
    partOfSpeech: "verbo",
    partOfSpeechFull: "verbo copulativo, anomalo",
    morphology: ["1ª persona", "singolare", "presente", "indicativo"],
    paradigm: "sum, es, fui, esse",
    translation: "sono, io sono",
  },
  "est": {
    lemma: "sum",
    partOfSpeech: "verbo",
    partOfSpeechFull: "verbo copulativo, anomalo",
    morphology: ["3ª persona", "singolare", "presente", "indicativo"],
    paradigm: "sum, es, fui, esse",
    translation: "è, egli/ella è",
  },
  "sunt": {
    lemma: "sum",
    partOfSpeech: "verbo",
    partOfSpeechFull: "verbo copulativo, anomalo",
    morphology: ["3ª persona", "plurale", "presente", "indicativo"],
    paradigm: "sum, es, fui, esse",
    translation: "sono, essi sono",
  },
  "video": {
    lemma: "video",
    partOfSpeech: "verbo",
    partOfSpeechFull: "verbo transitivo, II coniugazione",
    morphology: ["1ª persona", "singolare", "presente", "indicativo", "attivo"],
    paradigm: "video, vides, vidi, visum, videre",
    translation: "vedo, io vedo",
  },
  "videt": {
    lemma: "video",
    partOfSpeech: "verbo",
    partOfSpeechFull: "verbo transitivo, II coniugazione",
    morphology: ["3ª persona", "singolare", "presente", "indicativo", "attivo"],
    paradigm: "video, vides, vidi, visum, videre",
    translation: "vede, egli/ella vede",
  },
  "venit": {
    lemma: "venio",
    partOfSpeech: "verbo",
    partOfSpeechFull: "verbo intransitivo, IV coniugazione",
    morphology: ["3ª persona", "singolare", "presente", "indicativo", "attivo"],
    paradigm: "venio, venis, veni, ventum, venire",
    translation: "viene, egli/ella viene",
  },
  "legit": {
    lemma: "lego",
    partOfSpeech: "verbo",
    partOfSpeechFull: "verbo transitivo, III coniugazione",
    morphology: ["3ª persona", "singolare", "presente", "indicativo", "attivo"],
    paradigm: "lego, legis, legi, lectum, legere",
    translation: "legge, egli/ella legge",
  },
  "docet": {
    lemma: "doceo",
    partOfSpeech: "verbo",
    partOfSpeechFull: "verbo transitivo, II coniugazione",
    morphology: ["3ª persona", "singolare", "presente", "indicativo", "attivo"],
    paradigm: "doceo, doces, docui, doctum, docere",
    translation: "insegna, egli/ella insegna",
  },
  "dat": {
    lemma: "do",
    partOfSpeech: "verbo",
    partOfSpeechFull: "verbo transitivo, I coniugazione",
    morphology: ["3ª persona", "singolare", "presente", "indicativo", "attivo"],
    paradigm: "do, das, dedi, datum, dare",
    translation: "dà, egli/ella dà",
  },

  // Nouns - First Declension (feminine)
  "rosa": {
    lemma: "rosa",
    partOfSpeech: "nome",
    partOfSpeechFull: "sostantivo femminile, I declinazione",
    morphology: ["nominativo", "singolare", "femminile"],
    translation: "la rosa",
  },
  "rosam": {
    lemma: "rosa",
    partOfSpeech: "nome",
    partOfSpeechFull: "sostantivo femminile, I declinazione",
    morphology: ["accusativo", "singolare", "femminile"],
    translation: "la rosa (compl. oggetto)",
  },
  "rosae": {
    lemma: "rosa",
    partOfSpeech: "nome",
    partOfSpeechFull: "sostantivo femminile, I declinazione",
    morphology: ["genitivo/dativo", "singolare", "femminile"],
    translation: "della rosa / alla rosa",
  },
  "puella": {
    lemma: "puella",
    partOfSpeech: "nome",
    partOfSpeechFull: "sostantivo femminile, I declinazione",
    morphology: ["nominativo", "singolare", "femminile"],
    translation: "la fanciulla",
  },
  "puellam": {
    lemma: "puella",
    partOfSpeech: "nome",
    partOfSpeechFull: "sostantivo femminile, I declinazione",
    morphology: ["accusativo", "singolare", "femminile"],
    translation: "la fanciulla (compl. oggetto)",
  },
  "aqua": {
    lemma: "aqua",
    partOfSpeech: "nome",
    partOfSpeechFull: "sostantivo femminile, I declinazione",
    morphology: ["nominativo", "singolare", "femminile"],
    translation: "l'acqua",
  },
  "terra": {
    lemma: "terra",
    partOfSpeech: "nome",
    partOfSpeechFull: "sostantivo femminile, I declinazione",
    morphology: ["nominativo", "singolare", "femminile"],
    translation: "la terra",
  },
  "vita": {
    lemma: "vita",
    partOfSpeech: "nome",
    partOfSpeechFull: "sostantivo femminile, I declinazione",
    morphology: ["nominativo", "singolare", "femminile"],
    translation: "la vita",
  },

  // Nouns - Second Declension (masculine)
  "dominus": {
    lemma: "dominus",
    partOfSpeech: "nome",
    partOfSpeechFull: "sostantivo maschile, II declinazione",
    morphology: ["nominativo", "singolare", "maschile"],
    translation: "il signore, il padrone",
  },
  "dominum": {
    lemma: "dominus",
    partOfSpeech: "nome",
    partOfSpeechFull: "sostantivo maschile, II declinazione",
    morphology: ["accusativo", "singolare", "maschile"],
    translation: "il signore (compl. oggetto)",
  },
  "puer": {
    lemma: "puer",
    partOfSpeech: "nome",
    partOfSpeechFull: "sostantivo maschile, II declinazione",
    morphology: ["nominativo", "singolare", "maschile"],
    translation: "il fanciullo",
  },
  "puerum": {
    lemma: "puer",
    partOfSpeech: "nome",
    partOfSpeechFull: "sostantivo maschile, II declinazione",
    morphology: ["accusativo", "singolare", "maschile"],
    translation: "il fanciullo (compl. oggetto)",
  },
  "magister": {
    lemma: "magister",
    partOfSpeech: "nome",
    partOfSpeechFull: "sostantivo maschile, II declinazione",
    morphology: ["nominativo", "singolare", "maschile"],
    translation: "il maestro",
  },
  "magistrum": {
    lemma: "magister",
    partOfSpeech: "nome",
    partOfSpeechFull: "sostantivo maschile, II declinazione",
    morphology: ["accusativo", "singolare", "maschile"],
    translation: "il maestro (compl. oggetto)",
  },
  "discipulus": {
    lemma: "discipulus",
    partOfSpeech: "nome",
    partOfSpeechFull: "sostantivo maschile, II declinazione",
    morphology: ["nominativo", "singolare", "maschile"],
    translation: "l'allievo, il discepolo",
  },
  "discipulum": {
    lemma: "discipulus",
    partOfSpeech: "nome",
    partOfSpeechFull: "sostantivo maschile, II declinazione",
    morphology: ["accusativo", "singolare", "maschile"],
    translation: "l'allievo (compl. oggetto)",
  },
  "discipulos": {
    lemma: "discipulus",
    partOfSpeech: "nome",
    partOfSpeechFull: "sostantivo maschile, II declinazione",
    morphology: ["accusativo", "plurale", "maschile"],
    translation: "gli allievi (compl. oggetto)",
  },
  "liber": {
    lemma: "liber",
    partOfSpeech: "nome",
    partOfSpeechFull: "sostantivo maschile, II declinazione",
    morphology: ["nominativo", "singolare", "maschile"],
    translation: "il libro",
  },
  "librum": {
    lemma: "liber",
    partOfSpeech: "nome",
    partOfSpeechFull: "sostantivo maschile, II declinazione",
    morphology: ["accusativo", "singolare", "maschile"],
    translation: "il libro (compl. oggetto)",
  },

  // Second Declension (neuter)
  "bellum": {
    lemma: "bellum",
    partOfSpeech: "nome",
    partOfSpeechFull: "sostantivo neutro, II declinazione",
    morphology: ["nominativo/accusativo", "singolare", "neutro"],
    translation: "la guerra",
  },
  "templum": {
    lemma: "templum",
    partOfSpeech: "nome",
    partOfSpeechFull: "sostantivo neutro, II declinazione",
    morphology: ["nominativo/accusativo", "singolare", "neutro"],
    translation: "il tempio",
  },
  "verbum": {
    lemma: "verbum",
    partOfSpeech: "nome",
    partOfSpeechFull: "sostantivo neutro, II declinazione",
    morphology: ["nominativo/accusativo", "singolare", "neutro"],
    translation: "la parola",
  },

  // Third Declension
  "rex": {
    lemma: "rex",
    partOfSpeech: "nome",
    partOfSpeechFull: "sostantivo maschile, III declinazione",
    morphology: ["nominativo", "singolare", "maschile"],
    translation: "il re",
  },
  "regem": {
    lemma: "rex",
    partOfSpeech: "nome",
    partOfSpeechFull: "sostantivo maschile, III declinazione",
    morphology: ["accusativo", "singolare", "maschile"],
    translation: "il re (compl. oggetto)",
  },
  "miles": {
    lemma: "miles",
    partOfSpeech: "nome",
    partOfSpeechFull: "sostantivo maschile, III declinazione",
    morphology: ["nominativo", "singolare", "maschile"],
    translation: "il soldato",
  },
  "militem": {
    lemma: "miles",
    partOfSpeech: "nome",
    partOfSpeechFull: "sostantivo maschile, III declinazione",
    morphology: ["accusativo", "singolare", "maschile"],
    translation: "il soldato (compl. oggetto)",
  },
  "homo": {
    lemma: "homo",
    partOfSpeech: "nome",
    partOfSpeechFull: "sostantivo maschile, III declinazione",
    morphology: ["nominativo", "singolare", "maschile"],
    translation: "l'uomo",
  },
  "hominem": {
    lemma: "homo",
    partOfSpeech: "nome",
    partOfSpeechFull: "sostantivo maschile, III declinazione",
    morphology: ["accusativo", "singolare", "maschile"],
    translation: "l'uomo (compl. oggetto)",
  },

  // Adjectives
  "bonus": {
    lemma: "bonus",
    partOfSpeech: "aggettivo",
    partOfSpeechFull: "aggettivo I classe",
    morphology: ["nominativo", "singolare", "maschile"],
    translation: "buono",
  },
  "bonam": {
    lemma: "bonus",
    partOfSpeech: "aggettivo",
    partOfSpeechFull: "aggettivo I classe",
    morphology: ["accusativo", "singolare", "femminile"],
    translation: "buona",
  },
  "bona": {
    lemma: "bonus",
    partOfSpeech: "aggettivo",
    partOfSpeechFull: "aggettivo I classe",
    morphology: ["nominativo", "singolare", "femminile"],
    translation: "buona",
  },
  "magnus": {
    lemma: "magnus",
    partOfSpeech: "aggettivo",
    partOfSpeechFull: "aggettivo I classe",
    morphology: ["nominativo", "singolare", "maschile"],
    translation: "grande",
  },
  "magna": {
    lemma: "magnus",
    partOfSpeech: "aggettivo",
    partOfSpeechFull: "aggettivo I classe",
    morphology: ["nominativo", "singolare", "femminile"],
    translation: "grande",
  },
  "pulchra": {
    lemma: "pulcher",
    partOfSpeech: "aggettivo",
    partOfSpeechFull: "aggettivo I classe",
    morphology: ["nominativo", "singolare", "femminile"],
    translation: "bella",
  },
  "pulchram": {
    lemma: "pulcher",
    partOfSpeech: "aggettivo",
    partOfSpeechFull: "aggettivo I classe",
    morphology: ["accusativo", "singolare", "femminile"],
    translation: "bella",
  },
  "brevis": {
    lemma: "brevis",
    partOfSpeech: "aggettivo",
    partOfSpeechFull: "aggettivo II classe",
    morphology: ["nominativo", "singolare", "maschile/femminile"],
    translation: "breve",
  },

  // Pronouns
  "ego": {
    lemma: "ego",
    partOfSpeech: "pronome",
    partOfSpeechFull: "pronome personale",
    morphology: ["nominativo", "singolare", "1ª persona"],
    translation: "io",
  },
  "tu": {
    lemma: "tu",
    partOfSpeech: "pronome",
    partOfSpeechFull: "pronome personale",
    morphology: ["nominativo", "singolare", "2ª persona"],
    translation: "tu",
  },
  "nos": {
    lemma: "nos",
    partOfSpeech: "pronome",
    partOfSpeechFull: "pronome personale",
    morphology: ["nominativo", "plurale", "1ª persona"],
    translation: "noi",
  },
  "vos": {
    lemma: "vos",
    partOfSpeech: "pronome",
    partOfSpeechFull: "pronome personale",
    morphology: ["nominativo", "plurale", "2ª persona"],
    translation: "voi",
  },
  "hic": {
    lemma: "hic",
    partOfSpeech: "pronome",
    partOfSpeechFull: "pronome dimostrativo",
    morphology: ["nominativo", "singolare", "maschile"],
    translation: "questo",
  },
  "ille": {
    lemma: "ille",
    partOfSpeech: "pronome",
    partOfSpeechFull: "pronome dimostrativo",
    morphology: ["nominativo", "singolare", "maschile"],
    translation: "quello",
  },
  "qui": {
    lemma: "qui",
    partOfSpeech: "pronome",
    partOfSpeechFull: "pronome relativo",
    morphology: ["nominativo", "singolare", "maschile"],
    translation: "che, il quale",
  },
  "quod": {
    lemma: "qui",
    partOfSpeech: "pronome/congiunzione",
    partOfSpeechFull: "pronome relativo / congiunzione",
    morphology: ["nominativo/accusativo", "singolare", "neutro"],
    translation: "che, il quale / poiché",
  },

  // Prepositions and conjunctions
  "in": {
    lemma: "in",
    partOfSpeech: "preposizione",
    partOfSpeechFull: "preposizione (+ acc./abl.)",
    morphology: [],
    translation: "in, dentro, verso",
  },
  "ad": {
    lemma: "ad",
    partOfSpeech: "preposizione",
    partOfSpeechFull: "preposizione (+ accusativo)",
    morphology: [],
    translation: "verso, a, presso",
  },
  "cum": {
    lemma: "cum",
    partOfSpeech: "preposizione/congiunzione",
    partOfSpeechFull: "preposizione (+ ablativo) / congiunzione",
    morphology: [],
    translation: "con / quando, poiché",
  },
  "et": {
    lemma: "et",
    partOfSpeech: "congiunzione",
    partOfSpeechFull: "congiunzione coordinante",
    morphology: [],
    translation: "e, anche",
  },
  "sed": {
    lemma: "sed",
    partOfSpeech: "congiunzione",
    partOfSpeechFull: "congiunzione avversativa",
    morphology: [],
    translation: "ma, però",
  },
  "non": {
    lemma: "non",
    partOfSpeech: "avverbio",
    partOfSpeechFull: "avverbio di negazione",
    morphology: [],
    translation: "non",
  },
  "quia": {
    lemma: "quia",
    partOfSpeech: "congiunzione",
    partOfSpeechFull: "congiunzione causale",
    morphology: [],
    translation: "perché, poiché",
  },
  "ut": {
    lemma: "ut",
    partOfSpeech: "congiunzione",
    partOfSpeechFull: "congiunzione finale/consecutiva",
    morphology: [],
    translation: "affinché, così che, come",
  },

  // Additional common words
  "dei": {
    lemma: "deus",
    partOfSpeech: "nome",
    partOfSpeechFull: "sostantivo maschile, II declinazione",
    morphology: ["genitivo", "singolare", "maschile"],
    translation: "di Dio, del dio",
  },
  "deus": {
    lemma: "deus",
    partOfSpeech: "nome",
    partOfSpeechFull: "sostantivo maschile, II declinazione",
    morphology: ["nominativo", "singolare", "maschile"],
    translation: "Dio, il dio",
  },
  "amor": {
    lemma: "amor",
    partOfSpeech: "nome",
    partOfSpeechFull: "sostantivo maschile, III declinazione",
    morphology: ["nominativo", "singolare", "maschile"],
    translation: "l'amore",
  },
  "amorem": {
    lemma: "amor",
    partOfSpeech: "nome",
    partOfSpeechFull: "sostantivo maschile, III declinazione",
    morphology: ["accusativo", "singolare", "maschile"],
    translation: "l'amore (compl. oggetto)",
  },
  "lux": {
    lemma: "lux",
    partOfSpeech: "nome",
    partOfSpeechFull: "sostantivo femminile, III declinazione",
    morphology: ["nominativo", "singolare", "femminile"],
    translation: "la luce",
  },
  "mundi": {
    lemma: "mundus",
    partOfSpeech: "nome",
    partOfSpeechFull: "sostantivo maschile, II declinazione",
    morphology: ["genitivo", "singolare", "maschile"],
    translation: "del mondo",
  },
  "mundus": {
    lemma: "mundus",
    partOfSpeech: "nome",
    partOfSpeechFull: "sostantivo maschile, II declinazione",
    morphology: ["nominativo", "singolare", "maschile"],
    translation: "il mondo",
  },
  "veritas": {
    lemma: "veritas",
    partOfSpeech: "nome",
    partOfSpeechFull: "sostantivo femminile, III declinazione",
    morphology: ["nominativo", "singolare", "femminile"],
    translation: "la verità",
  },
  "veritatem": {
    lemma: "veritas",
    partOfSpeech: "nome",
    partOfSpeechFull: "sostantivo femminile, III declinazione",
    morphology: ["accusativo", "singolare", "femminile"],
    translation: "la verità (compl. oggetto)",
  },
}

// Sample sentences for analysis
export const SAMPLE_SENTENCES: Record<string, SentenceAnalysis> = {
  "puella rosam amat": {
    original: "Puella rosam amat",
    words: [
      {
        ...LATIN_DICTIONARY["puella"],
        word: "puella",
        syntacticFunction: "soggetto",
      },
      {
        ...LATIN_DICTIONARY["rosam"],
        word: "rosam",
        syntacticFunction: "complemento oggetto",
      },
      {
        ...LATIN_DICTIONARY["amat"],
        word: "amat",
        syntacticFunction: "predicato verbale",
      },
    ],
    structure: "Soggetto + Complemento oggetto + Predicato verbale",
    constructions: ["Frase semplice attiva"],
    wordOrderNote: "Ordine tipico latino: SOV (Soggetto-Oggetto-Verbo), diverso dall'italiano SVO",
    literalTranslation: "La fanciulla la rosa ama",
    fluentTranslation: "La fanciulla ama la rosa",
  },
  "magister discipulos docet": {
    original: "Magister discipulos docet",
    words: [
      {
        ...LATIN_DICTIONARY["magister"],
        word: "magister",
        syntacticFunction: "soggetto",
      },
      {
        ...LATIN_DICTIONARY["discipulos"],
        word: "discipulos",
        syntacticFunction: "complemento oggetto",
      },
      {
        ...LATIN_DICTIONARY["docet"],
        word: "docet",
        syntacticFunction: "predicato verbale",
      },
    ],
    structure: "Soggetto + Complemento oggetto + Predicato verbale",
    constructions: ["Frase semplice attiva"],
    wordOrderNote: "Ordine SOV tipico del latino classico",
    literalTranslation: "Il maestro gli allievi insegna",
    fluentTranslation: "Il maestro insegna agli allievi",
  },
  "rosa pulchra est": {
    original: "Rosa pulchra est",
    words: [
      {
        ...LATIN_DICTIONARY["rosa"],
        word: "rosa",
        syntacticFunction: "soggetto",
      },
      {
        ...LATIN_DICTIONARY["pulchra"],
        word: "pulchra",
        syntacticFunction: "predicato nominale (nome del predicato)",
      },
      {
        ...LATIN_DICTIONARY["est"],
        word: "est",
        syntacticFunction: "copula",
      },
    ],
    structure: "Soggetto + Predicato nominale (nome del predicato + copula)",
    constructions: ["Frase nominale con copula"],
    wordOrderNote: "Il verbo essere (copula) è spesso posto alla fine",
    literalTranslation: "La rosa bella è",
    fluentTranslation: "La rosa è bella",
  },
  "puer librum legit": {
    original: "Puer librum legit",
    words: [
      {
        ...LATIN_DICTIONARY["puer"],
        word: "puer",
        syntacticFunction: "soggetto",
      },
      {
        ...LATIN_DICTIONARY["librum"],
        word: "librum",
        syntacticFunction: "complemento oggetto",
      },
      {
        ...LATIN_DICTIONARY["legit"],
        word: "legit",
        syntacticFunction: "predicato verbale",
      },
    ],
    structure: "Soggetto + Complemento oggetto + Predicato verbale",
    constructions: ["Frase semplice attiva"],
    wordOrderNote: "Ordine SOV standard",
    literalTranslation: "Il fanciullo il libro legge",
    fluentTranslation: "Il fanciullo legge il libro",
  },
  "amor vincit omnia": {
    original: "Amor vincit omnia",
    words: [
      {
        ...LATIN_DICTIONARY["amor"],
        word: "amor",
        syntacticFunction: "soggetto",
      },
      {
        lemma: "vinco",
        partOfSpeech: "verbo",
        partOfSpeechFull: "verbo transitivo, III coniugazione",
        morphology: ["3ª persona", "singolare", "presente", "indicativo", "attivo"],
        paradigm: "vinco, vincis, vici, victum, vincere",
        translation: "vince",
        word: "vincit",
        syntacticFunction: "predicato verbale",
      },
      {
        lemma: "omnis",
        partOfSpeech: "aggettivo sostantivato",
        partOfSpeechFull: "aggettivo/pronome II classe",
        morphology: ["accusativo", "plurale", "neutro"],
        translation: "tutte le cose, tutto",
        word: "omnia",
        syntacticFunction: "complemento oggetto",
      },
    ],
    structure: "Soggetto + Predicato verbale + Complemento oggetto",
    constructions: ["Frase semplice attiva", "Sentenza proverbiale"],
    wordOrderNote: "Ordine SVO, meno comune ma usato per enfasi",
    literalTranslation: "L'amore vince tutte le cose",
    fluentTranslation: "L'amore vince tutto",
  },
}

export function analyzeWord(word: string): WordAnalysis | null {
  const cleanWord = word.toLowerCase().replace(/[.,!?;:]/g, "")
  const analysis = LATIN_DICTIONARY[cleanWord]
  
  if (analysis) {
    return {
      ...analysis,
      word: cleanWord,
    }
  }
  
  return null
}

export function analyzeSentence(sentence: string): SentenceAnalysis | null {
  const normalizedSentence = sentence.toLowerCase().trim().replace(/[.,!?;:]/g, "")
  
  // Check if we have a pre-analyzed sentence
  if (SAMPLE_SENTENCES[normalizedSentence]) {
    return SAMPLE_SENTENCES[normalizedSentence]
  }
  
  // Try to analyze word by word
  const words = sentence.split(/\s+/).filter(w => w.length > 0)
  const analyzedWords: WordAnalysis[] = []
  
  for (const word of words) {
    const analysis = analyzeWord(word)
    if (analysis) {
      analyzedWords.push(analysis)
    } else {
      analyzedWords.push({
        word: word.toLowerCase().replace(/[.,!?;:]/g, ""),
        lemma: "?",
        partOfSpeech: "sconosciuto",
        partOfSpeechFull: "Parola non presente nel dizionario",
        morphology: [],
        translation: "[traduzione non disponibile]",
      })
    }
  }
  
  // Generate a basic analysis
  const translations = analyzedWords.map(w => w.translation.split(",")[0]).join(" ")
  
  return {
    original: sentence,
    words: analyzedWords,
    structure: "Analisi strutturale da completare",
    constructions: ["Analisi delle costruzioni da completare"],
    wordOrderNote: "L'ordine delle parole in latino è generalmente libero, con tendenza SOV",
    literalTranslation: translations,
    fluentTranslation: translations,
  }
}
