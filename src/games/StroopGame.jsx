import { useState, useEffect, useCallback } from 'react';
import GameWrapper from '../components/GameWrapper';
import { getDifficultyTier } from '../utils/scoring';

const COLORS = [
  { name: 'ROSSO', bg: 'bg-red-500', text: 'text-red-600' },
  { name: 'BLU', bg: 'bg-blue-500', text: 'text-blue-600' },
  { name: 'VERDE', bg: 'bg-green-500', text: 'text-green-600' },
  { name: 'GIALLO', bg: 'bg-yellow-400', text: 'text-yellow-500' },
  { name: 'VIOLA', bg: 'bg-purple-500', text: 'text-purple-600' },
  { name: 'ARANCIO', bg: 'bg-orange-500', text: 'text-orange-500' },
];

// Tier 1: 12 round, 120s
// Tier 2: 16 round, 140s
// Tier 3: 20 round, 160s
// Tier 4: 24 round, 180s
const TIER_CONFIG = {
  1: { total: 12, timeLimit: 120 },
  2: { total: 16, timeLimit: 140 },
  3: { total: 20, timeLimit: 160 },
  4: { total: 24, timeLimit: 180 },
};

function generateRound() {
  const wordColor = COLORS[Math.floor(Math.random() * COLORS.length)];
  let inkColor;
  do { inkColor = COLORS[Math.floor(Math.random() * COLORS.length)]; }
  while (inkColor.name === wordColor.name);
  return { wordColor, inkColor };
}

export default function StroopGame({ onComplete, level = 1 }) {
  const tier = getDifficultyTier(level);
  const { total: TOTAL, timeLimit } = TIER_CONFIG[tier];

  const [round, setRound] = useState(() => generateRound());
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  const answer = useCallback((colorName) => {
    if (feedback) return;
    const correct = colorName === round.inkColor.name;
    setFeedback(correct ? 'correct' : 'wrong');
    if (correct) setScore(s => s + 10);

    setTimeout(() => {
      const next = current + 1;
      if (next >= TOTAL) {
        setGameOver(true);
      } else {
        setCurrent(next);
        setRound(generateRound());
        setFeedback(null);
      }
    }, 400);
  }, [feedback, round, current, TOTAL]);

  return (
    <GameWrapper
      title="Stroop" icon="🎨" color="from-red-500 to-red-700"
      skillName="Attenzione & Velocità di elaborazione"
      maxScore={TOTAL * 10} score={score}
      gameOver={gameOver} onComplete={onComplete}
      instructions="Leggi la parola scritta, ma tocca il pulsante con il COLORE dell'inchiostro (non la parola). È più difficile di quanto sembra!"
      timeLimit={timeLimit}
      difficulty={tier}
    >
      {!gameOver && (
        <div className="flex flex-col items-center gap-6 pt-2">
          <div className="text-center bg-white rounded-2xl p-4 w-full shadow-sm">
            <p className="text-sm text-gray-500 mb-2">Domanda {current + 1} di {TOTAL}</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-red-500 h-2 rounded-full transition-all" style={{width: `${(current/TOTAL)*100}%`}}/>
            </div>
          </div>

          <div className={`bg-white rounded-3xl p-8 shadow-lg w-full text-center transition-all ${feedback === 'correct' ? 'bg-green-50' : feedback === 'wrong' ? 'bg-red-50 shake' : ''}`}>
            <p className="text-sm text-gray-500 mb-2 font-medium">Di che colore è scritta questa parola?</p>
            <span className={`text-6xl font-black ${round.inkColor.text}`}>
              {round.wordColor.name}
            </span>
          </div>

          {feedback && (
            <p className={`font-bold text-xl animate-pop ${feedback === 'correct' ? 'text-green-600' : 'text-red-600'}`}>
              {feedback === 'correct' ? '✅ Esatto!' : `❌ Era ${round.inkColor.name}`}
            </p>
          )}

          <div className="grid grid-cols-3 gap-3 w-full">
            {COLORS.map(c => (
              <button
                key={c.name}
                onClick={() => answer(c.name)}
                disabled={!!feedback}
                className={`${c.bg} text-white font-bold py-4 rounded-2xl text-lg shadow-md active:scale-95 transition-all disabled:opacity-50`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </GameWrapper>
  );
}
