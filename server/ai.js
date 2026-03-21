import Anthropic from '@anthropic-ai/sdk';

// Client creato in modo lazy per leggere la chiave dopo il caricamento del .env
function getClient() {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY non impostata');
  }
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

function extractJSON(text) {
  // Rimuove blocchi markdown se presenti
  const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (match) return JSON.parse(match[1].trim());
  return JSON.parse(text.trim());
}

async function callClaude(prompt, maxTokens = 3000) {
  const message = await getClient().messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: maxTokens,
    messages: [{ role: 'user', content: prompt }],
  });
  return message.content[0].text;
}

// Genera parole per anagrammi
export async function generateAnagrams(tier, count = 40) {
  const configs = {
    1: { letters: '4-5', desc: 'parole comunissime di uso quotidiano, concrete e familiari', diff: 1 },
    2: { letters: '5-7', desc: 'parole comuni della vita quotidiana e cultura italiana', diff: 2 },
    3: { letters: '7-9', desc: 'parole più articolate ma ben conosciute dagli anziani italiani', diff: 3 },
    4: { letters: '7-10', desc: 'parole articolate legate a cultura, storia e tradizioni italiane', diff: 3 },
  };
  const { letters, desc, diff } = configs[tier] || configs[1];

  const prompt = `Genera ${count} parole italiane per un gioco di anagrammi destinato ad anziani italiani (65-75 anni).

Requisiti OBBLIGATORI:
- Lunghezza: ${letters} lettere
- Tipo: ${desc}
- Tutte MAIUSCOLE, SENZA accenti (scrivi AE invece di À, IE invece di È, etc.)
- Solo lettere A-Z, nessun apostrofo o trattino
- Evita parole offensive o volgari

Usa categorie VARIATE e DIVERSE dai soliti animali e frutta. Includi:
- Mestieri tradizionali (FALEGNAME, SARTO, MURATORE...)
- Cucina italiana (RISOTTO, POLENTA, CANNOLO...)
- Paesaggi italiani (COLLINA, PIANURA, GOLFO...)
- Oggetti di casa d'epoca (MADIA, BROCCA, CAMINETTO...)
- Feste e tradizioni (CARNEVALE, VENDEMMIA, SAGRA...)
- Musica (TENORE, OPERA, MANDOLINO...)
- Natura italiana (ULIVO, CIPRESSO, MIMOSA...)
- Arte (AFFRESCO, MOSAICO, SCULTURA...)
- Storia italiana (RISORGIMENTO è troppo lungo - usa PATRIA, REGNO, DUCATO...)
- Sport tradizionali (BOCCE, CICLISMO, NUOTO...)

L'emoji hint deve essere rappresentativa della parola.
La "category" deve essere in italiano e specifica (non solo "Oggetto").

Restituisci SOLO un array JSON valido senza markdown:
[{"word":"RISOTTO","category":"Cucina","hint":"🍚","difficulty":${diff}},...]`;

  const text = await callClaude(prompt);
  const items = extractJSON(text);

  return items.filter(item =>
    item.word && item.category && item.hint && item.difficulty &&
    /^[A-Z]+$/.test(item.word) && item.word.length >= 3 && item.word.length <= 12
  );
}

// Genera domande "trova l'intruso"
export async function generateOddOneOut(tier, count = 25) {
  const configs = {
    1: { desc: 'ragionamento molto ovvio e concreto, categorie chiarissime e immediate', diff: 1 },
    2: { desc: 'ragionamento concreto con qualche sfumatura in più', diff: 2 },
    3: { desc: 'ragionamento culturale, storico o con sottili distinzioni semantiche', diff: 3 },
    4: { desc: 'ragionamento complesso: logico avanzato, scientifico o culturale sottile', diff: 3 },
  };
  const { desc, diff } = configs[tier] || configs[1];

  const prompt = `Genera ${count} domande "trova l'intruso" in italiano per anziani italiani (65-75 anni).

Ogni domanda ha 4 elementi dove ESATTAMENTE UNO non appartiene agli altri tre.

Requisiti OBBLIGATORI:
- Difficoltà: ${desc}
- L'indice "odd" indica quale elemento è l'intruso (0=primo, 1=secondo, 2=terzo, 3=quarto)
- VARIA LA POSIZIONE dell'intruso: usa spesso 0, 1, 2 e 3, non solo 2 e 3
- La spiegazione deve essere chiara, educativa e gentile
- Ogni elemento: parola singola o al massimo 2 parole
- Niente elementi offensivi

Usa temi italiani VARIEDISSIMI:
- Gastronomia regionale (pasta, vini, formaggi, salumi italiani)
- Storia d'Italia (imperatori romani, eroi risorgimentali, papi, dogi)
- Arte italiana (pittori, scultori, architetti)
- Musica italiana (compositori, cantanti lirici, cantautori anni '60-'70)
- Cinema italiano (registi, attori)
- Regioni e città italiane (caratteristiche geografiche, monumenti)
- Natura italiana (fiumi, monti, laghi, piante tipiche)
- Sport italiani (campioni, discipline, competizioni)
- Tradizioni e feste regionali
- Scienza e invenzioni italiane
- Letteratura italiana (autori, personaggi celebri)

Restituisci SOLO un array JSON valido senza markdown:
[{"items":["Gatto","Cane","Carota","Pesce"],"odd":2,"explanation":"La carota è una verdura, gli altri sono animali","difficulty":${diff}},...]`;

  const text = await callClaude(prompt);
  const items = extractJSON(text);

  return items.filter(item =>
    Array.isArray(item.items) && item.items.length === 4 &&
    typeof item.odd === 'number' && item.odd >= 0 && item.odd <= 3 &&
    item.explanation && item.difficulty
  );
}

// Genera temi per il gioco Memory
export async function generateMemoryThemes(count = 8) {
  const prompt = `Genera ${count} temi diversi e variegati per un gioco di Memory per anziani italiani (65-75 anni).

Ogni tema ha un nome e almeno 16 emoji tematicamente coerenti.

I temi devono essere culturalmente rilevanti per anziani italiani e didatticamente interessanti.

Esempi di temi possibili (non usarli tutti, creane di originali):
- Animali della fattoria, Animali del mare, Animali della foresta, Uccelli italiani
- Strumenti musicali, Strumenti dell'orchestra
- Frutti del Mediterraneo, Verdure dell'orto, Erbe aromatiche
- Mezzi di trasporto storici, Veicoli moderni
- Oggetti di cucina, Attrezzi del falegname, Oggetti del sarto
- Fiori del giardino italiano, Alberi italiani
- Sport olimpici, Sport di squadra
- Corpi celesti, Fenomeni atmosferici
- Cibi italiani, Dolci italiani
- Monumenti e simboli italiani
- Feste e stagioni

Le emoji devono essere facilmente riconoscibili anche su schermi piccoli.

Restituisci SOLO un array JSON valido senza markdown:
[{"theme":"Animali del mare","emoji":["🐠","🐙","🦈","🐬","🦀","🐡","🦑","🐚","🦞","🐋","🦭","🐟","🦐","🌊","🐊","🪸"]},...]`;

  const text = await callClaude(prompt, 2000);
  const themes = extractJSON(text);

  return themes.filter(t =>
    t.theme && Array.isArray(t.emoji) && t.emoji.length >= 12
  );
}
