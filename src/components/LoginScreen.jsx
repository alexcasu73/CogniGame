import { useState } from 'react';
import { login } from '../api';

export default function LoginScreen({ onLogin }) {
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const name = nickname.trim();
    if (!name) return;
    setLoading(true);
    setError('');
    try {
      const { user, progress } = await login(name);
      onLogin(user, progress);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center max-w-lg mx-auto p-6 animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-black text-indigo-700 mb-2">CogniGame</h1>
        <p className="text-gray-500">Allena la mente ogni giorno</p>
      </div>

      <div className="w-full bg-white rounded-3xl shadow-xl p-8">
        <h2 className="text-2xl font-black text-gray-800 mb-2">Benvenuto!</h2>
        <p className="text-gray-500 mb-6 text-sm">
          Inserisci il tuo nickname per iniziare o ritrovare i tuoi progressi.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            placeholder="Il tuo nickname..."
            maxLength={20}
            autoFocus
            className="w-full border-2 border-gray-200 focus:border-indigo-400 rounded-2xl px-5 py-4 text-xl font-semibold outline-none transition-colors"
          />

          {error && (
            <p className="text-red-500 text-sm font-medium text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={!nickname.trim() || loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-xl py-4 rounded-2xl transition-all shadow-lg"
          >
            {loading ? '...' : 'Entra →'}
          </button>
        </form>

        <p className="text-xs text-gray-400 text-center mt-4">
          Se il nickname esiste già, ritroverai i tuoi progressi.
        </p>
      </div>
    </div>
  );
}
