const BASE = '/api';

async function request(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Errore di rete');
  return data;
}

// { nickname } → { user, progress }
export function login(nickname) {
  return request('POST', '/auth/login', { nickname });
}

// → { user, progress }
export function getProgress(userId) {
  return request('GET', `/user/${userId}/progress`);
}

// { gameType, stars, xp, isBonus } → { progress, earnedBadges, newStreak, totalXP }
export function recordSession(userId, payload) {
  return request('POST', `/user/${userId}/session`, payload);
}
