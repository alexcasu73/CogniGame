import { useState } from 'react';
import { getTodayGame, getGameInfo, ALL_GAMES } from '../utils/gameScheduler';
import { BADGE_INFO } from '../utils/scoring';
import StarRating from './StarRating';

export default function Dashboard({ userData, user, onStartGame, onStartBonusGame, nextBonusGame, onLogout }) {
  const todayGame = getTodayGame();
  const gameInfo = getGameInfo(todayGame);
  const nextGameInfo = getGameInfo(nextBonusGame);

  const today = new Date().toISOString().split('T')[0];
  const played = userData.lastPlayed === today;

  const level = Math.floor(userData.totalXP / 100) + 1;
  const xpInLevel = userData.totalXP % 100;
  const [tab, setTab] = useState('home');

  return (
    <div className="min-h-screen flex flex-col max-w-lg mx-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-black text-indigo-700">CogniGame</h1>
          <button
            onClick={onLogout}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            👤 {user.nickname} · esci
          </button>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 justify-end">
            <span className="text-orange-500">🔥</span>
            <span className="font-bold text-gray-700">{userData.streak} giorni</span>
          </div>
          <p className="text-sm text-gray-500">⚡ {userData.totalXP} XP</p>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex bg-gray-100 rounded-2xl p-1 mb-4">
        {['home', 'badge', 'storico'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-xl font-semibold text-sm transition-all capitalize ${tab === t ? 'bg-white shadow text-indigo-600' : 'text-gray-500'}`}
          >
            {t === 'home' ? '🏠 Home' : t === 'badge' ? '🏅 Badge' : '📅 Storico'}
          </button>
        ))}
      </div>

      {tab === 'home' && (
        <div className="flex flex-col gap-4 animate-fade-in">
          {/* Level progress */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-gray-700">Livello {level}</span>
              <span className="text-sm text-gray-500">{xpInLevel}/100 XP</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-4 rounded-full transition-all" style={{width:`${xpInLevel}%`}}/>
            </div>
          </div>

          {/* Today's game */}
          <div className={`bg-gradient-to-br ${gameInfo.color} rounded-3xl p-6 text-white shadow-xl`}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-5xl">{gameInfo.icon}</span>
              <div>
                <p className="text-white/70 text-sm font-medium">Gioco di oggi</p>
                <h2 className="text-2xl font-black">{gameInfo.name}</h2>
                <p className="text-white/80 text-sm">{gameInfo.skill}</p>
              </div>
            </div>
            <p className="text-white/80 mb-4 text-sm">{gameInfo.desc}</p>

            {played ? (
              <div className="bg-white/20 rounded-2xl p-3 text-center">
                <p className="font-bold">✅ Hai già giocato oggi!</p>
                <p className="text-white/70 text-sm">Torna domani per un nuovo gioco</p>
              </div>
            ) : (
              <button
                onClick={onStartGame}
                className="w-full bg-white text-gray-800 font-black text-xl py-4 rounded-2xl hover:bg-gray-50 active:scale-95 transition-all shadow-lg"
              >
                Gioca ora! 🚀
              </button>
            )}
          </div>

          {/* Next game bonus */}
          <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4">
            <div className={`bg-gradient-to-br ${nextGameInfo.color} rounded-xl p-3 text-3xl`}>
              {nextGameInfo.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400 font-medium">Esercizio extra (bonus)</p>
              <p className="font-bold text-gray-800">{nextGameInfo.name}</p>
              <p className="text-xs text-gray-500 truncate">{nextGameInfo.skill}</p>
            </div>
            <button
              onClick={onStartBonusGame}
              className="bg-gray-100 hover:bg-gray-200 active:scale-95 transition-all text-gray-700 font-bold text-sm px-4 py-2 rounded-xl whitespace-nowrap"
            >
              Gioca →
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
              <p className="text-2xl font-black text-purple-600">{userData.gamesPlayed}</p>
              <p className="text-xs text-gray-500">Sessioni</p>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
              <p className="text-2xl font-black text-yellow-500">{'⭐'.repeat(Math.min(3, Math.floor(userData.totalStars / Math.max(1, userData.gamesPlayed) + 0.5)))}</p>
              <p className="text-xs text-gray-500">Stelle medie</p>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
              <p className="text-2xl font-black text-indigo-600">{userData.badges.length}</p>
              <p className="text-xs text-gray-500">Badge</p>
            </div>
          </div>

          {/* All games preview */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="font-bold text-gray-700 mb-3">🎮 I giochi della rotazione</p>
            <div className="grid grid-cols-3 gap-2">
              {ALL_GAMES.map(g => {
                const info = getGameInfo(g);
                const isToday = g === todayGame;
                return (
                  <div key={g} className={`rounded-xl p-2 text-center ${isToday ? 'bg-indigo-50 border-2 border-indigo-300' : 'bg-gray-50'}`}>
                    <div className="text-2xl">{info.icon}</div>
                    <p className="text-xs font-medium text-gray-600">{info.name}</p>
                    {isToday && <p className="text-xs text-indigo-600 font-bold">oggi</p>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {tab === 'badge' && (
        <div className="flex flex-col gap-3 animate-fade-in">
          <p className="text-gray-500 text-sm text-center">Hai {userData.badges.length} badge su {Object.keys(BADGE_INFO).length}</p>
          {Object.entries(BADGE_INFO).map(([id, info]) => {
            const earned = userData.badges.includes(id);
            return (
              <div key={id} className={`flex items-center gap-4 p-4 rounded-2xl shadow-sm ${earned ? 'bg-white' : 'bg-gray-100 opacity-60'}`}>
                <span className={`text-4xl ${earned ? '' : 'grayscale'}`}>{info.icon}</span>
                <div>
                  <p className={`font-bold ${earned ? 'text-gray-800' : 'text-gray-400'}`}>{info.name}</p>
                  <p className="text-sm text-gray-500">{info.desc}</p>
                </div>
                {earned && <span className="ml-auto text-green-500 text-xl">✓</span>}
              </div>
            );
          })}
        </div>
      )}

      {tab === 'storico' && (
        <div className="flex flex-col gap-3 animate-fade-in">
          {userData.history.length === 0 ? (
            <div className="text-center text-gray-400 py-12">
              <p className="text-4xl mb-3">📅</p>
              <p>Nessuna sessione ancora. Gioca il tuo primo gioco!</p>
            </div>
          ) : (
            userData.history.map((h, i) => {
              const info = getGameInfo(h.gameType);
              return (
                <div key={i} className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm">
                  <span className="text-3xl">{info?.icon || '🎮'}</span>
                  <div className="flex-1">
                    <p className="font-bold text-gray-800">{info?.name || h.gameType}</p>
                    <p className="text-sm text-gray-500">{h.date}</p>
                  </div>
                  <div className="text-right">
                    <StarRating stars={h.stars} size="sm" />
                    <p className="text-xs text-gray-500 mt-1">+{h.xp} XP</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
