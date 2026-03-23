import { useState, useEffect, useCallback } from 'react';
import { getSetsByDifficulty } from '../data/categories';
import GameWrapper from '../components/GameWrapper';
import { getDifficultyTier } from '../utils/scoring';
import { fetchOddOneOutContent } from '../api';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const TIER_CONFIG = {
  1: { total: 8,  minDiff: 1, maxDiff: 1, timeLimit: 150 },
  2: { total: 10, minDiff: 1, maxDiff: 2, timeLimit: 160 },
  3: { total: 12, minDiff: 2, maxDiff: 3, timeLimit: 170 },
  4: { total: 12, minDiff: 3, maxDiff: 3, timeLimit: 180 },
};

function getStaticSets(tier) {
  const { total, minDiff, maxDiff } = TIER_CONFIG[tier];
  const pool = getSetsByDifficulty(maxDiff, minDiff);
  return shuffle(pool).slice(0, total);
}

export default function OddOneOutGame({ onComplete, level = 1 }) {
  const tier = getDifficultyTier(level);
  const { total: TOTAL, timeLimit } = TIER_CONFIG[tier];

  const [sets, setSets] = useState(null); // null = caricamento
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  // Carica contenuti AI, fallback a statici
  useEffect(() => {
    fetchOddOneOutContent(tier, TOTAL).then(items => {
      if (items && items.length >= TOTAL) {
        setSets(items.slice(0, TOTAL));
      } else {
        setSets(getStaticSets(tier));
      }
    });
  }, [tier, TOTAL]);

  const answer = useCallback((idx) => {
    if (feedback || !sets) return;
    const set = sets[current];
    setSelectedIdx(idx);
    const correct = idx === set.odd;
    setFeedback(correct ? 'correct' : 'wrong');
    if (correct) setScore(s => s + 10);

    setTimeout(() => {
      const next = current + 1;
      if (next >= TOTAL) {
        setGameOver(true);
      } else {
        setCurrent(next);
        setFeedback(null);
        setSelectedIdx(null);
      }
    }, 3000);
  }, [feedback, sets, current, TOTAL]);

  const set = sets ? sets[current] : null;

  return (
    <GameWrapper
      title="Trova l'Intruso" icon="🔍" color="from-teal-500 to-teal-700"
      skillName="Ragionamento & Memoria semantica"
      maxScore={TOTAL * 10} score={score}
      gameOver={gameOver} onComplete={onComplete}
      instructions={`Tra i 4 elementi, uno non appartiene al gruppo degli altri. Trova l'intruso! ${TOTAL} domande in tutto.`}
      timeLimit={timeLimit}
      difficulty={tier}
    >
      {!sets && !gameOver && (
        <div className="flex flex-col items-center gap-4 pt-10">
          <div className="animate-spin text-5xl">🔍</div>
          <p className="text-teal-700 font-semibold text-lg">Preparo le domande...</p>
        </div>
      )}

      {sets && !gameOver && set && (
        <div className="flex flex-col items-center gap-5 pt-2">
          <div className="bg-white rounded-2xl p-4 w-full shadow-sm text-center">
            <p className="text-sm text-gray-500 mb-2">Domanda {current + 1} di {TOTAL}</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-teal-500 h-2 rounded-full transition-all" style={{width:`${(current/TOTAL)*100}%`}}/>
            </div>
            <p className="mt-3 text-teal-700 font-bold text-lg">Quale non appartiene al gruppo?</p>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full">
            {set.items.map((item, i) => {
              let cls = 'bg-white border-2 border-teal-200 text-gray-800';
              if (feedback) {
                if (i === set.odd) cls = 'bg-green-500 border-green-500 text-white';
                else if (i === selectedIdx && i !== set.odd) cls = 'bg-red-400 border-red-400 text-white';
              }
              return (
                <button
                  key={i}
                  onClick={() => answer(i)}
                  disabled={!!feedback}
                  className={`${cls} font-bold text-2xl py-6 rounded-2xl shadow-md active:scale-95 transition-all`}
                >
                  {item}
                </button>
              );
            })}
          </div>

          {feedback && (
            <div className={`text-center p-3 rounded-2xl w-full animate-fade-in ${feedback === 'correct' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              <p className="font-bold text-lg">{feedback === 'correct' ? '✅ Esatto!' : '❌ Non corretto'}</p>
              <p className="text-sm mt-1">{set.explanation}</p>
            </div>
          )}
        </div>
      )}
    </GameWrapper>
  );
}
