import { useState, useEffect, useCallback } from 'react';
import GameWrapper from '../components/GameWrapper';
import { getDifficultyTier } from '../utils/scoring';

// Tier 1: 10 domande, solo +/-, numeri piccoli, 150s
// Tier 2: 10 domande, +/-/×, 160s
// Tier 3: 12 domande, tutte le operazioni, 170s
// Tier 4: 15 domande, tutte le operazioni con numeri grandi, 180s
const TIER_CONFIG = {
  1: { total: 10, difficultyScale: 1, timeLimit: 150 },
  2: { total: 10, difficultyScale: 2, timeLimit: 160 },
  3: { total: 12, difficultyScale: 3, timeLimit: 170 },
  4: { total: 15, difficultyScale: 4, timeLimit: 180 },
};

function generateQuestion(difficulty) {
  const ops = difficulty < 2 ? ['+', '-'] : difficulty < 3 ? ['+', '-', '×'] : ['+', '-', '×', '÷'];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a, b, answer;

  switch(op) {
    case '+':
      a = Math.floor(Math.random() * (10 + difficulty * 8)) + 1;
      b = Math.floor(Math.random() * (10 + difficulty * 8)) + 1;
      answer = a + b;
      break;
    case '-':
      a = Math.floor(Math.random() * (20 + difficulty * 8)) + 10;
      b = Math.floor(Math.random() * a) + 1;
      answer = a - b;
      break;
    case '×':
      a = Math.floor(Math.random() * (5 + difficulty * 2)) + 2;
      b = Math.floor(Math.random() * (5 + difficulty * 2)) + 2;
      answer = a * b;
      break;
    case '÷':
      b = Math.floor(Math.random() * (4 + difficulty)) + 2;
      answer = Math.floor(Math.random() * (4 + difficulty)) + 2;
      a = b * answer;
      break;
  }

  const wrongs = new Set();
  while (wrongs.size < 3) {
    const delta = Math.floor(Math.random() * (5 + difficulty * 3)) + 1;
    const wrong = Math.random() > 0.5 ? answer + delta : Math.max(1, answer - delta);
    if (wrong !== answer) wrongs.add(wrong);
  }

  const options = [...wrongs, answer];
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }

  return { question: `${a} ${op} ${b} = ?`, answer, options };
}

export default function MathGame({ onComplete, level = 1 }) {
  const tier = getDifficultyTier(level);
  const { total: TOTAL, difficultyScale, timeLimit } = TIER_CONFIG[tier];

  const [q, setQ] = useState(() => generateQuestion(difficultyScale));
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  const answer = useCallback((opt) => {
    if (feedback) return;
    setSelectedOpt(opt);
    const correct = opt === q.answer;
    setFeedback(correct ? 'correct' : 'wrong');
    if (correct) setScore(s => s + 10);

    setTimeout(() => {
      const next = current + 1;
      if (next >= TOTAL) {
        setGameOver(true);
      } else {
        setCurrent(next);
        // difficoltà cresce gradualmente durante la partita
        const inGameDiff = difficultyScale + Math.floor(next / (TOTAL / 3));
        setQ(generateQuestion(inGameDiff));
        setFeedback(null);
        setSelectedOpt(null);
      }
    }, 500);
  }, [feedback, q, current, TOTAL, difficultyScale]);

  return (
    <GameWrapper
      title="Matematica" icon="🔢" color="from-orange-500 to-orange-700"
      skillName="Calcolo mentale & Velocità"
      maxScore={TOTAL * 10} score={score}
      gameOver={gameOver} onComplete={onComplete}
      instructions={`Risolvi ${TOTAL} calcoli mentali il più velocemente possibile. Scegli la risposta corretta tra le 4 opzioni.`}
      timeLimit={timeLimit}
      difficulty={tier}
    >
      {!gameOver && (
        <div className="flex flex-col items-center gap-5 pt-2">
          <div className="bg-white rounded-2xl p-4 w-full shadow-sm text-center">
            <p className="text-sm text-gray-500 mb-2">Domanda {current + 1} di {TOTAL}</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-orange-500 h-2 rounded-full transition-all" style={{width: `${(current/TOTAL)*100}%`}}/>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 w-full text-center shadow-lg">
            <p className="text-5xl font-black text-gray-800">{q.question}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full">
            {q.options.map((opt, i) => {
              let cls = 'bg-white border-2 border-orange-200 text-gray-800';
              if (feedback && opt === q.answer) cls = 'bg-green-500 border-green-500 text-white';
              else if (feedback && opt === selectedOpt && opt !== q.answer) cls = 'bg-red-500 border-red-500 text-white';
              return (
                <button
                  key={i}
                  onClick={() => answer(opt)}
                  disabled={!!feedback}
                  className={`${cls} font-bold text-3xl py-5 rounded-2xl shadow-md active:scale-95 transition-all`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {feedback && (
            <p className={`font-bold text-xl animate-pop ${feedback === 'correct' ? 'text-green-600' : 'text-red-600'}`}>
              {feedback === 'correct' ? '✅ Corretto!' : `❌ Era ${q.answer}`}
            </p>
          )}
        </div>
      )}
    </GameWrapper>
  );
}
