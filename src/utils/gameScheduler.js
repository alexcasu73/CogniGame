const GAMES = ['memory', 'anagram', 'stroop', 'sequence', 'math', 'oddoneout'];

export function getTodayGame() {
  const today = new Date().toISOString().split('T')[0];
  const hash = today.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return GAMES[hash % GAMES.length];
}

export function getGameInfo(type) {
  const info = {
    memory: { name: 'Memoria', icon: '🧩', color: 'from-purple-500 to-purple-700', desc: 'Trova le coppie di carte uguali', skill: 'Memoria episodica' },
    anagram: { name: 'Anagrammi', icon: '🔤', color: 'from-blue-500 to-blue-700', desc: 'Ricomponi le parole mescolate', skill: 'Linguaggio' },
    stroop: { name: 'Stroop', icon: '🎨', color: 'from-red-500 to-red-700', desc: 'Riconosci il colore, non la parola', skill: 'Attenzione' },
    sequence: { name: 'Sequenza', icon: '🎵', color: 'from-green-500 to-green-700', desc: 'Ricorda e ripeti la sequenza', skill: 'Memoria di lavoro' },
    math: { name: 'Matematica', icon: '🔢', color: 'from-orange-500 to-orange-700', desc: 'Calcoli veloci nella mente', skill: 'Calcolo mentale' },
    oddoneout: { name: 'Trova l\'Intruso', icon: '🔍', color: 'from-teal-500 to-teal-700', desc: 'Trova l\'elemento diverso', skill: 'Ragionamento' },
  };
  return info[type];
}

export function getNextGame(currentType) {
  const idx = GAMES.indexOf(currentType);
  return GAMES[(idx + 1) % GAMES.length];
}

// Restituisce il gioco bonus all'offset dato (1 = primo bonus, 2 = secondo, ecc.)
// Salta sempre il gioco di oggi (offset 0)
export function getBonusGame(todayType, offset) {
  const todayIdx = GAMES.indexOf(todayType);
  const bonusOffset = ((offset - 1) % (GAMES.length - 1)) + 1; // sempre 1..5
  return GAMES[(todayIdx + bonusOffset) % GAMES.length];
}

export const ALL_GAMES = GAMES;
