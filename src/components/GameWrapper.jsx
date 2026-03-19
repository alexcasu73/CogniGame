import { useState, useEffect, useCallback } from 'react';
import Timer from './Timer';
import StarRating from './StarRating';
import { calcStars, calcXP, DIFFICULTY_LABELS, DIFFICULTY_ICONS } from '../utils/scoring';

export default function GameWrapper({
  title, icon, color, skillName,
  maxScore, score, gameOver, children,
  onComplete, instructions, timeLimit = 180, difficulty
}) {
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [started, setStarted] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (!started || gameOver || timedOut) return;
    if (timeLeft <= 0) { setTimedOut(true); return; }
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(t);
  }, [started, timeLeft, gameOver, timedOut]);

  useEffect(() => {
    if ((gameOver || timedOut) && started) {
      const stars = calcStars(score, maxScore);
      const timeBonus = timedOut ? 0 : Math.floor(timeLeft / 10);
      const xp = calcXP(stars, timeBonus);
      setTimeout(() => onComplete?.({ stars, xp, score, maxScore }), 800);
    }
  }, [gameOver, timedOut]);

  if (!started) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 animate-fade-in">
        <div className={`bg-gradient-to-br ${color} rounded-3xl p-8 text-white text-center max-w-sm w-full shadow-2xl`}>
          <div className="text-6xl mb-4">{icon}</div>
          <h2 className="text-3xl font-bold mb-2">{title}</h2>
          <p className="text-white/80 mb-2 text-lg">{skillName}</p>
          {difficulty && (
            <div className="bg-white/20 rounded-xl px-3 py-1 mb-2 inline-block text-sm font-bold">
              {DIFFICULTY_ICONS[difficulty]} {DIFFICULTY_LABELS[difficulty]}
            </div>
          )}
          <div className="bg-white/20 rounded-2xl p-4 mb-6 text-left">
            <p className="font-semibold mb-2 text-lg">📋 Come si gioca:</p>
            <p className="text-white/90 text-base leading-relaxed">{instructions}</p>
          </div>
          <button
            onClick={() => setStarted(true)}
            className="w-full bg-white text-gray-800 font-bold text-xl py-4 rounded-2xl hover:bg-gray-100 active:scale-95 transition-all shadow-lg"
          >
            Inizia! 🚀
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-4 max-w-lg mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-4 bg-white rounded-2xl p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{icon}</span>
          <div>
            <span className="font-bold text-gray-700 text-lg">{title}</span>
            {difficulty && <span className="text-xs text-gray-400 ml-2">{DIFFICULTY_ICONS[difficulty]}</span>}
          </div>
        </div>
        <Timer seconds={timeLeft} />
      </div>
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
