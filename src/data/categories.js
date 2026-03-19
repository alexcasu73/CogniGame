export const ODD_ONE_OUT_SETS = [
  // difficulty 1 — ragionamento concreto/ovvio
  { items: ['Gatto', 'Cane', 'Carota', 'Pesce'], odd: 2, explanation: 'La carota è una verdura, gli altri sono animali', difficulty: 1 },
  { items: ['Mela', 'Pera', 'Tavolo', 'Banana'], odd: 2, explanation: 'Il tavolo è un mobile, gli altri sono frutti', difficulty: 1 },
  { items: ['Roma', 'Parigi', 'Londra', 'Pizza'], odd: 3, explanation: 'La pizza è un cibo, le altre sono capitali', difficulty: 1 },
  { items: ['Pianoforte', 'Violino', 'Chitarra', 'Martello'], odd: 3, explanation: 'Il martello è uno strumento da lavoro, gli altri sono strumenti musicali', difficulty: 1 },
  { items: ['Rosa', 'Tulipano', 'Quercia', 'Girasole'], odd: 2, explanation: 'La quercia è un albero, gli altri sono fiori', difficulty: 1 },
  { items: ['Calcio', 'Tennis', 'Nuoto', 'Scacchi'], odd: 3, explanation: 'Gli scacchi sono un gioco di strategia, gli altri sono sport fisici', difficulty: 1 },
  { items: ['Rosso', 'Blu', 'Verde', 'Caldo'], odd: 3, explanation: 'Caldo è una sensazione, gli altri sono colori', difficulty: 1 },
  { items: ['Pane', 'Pasta', 'Riso', 'Salmone'], odd: 3, explanation: 'Il salmone è un pesce, gli altri sono carboidrati', difficulty: 1 },
  { items: ['Nonno', 'Zio', 'Amico', 'Nipote'], odd: 2, explanation: "L'amico non è un parente, gli altri sono familiari", difficulty: 1 },
  { items: ['Inverno', 'Estate', 'Marzo', 'Primavera'], odd: 2, explanation: 'Marzo è un mese, gli altri sono stagioni', difficulty: 1 },
  { items: ['Giornale', 'Libro', 'Rivista', 'Mattone'], odd: 3, explanation: 'Il mattone è materiale da costruzione, gli altri si leggono', difficulty: 1 },
  { items: ['Cuoco', 'Medico', 'Avvocato', 'Sedia'], odd: 3, explanation: 'La sedia è un oggetto, gli altri sono professioni', difficulty: 1 },
  { items: ['Lunedì', 'Martedì', 'Agosto', 'Giovedì'], odd: 2, explanation: 'Agosto è un mese, gli altri sono giorni della settimana', difficulty: 1 },
  // difficulty 2 — ragionamento leggermente meno ovvio
  { items: ['Sole', 'Luna', 'Stelle', 'Nuvola'], odd: 3, explanation: "Le nuvole stanno nell'atmosfera, gli altri sono corpi celesti", difficulty: 2 },
  { items: ['Ferrari', 'Vespa', 'Fiat', 'Lamborghini'], odd: 1, explanation: 'La Vespa è uno scooter, le altre sono auto', difficulty: 2 },
  { items: ['Venezia', 'Amsterdam', 'Roma', 'Bangkok'], odd: 2, explanation: 'Roma non è famosa per i canali, le altre tre lo sono', difficulty: 2 },
  { items: ['Quaglia', 'Cigno', 'Trota', 'Corvo'], odd: 2, explanation: 'La trota è un pesce, gli altri sono uccelli', difficulty: 2 },
  { items: ['Vino', 'Birra', 'Acqua', 'Succo'], odd: 2, explanation: "L'acqua non contiene zuccheri né alcol, le altre sì", difficulty: 2 },
  { items: ['Pino', 'Quercia', 'Betulla', 'Ciclamino'], odd: 3, explanation: 'Il ciclamino è un fiore, gli altri sono alberi', difficulty: 2 },
  { items: ['Treno', 'Autobus', 'Aereo', 'Bicicletta'], odd: 2, explanation: "L'aereo vola, gli altri viaggiano a terra", difficulty: 2 },
  { items: ['Ottobre', 'Novembre', 'Dicembre', 'Lunedì'], odd: 3, explanation: 'Lunedì è un giorno, gli altri sono mesi', difficulty: 2 },
  { items: ['Pianoforte', 'Flauto', 'Tromba', 'Clarinetto'], odd: 0, explanation: 'Il pianoforte è uno strumento a tasti/percussione, gli altri sono strumenti a fiato', difficulty: 2 },
  { items: ['Lago', 'Fiume', 'Mare', 'Montagna'], odd: 3, explanation: 'La montagna è terraferma, gli altri sono specchi o corsi d\'acqua', difficulty: 2 },
  // difficulty 3 — ragionamento astratto/culturale
  { items: ['Platone', 'Aristotele', 'Newton', 'Socrate'], odd: 2, explanation: 'Newton era un fisico/scienziato, gli altri sono filosofi greci', difficulty: 3 },
  { items: ['Mercurio', 'Venere', 'Luna', 'Marte'], odd: 2, explanation: 'La Luna è un satellite naturale, gli altri sono pianeti del sistema solare', difficulty: 3 },
  { items: ['Soprano', 'Tenore', 'Baritono', 'Pianista'], odd: 3, explanation: 'Il pianista è uno strumentista, gli altri sono voci liriche', difficulty: 3 },
  { items: ['Quadrato', 'Triangolo', 'Cerchio', 'Diagonale'], odd: 3, explanation: 'La diagonale è una linea, gli altri sono figure geometriche', difficulty: 3 },
  { items: ['Chitarra', 'Violino', 'Oboe', 'Basso'], odd: 2, explanation: "L'oboe è uno strumento a fiato, gli altri sono strumenti a corde", difficulty: 3 },
  { items: ['Pioggia', 'Neve', 'Grandine', 'Vento'], odd: 3, explanation: "Il vento è un movimento d'aria, gli altri sono precipitazioni atmosferiche", difficulty: 3 },
  { items: ['Picasso', 'Monet', 'Da Vinci', 'Mozart'], odd: 3, explanation: 'Mozart era un compositore musicale, gli altri sono pittori', difficulty: 3 },
  { items: ['Ottaviano', 'Nerone', 'Garibaldi', 'Traiano'], odd: 2, explanation: 'Garibaldi è un eroe risorgimentale, gli altri sono imperatori romani', difficulty: 3 },
  { items: ['Erbivoro', 'Carnivoro', 'Onnivoro', 'Mammifero'], odd: 3, explanation: 'Mammifero è una classe zoologica, gli altri descrivono il regime alimentare', difficulty: 3 },
  { items: ['Nettuno', 'Saturno', 'Plutone', 'Giove'], odd: 2, explanation: 'Plutone è classificato come pianeta nano, gli altri sono pianeti del sistema solare', difficulty: 3 },
  { items: ['Paragrafo', 'Frase', 'Parola', 'Pagina'], odd: 3, explanation: 'La pagina è un elemento fisico del libro, gli altri sono unità linguistiche', difficulty: 3 },
  { items: ['Penicillina', 'Aspirina', 'Morfina', 'Insulina'], odd: 2, explanation: 'La morfina è un oppioide analgesico, le altre sono farmaci di uso comune/vita-salvante', difficulty: 3 },
];

export function getSetsByDifficulty(maxDifficulty, minDifficulty = 1) {
  return ODD_ONE_OUT_SETS.filter(s => s.difficulty >= minDifficulty && s.difficulty <= maxDifficulty);
}

export const MEMORY_EMOJIS = [
  '🌸', '🦋', '🌺', '🍀', '🌻', '🦜',
  '🐠', '🌈', '⭐', '🌙', '🎵', '🎨',
  '🏠', '🌳', '🦁', '🐘', '🌊', '🎭',
  '🍎', '🍋', '🍓', '🍇', '🌷', '🎸',
  '🚀', '🎯', '🔮', '🦊', '🐸', '🎃',
  '🍕', '⚡', '🎪', '🌍', '🦄', '🐬',
];
