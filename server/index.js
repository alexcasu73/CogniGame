import express from 'express';
import { createServer as createViteServer } from 'vite';
import db from './db.js';

const app = express();
app.use(express.json());

// ─── Auth ─────────────────────────────────────────────────────────────────────

// POST /api/auth/login  { nickname }
// Crea l'utente se non esiste, restituisce utente + progressi
app.post('/api/auth/login', (req, res) => {
  const nickname = (req.body.nickname || '').trim();
  if (!nickname || nickname.length < 2 || nickname.length > 20) {
    return res.status(400).json({ error: 'Nickname deve essere tra 2 e 20 caratteri' });
  }

  let user = db.prepare('SELECT * FROM users WHERE nickname = ?').get(nickname);

  if (!user) {
    const result = db.prepare('INSERT INTO users (nickname) VALUES (?)').run(nickname);
    user = { id: result.lastInsertRowid, nickname, created_at: new Date().toISOString() };
    db.prepare('INSERT INTO progress (user_id) VALUES (?)').run(user.id);
  }

  const progress = getProgress(user.id);
  res.json({ user: { id: user.id, nickname: user.nickname, created_at: user.created_at }, progress });
});

// ─── Progress ─────────────────────────────────────────────────────────────────

// GET /api/user/:id/progress
app.get('/api/user/:id/progress', (req, res) => {
  const userId = Number(req.params.id);
  const user = db.prepare('SELECT id, nickname, created_at FROM users WHERE id = ?').get(userId);
  if (!user) return res.status(404).json({ error: 'Utente non trovato' });

  res.json({ user, progress: getProgress(userId) });
});

// ─── Session ──────────────────────────────────────────────────────────────────

// POST /api/user/:id/session  { gameType, stars, xp, isBonus }
app.post('/api/user/:id/session', (req, res) => {
  const userId = Number(req.params.id);
  const user = db.prepare('SELECT id FROM users WHERE id = ?').get(userId);
  if (!user) return res.status(404).json({ error: 'Utente non trovato' });

  const { gameType, stars, xp, isBonus = false } = req.body;
  if (!gameType || stars == null || xp == null) {
    return res.status(400).json({ error: 'Parametri mancanti' });
  }

  const today = new Date().toISOString().split('T')[0];
  const prog = db.prepare('SELECT * FROM progress WHERE user_id = ?').get(userId);

  // Streak logic
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  let newStreak = prog.streak;
  if (!isBonus) {
    if (prog.last_played === yesterdayStr) {
      newStreak = prog.streak + 1;
    } else if (prog.last_played !== today) {
      newStreak = 1;
    }
  }

  const gamesPlayed = prog.games_played + 1;
  const totalXP = prog.total_xp + xp;
  const totalStars = prog.total_stars + stars;
  const badges = JSON.parse(prog.badges);

  // Badge check
  const check = (id) => !badges.includes(id);
  if (check('first_game')) badges.push('first_game');
  if (newStreak >= 3 && check('streak_3')) badges.push('streak_3');
  if (newStreak >= 7 && check('streak_7')) badges.push('streak_7');
  if (newStreak >= 30 && check('streak_30')) badges.push('streak_30');
  if (stars === 3 && check('perfect')) badges.push('perfect');
  if (gamesPlayed >= 10 && check('games_10')) badges.push('games_10');
  if (gamesPlayed >= 50 && check('games_50')) badges.push('games_50');
  if (totalXP >= 1000 && check('xp_1000')) badges.push('xp_1000');

  const earnedBadges = badges.filter(b => !JSON.parse(prog.badges).includes(b));

  // Persist session
  db.prepare(
    'INSERT INTO sessions (user_id, date, game_type, stars, xp, is_bonus) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(userId, today, gameType, stars, xp, isBonus ? 1 : 0);

  // Update progress
  db.prepare(`
    UPDATE progress SET
      last_played = ?,
      streak = ?,
      total_xp = ?,
      games_played = ?,
      total_stars = ?,
      badges = ?
    WHERE user_id = ?
  `).run(
    isBonus ? prog.last_played : today,
    newStreak,
    totalXP,
    gamesPlayed,
    totalStars,
    JSON.stringify(badges),
    userId
  );

  res.json({
    progress: getProgress(userId),
    earnedBadges,
    newStreak,
    totalXP,
  });
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getProgress(userId) {
  const prog = db.prepare('SELECT * FROM progress WHERE user_id = ?').get(userId);
  const history = db.prepare(
    'SELECT date, game_type AS gameType, stars, xp, is_bonus AS bonus FROM sessions WHERE user_id = ? ORDER BY played_at DESC LIMIT 30'
  ).all(userId);

  return {
    lastPlayed: prog.last_played,
    streak: prog.streak,
    totalXP: prog.total_xp,
    gamesPlayed: prog.games_played,
    totalStars: prog.total_stars,
    badges: JSON.parse(prog.badges),
    history: history.map(h => ({ ...h, bonus: h.bonus === 1 })),
  };
}

// ─── Start ────────────────────────────────────────────────────────────────────

const PORT = 5173;

const vite = await createViteServer({
  server: { middlewareMode: true },
  appType: 'spa',
});

app.use(vite.middlewares);

app.listen(PORT, () => console.log(`CogniGame running on http://localhost:${PORT}`));
