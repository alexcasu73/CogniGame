export function calcStars(score, maxScore) {
  const pct = score / maxScore;
  if (pct >= 0.85) return 3;
  if (pct >= 0.6) return 2;
  if (pct >= 0.3) return 1;
  return 1; // always at least 1 star for completing
}

export function calcXP(stars, timeBonus = 0) {
  const base = { 1: 10, 2: 20, 3: 35 };
  return (base[stars] || 10) + timeBonus;
}

export function getDifficultyTier(playerLevel) {
  if (playerLevel <= 1) return 1;
  if (playerLevel <= 3) return 2;
  if (playerLevel <= 6) return 3;
  return 4;
}

export const DIFFICULTY_LABELS = { 1: 'Facile', 2: 'Medio', 3: 'Difficile', 4: 'Esperto' };
export const DIFFICULTY_ICONS = { 1: '🌱', 2: '⚡', 3: '🔥', 4: '💎' };

export const BADGE_INFO = {
  first_game: { icon: '🌟', name: 'Prima partita!', desc: 'Hai giocato la tua prima sessione' },
  streak_3: { icon: '🔥', name: 'In forma!', desc: '3 giorni consecutivi' },
  streak_7: { icon: '💪', name: 'Campione!', desc: '7 giorni consecutivi' },
  streak_30: { icon: '👑', name: 'Leggenda!', desc: '30 giorni consecutivi' },
  perfect: { icon: '⭐', name: 'Perfetto!', desc: 'Punteggio massimo' },
  games_10: { icon: '🎯', name: 'Allenato!', desc: '10 sessioni completate' },
  games_50: { icon: '🏆', name: 'Maestro!', desc: '50 sessioni completate' },
  xp_1000: { icon: '💎', name: 'Esperto!', desc: '1000 punti XP guadagnati' },
};
