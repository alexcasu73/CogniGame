import { useState, useEffect, useCallback } from 'react';
import GameWrapper from '../components/GameWrapper';
import { getDifficultyTier } from '../utils/scoring';

const ALL_COLORS = [
  { id: 0, bg: 'bg-red-400',    glow: '0 0 24px 8px rgba(248,113,113,0.9)',  label: '🔴' },
  { id: 1, bg: 'bg-blue-400',   glow: '0 0 24px 8px rgba(96,165,250,0.9)',   label: '🔵' },
  { id: 2, bg: 'bg-green-400',  glow: '0 0 24px 8px rgba(74,222,128,0.9)',   label: '🟢' },
  { id: 3, bg: 'bg-yellow-400', glow: '0 0 24px 8px rgba(250,204,21,0.9)',   label: '🟡' },
  { id: 4, bg: 'bg-pink-400',   glow: '0 0 24px 8px rgba(244,114,182,0.9)', label: '🩷' },
  { id: 5, bg: 'bg-orange-400', glow: '0 0 24px 8px rgba(251,146,60,0.9)',  label: '🟠' },
];

// Tier 1: 4 colori, max livello 5, 200s
// Tier 2: 4 colori, max livello 8, 240s
// Tier 3: 6 colori, max livello 8, 260s
// Tier 4: 6 colori, max livello 10, 300s
const TIER_CONFIG = {
  1: { colorCount: 4, maxLevel: 5,  timeLimit: 200 },
  2: { colorCount: 4, maxLevel: 8,  timeLimit: 240 },
  3: { colorCount: 6, maxLevel: 8,  timeLimit: 260 },
  4: { colorCount: 6, maxLevel: 10, timeLimit: 300 },
};

export default function SequenceGame({ onComplete, level = 1 }) {
  const tier = getDifficultyTier(level);
  const { colorCount, maxLevel: MAX_LEVEL, timeLimit } = TIER_CONFIG[tier];
  const COLORS = ALL_COLORS.slice(0, colorCount);
  const gridCols = colorCount === 4 ? 'grid-cols-2' : 'grid-cols-3';

  const [sequence, setSequence] = useState([]);
  const [userSeq, setUserSeq] = useState([]);
  const [phase, setPhase] = useState('watch');
  const [activeBtn, setActiveBtn] = useState(null);
  const [seqLevel, setSeqLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const startLevel = useCallback((lvl) => {
    const seq = Array.from({ length: lvl + 2 }, () => Math.floor(Math.random() * colorCount));
    setSequence(seq);
    setUserSeq([]);
    setPhase('watch');
    setFeedback(null);

    let i = 0;
    const show = () => {
      if (i >= seq.length) {
        setTimeout(() => setPhase('input'), 400);
        return;
      }
      setTimeout(() => {
        setActiveBtn(seq[i]);
        setTimeout(() => {
          setActiveBtn(null);
          i++;
          setTimeout(show, 200);
        }, 500);
      }, 200);
    };
    setTimeout(show, 600);
  }, [colorCount]);

  useEffect(() => { startLevel(1); }, []);

  const handlePress = useCallback((id) => {
    if (phase !== 'input') return;
    setActiveBtn(id);
    setTimeout(() => setActiveBtn(null), 150);

    const newUserSeq = [...userSeq, id];
    setUserSeq(newUserSeq);

    const idx = newUserSeq.length - 1;
    if (newUserSeq[idx] !== sequence[idx]) {
      setFeedback('wrong');
      setPhase('result');
      setGameOver(true);
      return;
    }

    if (newUserSeq.length === sequence.length) {
      const newScore = score + seqLevel * 10;
      setScore(newScore);
      const newLevel = seqLevel + 1;
      setFeedback('correct');

      if (newLevel > MAX_LEVEL) {
        setPhase('result');
        setGameOver(true);
      } else {
        setSeqLevel(newLevel);
        setTimeout(() => startLevel(newLevel), 900);
      }
    }
  }, [phase, userSeq, sequence, seqLevel, score, startLevel, MAX_LEVEL]);

  return (
    <GameWrapper
      title="Sequenza" icon="🎵" color="from-green-500 to-green-700"
      skillName="Memoria di lavoro"
      maxScore={MAX_LEVEL * 10} score={score}
      gameOver={gameOver} onComplete={onComplete}
      instructions={`Guarda la sequenza di colori che lampeggia, poi ripetila nello stesso ordine. Hai ${colorCount} colori e ${MAX_LEVEL} livelli!`}
      timeLimit={timeLimit}
      difficulty={tier}
    >
      {!gameOver && (
        <div className="flex flex-col items-center gap-6 pt-2">
          <div className="bg-white rounded-2xl p-4 w-full text-center shadow-sm">
            <p className="text-gray-500 text-sm">Livello {seqLevel} di {MAX_LEVEL}</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div className="bg-green-500 h-2 rounded-full transition-all" style={{width: `${((seqLevel-1)/MAX_LEVEL)*100}%`}}/>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 w-full text-center shadow-sm">
            {phase === 'watch' && <p className="text-green-700 font-bold text-lg animate-pulse">👀 Guarda la sequenza...</p>}
            {phase === 'input' && (
              <div>
                <p className="text-blue-700 font-bold text-lg">👆 Ripeti la sequenza!</p>
                <div className="flex gap-1 justify-center mt-2">
                  {sequence.map((_, i) => (
                    <div key={i} className={`w-6 h-6 rounded-full border-2 ${i < userSeq.length ? 'bg-green-400 border-green-500' : 'bg-gray-200 border-gray-300'}`}/>
                  ))}
                </div>
              </div>
            )}
            {feedback === 'correct' && <p className="text-green-600 font-bold text-lg animate-pop">✅ Bravissimo! Livello {seqLevel}!</p>}
          </div>

          <div className={`grid ${gridCols} gap-4 w-full max-w-xs`}>
            {COLORS.map(c => (
              <button
                key={c.id}
                onPointerDown={() => handlePress(c.id)}
                disabled={phase !== 'input'}
                className={`aspect-square rounded-3xl text-5xl transition-all duration-150 disabled:cursor-default
                  ${activeBtn === c.id ? c.bg + ' scale-110' : c.bg + ' shadow-lg'}
                  ${phase === 'input' && activeBtn !== c.id ? 'opacity-100 active:scale-90' : ''}
                  ${phase !== 'input' && activeBtn !== c.id ? 'opacity-60' : ''}`}
              style={activeBtn === c.id ? { boxShadow: c.glow, opacity: 1 } : {}}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </GameWrapper>
  );
}
