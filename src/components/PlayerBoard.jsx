import React from 'react';
import { GEM_TYPES } from '../utils/splendorData';
import { Trophy, Bookmark, Layers } from 'lucide-react';

export default function PlayerBoard({ player, isCurrentTurn, onPlayReserved, checkCanAfford }) {
  const gemCountTotal = Object.values(player.tokens).reduce((a, b) => a + b, 0);

  return (
    <div className={`p-3 md:p-4 rounded-2xl border-2 transition-all ${
      isCurrentTurn 
        ? 'border-amber-400 bg-slate-900 shadow-xl shadow-amber-500/10' 
        : 'border-slate-800 bg-slate-950/80'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-amber-500 flex items-center justify-center font-black text-white text-xs shadow">
            {player.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="text-xs md:text-sm font-black text-white flex items-center gap-1.5">
              <span className="truncate max-w-[100px] md:max-w-[130px]">{player.name}</span>
              {isCurrentTurn && (
                <span className="text-[9px] bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded font-black animate-pulse">
                  ACTIVE
                </span>
              )}
            </div>
            <div className="text-[10px] text-slate-400">
              Tokens: <span className={gemCountTotal > 10 ? 'text-rose-400 font-bold' : 'text-slate-300'}>{gemCountTotal}/10</span>
            </div>
          </div>
        </div>

        {/* Score */}
        <div className="flex items-center gap-1 bg-amber-500/20 border border-amber-500/40 px-2.5 py-1 rounded-xl text-amber-400 font-black text-sm">
          <Trophy className="w-3.5 h-3.5" />
          <span>{player.score}</span>
          <span className="text-[9px] text-amber-300 font-semibold uppercase">/15</span>
        </div>
      </div>

      {/* Gem Token Chips & Card Badges */}
      <div className="grid grid-cols-6 gap-1.5 mt-3 text-center">
        {GEM_TYPES.map(gem => {
          const tokenCount = player.tokens[gem.id] || 0;
          const cardCount = player.bonuses[gem.id] || 0;

          return (
            <div key={gem.id} className="flex flex-col items-center">
              {/* Token Chip */}
              <div 
                className={`w-7 h-7 md:w-8 md:h-8 rounded-full ${gem.color} border-2 border-white/60 shadow flex items-center justify-center text-white text-xs font-black`}
                title={`${gem.name} Tokens`}
              >
                {tokenCount}
              </div>

              {/* Permanent Card Logo Badge (Mini Card Icon with recruited count) */}
              {!gem.isWildcard ? (
                <div 
                  className={`mt-1 flex items-center justify-center gap-0.5 px-1 py-0.5 rounded border text-[9px] font-black transition-all ${
                    cardCount > 0 
                      ? 'bg-slate-800 border-slate-600 text-amber-300 shadow-sm' 
                      : 'bg-transparent border-transparent text-slate-600'
                  }`}
                  title={`${cardCount} Permanent ${gem.name} Cards`}
                >
                  <Layers className={`w-2.5 h-2.5 ${cardCount > 0 ? 'text-amber-400' : 'text-slate-600'}`} />
                  <span>{cardCount}</span>
                </div>
              ) : (
                <div className="mt-1 text-[8px] text-amber-400 font-bold">Wild</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Reserved Cards */}
      {player.reserved.length > 0 && (
        <div className="mt-2.5 pt-2 border-t border-slate-800">
          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Bookmark className="w-3 h-3 text-amber-400" />
            Reserved ({player.reserved.length}/3)
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {player.reserved.map(card => {
              const canAfford = checkCanAfford(player, card);
              return (
                <div 
                  key={card.id}
                  onClick={() => isCurrentTurn && canAfford && onPlayReserved(card)}
                  className={`flex items-center gap-1.5 p-1 rounded-lg border text-[10px] cursor-pointer transition-all flex-shrink-0 ${
                    canAfford 
                      ? 'border-amber-400 bg-amber-500/20 text-amber-300 hover:scale-105 shadow' 
                      : 'border-slate-800 bg-slate-900 text-slate-500 opacity-60'
                  }`}
                  title={canAfford ? 'Click to recruit reserved card' : 'Need more gems'}
                >
                  <img src={card.image} className="w-5 h-5 rounded object-cover" />
                  <span className="font-bold truncate max-w-[70px]">{card.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
