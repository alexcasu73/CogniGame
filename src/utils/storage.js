const KEY = 'cognigame_data';

const defaultData = () => ({
  lastPlayed: null,
  streak: 0,
  totalXP: 0,
  gamesPlayed: 0,
  badges: [],
  history: [], // [{date, gameType, stars, xp}]
  totalStars: 0,
});

export function getData() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultData();
    return { ...defaultData(), ...JSON.parse(raw) };
  } catch { return defaultData(); }
}

export function saveData(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function getTodayStr() {
  return new Date().toISOString().split('T')[0];
}

export function getPlayerLevel(totalXP) {
  const xp = totalXP ?? getData().totalXP;
  return Math.floor(xp / 100) + 1;
}

export function hasPlayedToday() {
  const data = getData();
  return data.lastPlayed === getTodayStr();
}

export function recordSession({ gameType, stars, xp, isBonus = false }) {
  const data = getData();
  const today = getTodayStr();

  // Streak logic — solo per il gioco giornaliero, non per i bonus
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  let newStreak = data.streak;
  if (!isBonus) {
    if (data.lastPlayed === yesterdayStr) {
      newStreak = data.streak + 1;
    } else if (data.lastPlayed !== today) {
      newStreak = 1;
    }
  }

  // Check new badges
  const newBadges = [...data.badges];
  const checkBadge = (id) => !newBadges.includes(id);

  const gamesPlayed = data.gamesPlayed + 1;
  const totalStars = data.totalStars + stars;

  if (checkBadge('first_game')) newBadges.push('first_game');
  if (newStreak >= 3 && checkBadge('streak_3')) newBadges.push('streak_3');
  if (newStreak >= 7 && checkBadge('streak_7')) newBadges.push('streak_7');
  if (newStreak >= 30 && checkBadge('streak_30')) newBadges.push('streak_30');
  if (stars === 3 && checkBadge('perfect')) newBadges.push('perfect');
  if (gamesPlayed >= 10 && checkBadge('games_10')) newBadges.push('games_10');
  if (gamesPlayed >= 50 && checkBadge('games_50')) newBadges.push('games_50');
  if (data.totalXP + xp >= 1000 && checkBadge('xp_1000')) newBadges.push('xp_1000');

  const earnedBadges = newBadges.filter(b => !data.badges.includes(b));

  const updated = {
    ...data,
    lastPlayed: isBonus ? data.lastPlayed : today, // non sovrascrive lastPlayed se è bonus
    streak: newStreak,
    totalXP: data.totalXP + xp,
    gamesPlayed,
    totalStars,
    badges: newBadges,
    history: [{ date: today, gameType, stars, xp, bonus: isBonus }, ...data.history.slice(0, 29)],
  };
  saveData(updated);
  return { ...updated, earnedBadges, newStreak };
}
