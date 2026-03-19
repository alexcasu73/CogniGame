import { useEffect, useRef } from 'react';

export default function Timer({ seconds, onExpire, running = true }) {
  const pct = Math.max(0, seconds / 300 * 100);
  const color = seconds > 60 ? 'bg-green-500' : seconds > 20 ? 'bg-yellow-500' : 'bg-red-500';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <div className="flex items-center gap-3">
      <div className="text-2xl font-bold tabular-nums text-gray-700">
        {String(mins).padStart(2,'0')}:{String(secs).padStart(2,'0')}
      </div>
      <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden min-w-[80px]">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
