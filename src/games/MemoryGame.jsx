import { useState, useEffect, useCallback } from 'react';
import { MEMORY_EMOJIS } from '../data/categories';
import GameWrapper from '../components/GameWrapper';
import { getDifficultyTier } from '../utils/scoring';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const TIER_CONFIG = {
  1: { pairs: 6,  cols: 4, gap: 'gap-2',   emoji: 'text-4xl', timeLimit: 180 },
  2: { pairs: 8,  cols: 4, gap: 'gap-2',   emoji: 'text-4xl', timeLimit: 210 },
  3: { pairs: 10, cols: 5, gap: 'gap-1.5', emoji: 'text-3xl', timeLimit: 240 },
  4: { pairs: 12, cols: 6, gap: 'gap-1',   emoji: 'text-2xl', timeLimit: 270 },
};

export default function MemoryGame({ onComplete, level = 1 }) {
  const tier = getDifficultyTier(level);
  const { pairs: PAIRS, cols, gap, emoji: emojiSize, timeLimit } = TIER_CONFIG[tier];

  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    const emojis = shuffle(MEMORY_EMOJIS).slice(0, PAIRS);
    const deck = shuffle([...emojis, ...emojis].map((e, i) => ({ id: i, emoji: e, matched: false })));
    setCards(deck);
  }, [PAIRS]);

  const handleFlip = useCallback((id) => {
    if (checking || matched.includes(id) || flipped.includes(id) || flipped.length === 2) return;

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setChecking(true);
      const [a, b] = newFlipped.map(fid => cards.find(c => c.id === fid));
      if (a.emoji === b.emoji) {
        setTimeout(() => {
          const newMatched = [...matched, a.id, b.id];
          setMatched(newMatched);
          setScore(s => s + 10);
          setFlipped([]);
          setChecking(false);
          if (newMatched.length === cards.length) setGameOver(true);
        }, 400);
      } else {
        setTimeout(() => {
          setErrors(e => e + 1);
          setFlipped([]);
          setChecking(false);
        }, 900);
      }
    }
  }, [checking, matched, flipped, cards]);

  const finalScore = Math.max(0, score - errors * 2);

  return (
    <GameWrapper
      title="Memoria" icon="🧩" color="from-purple-500 to-purple-700"
      skillName="Memoria episodica"
      maxScore={PAIRS * 10} score={finalScore}
      gameOver={gameOver} onComplete={onComplete}
      instructions={`Troverai ${PAIRS * 2} carte capovolte. Girarne due alla volta: se hanno lo stesso simbolo restano scoperte. Trovale tutte!`}
      timeLimit={timeLimit}
      difficulty={tier}
    >
      <div className={`grid grid-cols-${cols} ${gap} p-2`}>
        {cards.map(card => {
          const isFlipped = flipped.includes(card.id) || matched.includes(card.id);
          const isMatched = matched.includes(card.id);
          return (
            <div
              key={card.id}
              className="card-flip aspect-square"
              onClick={() => handleFlip(card.id)}
            >
              <div className={`card-flip-inner w-full h-full ${isFlipped ? 'flipped' : ''}`}>
                <div className="card-face bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center cursor-pointer hover:from-purple-500 hover:to-purple-700 active:scale-95 transition-transform shadow-md">
                  <span className="text-white text-2xl font-bold">?</span>
                </div>
                <div className={`card-face card-back rounded-xl flex items-center justify-center shadow-md ${isMatched ? 'bg-green-100 border-2 border-green-400' : 'bg-white border-2 border-purple-200'}`}>
                  <span className={emojiSize}>{card.emoji}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex justify-between text-gray-600 font-medium px-2">
        <span>✅ Trovate: {matched.length / 2}/{PAIRS}</span>
        <span>❌ Errori: {errors}</span>
      </div>
    </GameWrapper>
  );
}
