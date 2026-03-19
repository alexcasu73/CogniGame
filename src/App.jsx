import { useState, useCallback } from 'react';
import Dashboard from './components/Dashboard';
import ResultScreen from './components/ResultScreen';
import { getTodayGame, getBonusGame } from './utils/gameScheduler';
import { recordSession, getPlayerLevel } from './utils/storage';

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

export default function App() {
  const [screen, setScreen] = useState('dashboard');
  const [result, setResult] = useState(null);
  const [activeGame, setActiveGame] = useState(null); // null = today's game
  const [bonusOffset, setBonusOffset] = useState(() => Math.floor(Math.random() * 5) + 1); // random all'avvio, avanza dopo ogni bonus
  const todayGame = getTodayGame();
  const level = getPlayerLevel();

  const nextBonusGame = getBonusGame(todayGame, bonusOffset);

  const startGame = useCallback((gameType = null) => {
    setActiveGame(gameType);
    setScreen('game');
  }, []);

  const currentGame = activeGame || todayGame;
  const GameComponent = GAME_COMPONENTS[currentGame];
  const isBonus = activeGame !== null;

  const handleComplete = useCallback(({ stars, xp }) => {
    const saved = recordSession({ gameType: currentGame, stars, xp, isBonus });
    setResult({ stars, xp, streak: saved.newStreak, totalXP: saved.totalXP, earnedBadges: saved.earnedBadges, isBonus });
    if (isBonus) setBonusOffset(o => o + 1); // avanza al prossimo bonus diverso
    setScreen('result');
  }, [currentGame, isBonus]);

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
      onStartGame={() => startGame(null)}
      onStartBonusGame={() => startGame(nextBonusGame)}
      nextBonusGame={nextBonusGame}
    />
  );
}
