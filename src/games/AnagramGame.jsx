import { useState, useEffect, useCallback } from 'react';
import { getWordsByDifficulty, scrambleWord } from '../data/words';
import GameWrapper from '../components/GameWrapper';
import { getDifficultyTier } from '../utils/scoring';
import { fetchAnagramContent } from '../api';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const TIER_CONFIG = {
  1: { total: 8,  minDiff: 1, maxDiff: 1, timeLimit: 180 },
  2: { total: 8,  minDiff: 1, maxDiff: 2, timeLimit: 200 },
  3: { total: 10, minDiff: 2, maxDiff: 3, timeLimit: 240 },
  4: { total: 12, minDiff: 3, maxDiff: 3, timeLimit: 270 },
};

function getStaticWords(tier) {
  const { total, minDiff, maxDiff } = TIER_CONFIG[tier];
  const pool = getWordsByDifficulty(maxDiff, minDiff);
  return shuffle(pool).slice(0, total);
}

export default function AnagramGame({ onComplete, level = 1 }) {
  const tier = getDifficultyTier(level);
  const { total: TOTAL, timeLimit } = TIER_CONFIG[tier];

  const [words, setWords] = useState(null); // null = caricamento
  const [current, setCurrent] = useState(0);
  const [scrambled, setScrambled] = useState('');
  const [selected, setSelected] = useState([]);
  const [available, setAvailable] = useState([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [shake, setShake] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Carica contenuti AI, fallback a statici
  useEffect(() => {
    fetchAnagramContent(tier, TOTAL).then(items => {
      if (items && items.length >= TOTAL) {
        setWords(items.slice(0, TOTAL));
      } else {
        setWords(getStaticWords(tier));
      }
    });
  }, [tier, TOTAL]);

  useEffect(() => {
    if (!words || current >= TOTAL) {
      if (words && current >= TOTAL) setGameOver(true);
      return;
    }
    const w = words[current];
    const s = scrambleWord(w.word);
    setScrambled(s);
    setAvailable(s.split('').map((l, i) => ({ id: i, letter: l, used: false })));
    setSelected([]);
    setFeedback(null);
    setAttempts(0);
  }, [current, words, TOTAL]);

  const selectLetter = useCallback((item) => {
    if (item.used || !words) return;
    setAvailable(av => av.map(a => a.id === item.id ? { ...a, used: true } : a));
    const newSelected = [...selected, item];
    setSelected(newSelected);

    const formed = newSelected.map(i => i.letter).join('');
    const target = words[current].word;

    if (formed.length === target.length) {
      if (formed === target) {
        setFeedback('correct');
        setScore(s => s + 10);
        setTimeout(() => setCurrent(c => c + 1), 800);
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        if (newAttempts >= 3) {
          // Terzo errore: mostra la risposta e vai avanti
          setFeedback('revealed');
          setTimeout(() => setCurrent(c => c + 1), 2500);
        } else {
          setFeedback('wrong');
          setShake(true);
          setTimeout(() => {
            setShake(false);
            setAvailable(av => av.map(a => ({ ...a, used: false })));
            setSelected([]);
            setFeedback(null);
          }, 600);
        }
      }
    }
  }, [selected, words, current]);

  const removeLast = useCallback(() => {
    if (selected.length === 0) return;
    const last = selected[selected.length - 1];
    setAvailable(av => av.map(a => a.id === last.id ? { ...a, used: false } : a));
    setSelected(s => s.slice(0, -1));
  }, [selected]);

  const word = words ? words[current] : null;

  return (
    <GameWrapper
      title="Anagrammi" icon="🔤" color="from-blue-500 to-blue-700"
      skillName="Linguaggio & Fluidità verbale"
      maxScore={TOTAL * 10} score={score}
      gameOver={gameOver} onComplete={onComplete}
      instructions={`Ricomponi ${TOTAL} parole mescolate. Tocca le lettere nell'ordine corretto. La categoria ti aiuta come indizio!`}
      timeLimit={timeLimit}
      difficulty={tier}
    >
      {!words && !gameOver && (
        <div className="flex flex-col items-center gap-4 pt-10">
          <div className="animate-spin text-5xl">🔤</div>
          <p className="text-blue-700 font-semibold text-lg">Preparo le parole...</p>
        </div>
      )}

      {words && !gameOver && word && (
        <div className="flex flex-col items-center gap-5 pt-2">
          <div className="text-center bg-white rounded-2xl p-4 w-full shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Parola {current + 1} di {TOTAL}</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
              <div className="bg-blue-500 h-2 rounded-full transition-all" style={{width: `${(current/TOTAL)*100}%`}}/>
            </div>
            <div className="text-4xl mb-1">{word.hint}</div>
            <p className="text-blue-600 font-semibold text-lg">Categoria: {word.category}</p>
          </div>

          <div className={`flex gap-2 flex-wrap justify-center min-h-[60px] bg-blue-50 rounded-2xl p-4 w-full border-2 ${feedback === 'correct' ? 'border-green-400 bg-green-50' : feedback === 'wrong' ? 'border-red-400 bg-red-50' : 'border-blue-200'} ${shake ? 'shake' : ''}`}>
            {selected.map((item, i) => (
              <div key={i} className="w-11 h-11 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-xl shadow-sm">
                {item.letter}
              </div>
            ))}
            {selected.length === 0 && <p className="text-gray-400 self-center">Tocca le lettere...</p>}
          </div>

          {feedback === 'correct' && <p className="text-green-600 font-bold text-xl animate-pop">✅ Bravo!</p>}
          {feedback === 'revealed' && (
            <div className="text-center bg-orange-50 border border-orange-200 rounded-2xl p-3 w-full">
              <p className="text-orange-700 font-bold text-lg">⏱️ La risposta era:</p>
              <p className="text-orange-800 font-black text-2xl tracking-widest">{word.word}</p>
            </div>
          )}

          <div className="flex gap-2 flex-wrap justify-center">
            {available.map(item => (
              <button
                key={item.id}
                onClick={() => selectLetter(item)}
                disabled={item.used}
                className={`w-12 h-12 rounded-xl font-bold text-xl shadow-md transition-all active:scale-90 ${item.used ? 'bg-gray-200 text-gray-400' : 'bg-white text-gray-800 border-2 border-blue-300 hover:bg-blue-50'}`}
              >
                {item.letter}
              </button>
            ))}
          </div>

          <button onClick={removeLast} className="text-gray-500 text-sm underline">
            ← Cancella ultima lettera
          </button>
        </div>
      )}
    </GameWrapper>
  );
}
