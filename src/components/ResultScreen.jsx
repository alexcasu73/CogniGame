import { useEffect, useState } from 'react';
import StarRating from './StarRating';
import { BADGE_INFO } from '../utils/scoring';

export default function ResultScreen({ stars, xp, gameType, streak, totalXP, earnedBadges = [], isBonus = false, onContinue }) {
  const [show, setShow] = useState(false);
  useEffect(() => { setTimeout(() => setShow(true), 100); }, []);

  const level = Math.floor(totalXP / 100) + 1;
  const xpInLevel = totalXP % 100;

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 transition-opacity duration-500 ${show ? 'opacity-100' : 'opacity-0'}`}>
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center animate-slide-up">
        {isBonus && (
          <div className="bg-indigo-50 text-indigo-600 text-sm font-semibold rounded-xl px-3 py-1 inline-block mb-3">
            🎁 Esercizio bonus
          </div>
        )}
        <div className="text-6xl mb-4">
          {stars === 3 ? '🏆' : stars === 2 ? '🎉' : '👍'}
        </div>
        <h2 className="text-3xl font-black text-gray-800 mb-2">
          {stars === 3 ? 'Perfetto!' : stars === 2 ? 'Ottimo!' : 'Bravo!'}
        </h2>

        <StarRating stars={stars} size="lg" />

        <div className="mt-4 bg-indigo-50 rounded-2xl p-4">
          <p className="text-indigo-700 font-bold text-2xl">+{xp} XP</p>
          <p className="text-sm text-indigo-500">Punti guadagnati</p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="bg-orange-50 rounded-xl p-3">
            <p className="text-orange-600 font-bold text-xl">🔥 {streak}</p>
            <p className="text-xs text-orange-400">Giorni di fila</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-3">
            <p className="text-purple-600 font-bold text-xl">⚡ {totalXP}</p>
            <p className="text-xs text-purple-400">XP totali</p>
          </div>
        </div>

        <div className="mt-4 bg-gray-50 rounded-xl p-3">
          <div className="flex justify-between text-sm text-gray-500 mb-1">
            <span>Livello {level}</span>
            <span>{xpInLevel}/100 XP</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-indigo-500 h-3 rounded-full transition-all" style={{width:`${xpInLevel}%`}}/>
          </div>
        </div>

        {earnedBadges.length > 0 && (
          <div className="mt-4 bg-yellow-50 rounded-2xl p-4">
            <p className="text-yellow-700 font-bold mb-3">🎖️ Nuovo Badge!</p>
            {earnedBadges.map(b => (
              <div key={b} className="flex items-center gap-3 bg-white rounded-xl p-3 mb-2 shadow-sm">
                <span className="text-3xl">{BADGE_INFO[b]?.icon}</span>
                <div className="text-left">
                  <p className="font-bold text-gray-800">{BADGE_INFO[b]?.name}</p>
                  <p className="text-sm text-gray-500">{BADGE_INFO[b]?.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={onContinue}
          className="mt-6 w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-xl py-4 rounded-2xl shadow-lg active:scale-95 transition-all"
        >
          Torna alla home 🏠
        </button>
      </div>
    </div>
  );
}
