import React from 'react';
import { GEM_TYPES } from '../utils/splendorData';
import { Sparkles, Trophy, Bookmark } from 'lucide-react';

export default function PlayerBoard({ player, isCurrentTurn, onPlayReserved, checkCanAfford }) {
  const gemCountTotal = Object.values(player.tokens).reduce((a, b) => a + b, 0);

  return (
    <div className={`p-4 rounded-2xl border-2 transition-all ${
      isCurrentTurn 
        ? 'border-amber-400 bg-slate-900/90 shadow-xl shadow-amber-500/10' 
        : 'border-slate-800 bg-slate-950/70'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-amber-500 flex items-center justify-center font-black text-white text-xs">
            {player.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="text-sm font-black text-white flex items-center gap-2">
              {player.name}
              {isCurrentTurn && (
                <span className="text-[10px] bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded font-black animate-pulse">
                  ACTIVE TURN
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-400">
              Tokens: <span className={gemCountTotal > 10 ? 'text-rose-400 font-bold' : 'text-slate-300'}>{gemCountTotal}/10 max</span>
            </div>
          </div>
        </div>

        {/* Total Prestige Score */}
        <div className="flex items-center gap-1.5 bg-amber-500/20 border border-amber-500/40 px-3 py-1 rounded-xl text-amber-400 font-black text-base">
          <Trophy className="w-4 h-4" />
          <span>{player.score}</span>
          <span className="text-[10px] text-amber-300 font-semibold uppercase">/ 15 to win</span>
        </div>
      </div>

      {/* Gem Token Inventory & Permanent Card Bonuses */}
      <div className="grid grid-cols-6 gap-2 mt-3 text-center">
        {GEM_TYPES.map(gem => {
          const tokenCount = player.tokens[gem.id] || 0;
          const bonusCount = player.bonuses[gem.id] || 0;

          return (
            <div key={gem.id} className="flex flex-col items-center">
              {/* Token Chip */}
              <div className={`w-8 h-8 rounded-full ${gem.color} border-2 border-white/60 shadow flex items-center justify-center text-white text-xs font-black`}>
                {tokenCount}
              </div>

              {/* Permanent Card Discount Bonus */}
              {!gem.isWildcard && (
                <div className="text-[10px] font-bold text-slate-400 mt-1 flex items-center gap-0.5" title={`Permanent ${gem.name} discount`}>
                  <span className="text-emerald-400">+{bonusCount}</span>
                </div>
              )}
              {gem.isWildcard && (
                <div className="text-[9px] text-yellow-500 font-bold mt-1">Wild</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Reserved Cards Bar */}
      {player.reserved.length > 0 && (
        <div className="mt-3 pt-2 border-t border-slate-800">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Bookmark className="w-3 h-3 text-amber-400" />
            Reserved Cards ({player.reserved.length}/3)
          </div>
          <div className="flex gap-2">
            {player.reserved.map(card => {
              const canAfford = checkCanAfford(player, card);
              return (
                <div 
                  key={card.id}
                  onClick={() => isCurrentTurn && canAfford && onPlayReserved(card)}
                  className={`flex items-center gap-2 p-1.5 rounded-lg border text-xs cursor-pointer transition-all ${
                    canAfford 
                      ? 'border-amber-400 bg-amber-500/10 text-amber-300 hover:scale-105' 
                      : 'border-slate-800 bg-slate-900 text-slate-500 opacity-60'
                  }`}
                  title={canAfford ? 'Click to recruit this reserved card' : 'Cannot afford yet'}
                >
                  <img src={card.image} className="w-6 h-6 rounded-md object-cover" />
                  <span className="font-bold truncate max-w-[80px]">{card.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
