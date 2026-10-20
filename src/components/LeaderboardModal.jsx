import React from 'react';
import { X, Trophy, Medal, Star, Flame, UserCheck } from 'lucide-react';

export default function LeaderboardModal({ onClose }) {
  // Read local/saved multiplayer game records from localStorage
  const records = (() => {
    try {
      const saved = localStorage.getItem('rol_leaderboard');
      if (saved) return JSON.parse(saved);
    } catch {}

    // Default starter champions for prestige feeling
    return [
      { name: 'Kazuha_Main', wins: 8, totalMatches: 10, totalScore: 142, avgScore: 14.2 },
      { name: 'Gojo_Sensei', wins: 6, totalMatches: 8, totalScore: 114, avgScore: 14.3 },
      { name: 'StrawHat_Ace', wins: 5, totalMatches: 9, totalScore: 118, avgScore: 13.1 },
      { name: 'Levi_Captain', wins: 4, totalMatches: 7, totalScore: 95, avgScore: 13.6 },
      { name: 'Demon_Slayer', wins: 2, totalMatches: 5, totalScore: 61, avgScore: 12.2 },
    ];
  })();

  // Sort by most wins then avgScore
  const sorted = [...records].sort((a, b) => b.wins - a.wins || b.avgScore - a.avgScore);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6">
      <div className="bg-slate-900 border-2 border-amber-500/80 rounded-3xl p-5 md:p-8 max-w-xl w-full shadow-2xl relative my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2.5 text-amber-400 mb-2">
          <Trophy className="w-6 h-6 text-amber-400 animate-bounce" />
          <h2 className="text-2xl font-black text-white tracking-wide">
            Realm Hall of Fame
          </h2>
        </div>
        <p className="text-xs text-slate-400 mb-5">
          Top duelists ranked by multiplayer match wins and scoring prowess.
        </p>

        {/* Leaderboard Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
          <div className="grid grid-cols-12 px-3 py-2.5 bg-slate-900/90 border-b border-slate-800 text-[11px] font-black uppercase tracking-wider text-slate-400">
            <span className="col-span-1">#</span>
            <span className="col-span-5">Player</span>
            <span className="col-span-2 text-center">Wins</span>
            <span className="col-span-2 text-center">Matches</span>
            <span className="col-span-2 text-right">Avg Pts</span>
          </div>

          <div className="divide-y divide-slate-850 max-h-72 overflow-y-auto">
            {sorted.map((item, idx) => {
              const isTop3 = idx < 3;
              const medalColor = idx === 0 ? 'text-amber-400' : idx === 1 ? 'text-slate-300' : 'text-amber-600';

              return (
                <div 
                  key={item.name + idx} 
                  className={`grid grid-cols-12 px-3 py-3 items-center text-xs transition-colors ${
                    isTop3 ? 'bg-amber-500/5 hover:bg-amber-500/10' : 'hover:bg-slate-900/50'
                  }`}
                >
                  <span className="col-span-1 font-black flex items-center">
                    {isTop3 ? <Medal className={`w-4 h-4 ${medalColor}`} /> : <span className="text-slate-500">{idx + 1}</span>}
                  </span>
                  <div className="col-span-5 font-bold text-white flex items-center gap-1.5 truncate">
                    <span className="truncate">{item.name}</span>
                    {idx === 0 && <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 flex-shrink-0" />}
                  </div>
                  <span className="col-span-2 text-center font-black text-amber-400">
                    {item.wins}W
                  </span>
                  <span className="col-span-2 text-center text-slate-400">
                    {item.totalMatches}
                  </span>
                  <span className="col-span-2 text-right font-mono font-bold text-slate-200">
                    {item.avgScore.toFixed(1)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <p className="text-[10px] text-slate-500 mt-3 text-center">
          Multiplayer match wins automatically record your stats to the Hall of Fame!
        </p>

        <button
          onClick={onClose}
          className="mt-4 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition-all cursor-pointer"
        >
          Close Hall of Fame
        </button>
      </div>
    </div>
  );
}
