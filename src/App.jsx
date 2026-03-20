import { useState, useCallback, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import LoginScreen from './components/LoginScreen';
import ResultScreen from './components/ResultScreen';
import { getTodayGame, getBonusGame } from './utils/gameScheduler';
import { getPlayerLevel } from './utils/storage';
import { getProgress, recordSession } from './api';

import MemoryGame from './games/MemoryGame';
import AnagramGame from './games/AnagramGame';
import StroopGame from './games/StroopGame';
import SequenceGame from './games/SequenceGame';
import MathGame from './games/MathGame';
import OddOneOutGame from './games/OddOneOutGame';

const GAME_COMPONENTS = {
  memory: MemoryGame,
  anagram: AnagramGame,
  stroop: StroopGame,
  sequence: SequenceGame,
  math: MathGame,
  oddoneout: OddOneOutGame,
};

const USER_KEY = 'cognigame_user';

export default function App() {
  const [user, setUser] = useState(null);          // { id, nickname }
  const [userData, setUserData] = useState(null);  // progress object
  const [screen, setScreen] = useState('dashboard');
  const [result, setResult] = useState(null);
  const [activeGame, setActiveGame] = useState(null);
  const [bonusOffset, setBonusOffset] = useState(() => Math.floor(Math.random() * 5) + 1);

  // Ripristina sessione dal localStorage
  useEffect(() => {
    const cached = localStorage.getItem(USER_KEY);
    if (!cached) return;
    const saved = JSON.parse(cached);
    getProgress(saved.id)
      .then(({ user: u, progress }) => {
        setUser(u);
        setUserData(progress);
      })
      .catch(() => localStorage.removeItem(USER_KEY)); // utente non più valido
  }, []);

  const handleLogin = useCallback((u, progress) => {
    setUser(u);
    setUserData(progress);
    localStorage.setItem(USER_KEY, JSON.stringify({ id: u.id, nickname: u.nickname }));
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
    setUserData(null);
    setScreen('dashboard');
    localStorage.removeItem(USER_KEY);
  }, []);

  const todayGame = getTodayGame();
  const level = userData ? getPlayerLevel(userData.totalXP) : 1;
  const nextBonusGame = getBonusGame(todayGame, bonusOffset);

  const startGame = useCallback((gameType = null) => {
    setActiveGame(gameType);
    setScreen('game');
  }, []);

  const currentGame = activeGame || todayGame;
  const GameComponent = GAME_COMPONENTS[currentGame];
  const isBonus = activeGame !== null;

  const handleComplete = useCallback(async ({ stars, xp }) => {
    const saved = await recordSession(user.id, { gameType: currentGame, stars, xp, isBonus });
    setUserData(saved.progress);
    setResult({
      stars, xp,
      streak: saved.newStreak,
      totalXP: saved.totalXP,
      earnedBadges: saved.earnedBadges,
      isBonus,
    });
    if (isBonus) setBonusOffset(o => o + 1);
    setScreen('result');
  }, [user, currentGame, isBonus]);

  // Loading: utente in cache ma dati non ancora caricati
  if (localStorage.getItem(USER_KEY) && !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 text-xl">
        Caricamento...
      </div>
    );
  }

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  if (screen === 'game' && GameComponent) {
    return <GameComponent onComplete={handleComplete} level={level} />;
  }

  if (screen === 'result' && result) {
    return (
      <ResultScreen
        {...result}
        gameType={currentGame}
        onContinue={() => { setActiveGame(null); setScreen('dashboard'); }}
      />
    );
  }

  return (
    <Dashboard
      userData={userData}
      user={user}
      onStartGame={() => startGame(null)}
      onStartBonusGame={() => startGame(nextBonusGame)}
      nextBonusGame={nextBonusGame}
      onLogout={handleLogout}
    />
  );
}
