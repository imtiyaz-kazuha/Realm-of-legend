import React from 'react';
import { GEM_TYPES } from '../utils/splendorData';
import { Trophy, Bookmark, Layers, Crown } from 'lucide-react';

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

        {/* Score & Acquired Nobles Pill */}
        <div className="flex items-center gap-1.5">
          {/* Acquired Nobles mini avatar stack */}
          {(player.nobles || []).length > 0 && (
            <div className="flex items-center -space-x-1.5 bg-slate-950/80 border border-amber-500/50 px-1.5 py-0.5 rounded-lg shadow-sm" title={`Visited by ${player.nobles.length} Noble(s)`}>
              <Crown className="w-3 h-3 text-amber-400 mr-1" />
              {player.nobles.map(n => (
                <img 
                  key={n.id} 
                  src={n.image} 
                  alt={n.name} 
                  title={`Noble Patron: ${n.name} (+3 pts)`}
                  className="w-5 h-5 rounded-full object-cover border border-amber-400/80 shadow" 
                />
              ))}
            </div>
          )}

          <div className="flex items-center gap-1 bg-amber-500/20 border border-amber-500/40 px-2.5 py-1 rounded-xl text-amber-400 font-black text-sm">
            <Trophy className="w-3.5 h-3.5" />
            <span>{player.score}</span>
            <span className="text-[9px] text-amber-300 font-semibold uppercase">/15</span>
          </div>
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
        <div className="mt-2 pt-1.5 border-t border-slate-800">
          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Bookmark className="w-3 h-3 text-amber-400" />
              Reserved ({player.reserved.length}/3)
            </span>
            <span className="text-[8px] text-slate-500 font-normal">Click to recruit</span>
          </div>
          <div className="flex flex-col gap-1.5 overflow-y-auto max-h-36 pr-0.5">
            {player.reserved.map(card => {
              const canAfford = checkCanAfford(player, card);
              const bonusGemObj = GEM_TYPES.find(g => g.id === card.bonusGem);
              return (
                <div 
                  key={card.id}
                  onClick={() => isCurrentTurn && canAfford && onPlayReserved(card)}
                  className={`flex items-center justify-between gap-1.5 p-1.5 rounded-xl border text-[10px] transition-all ${
                    canAfford && isCurrentTurn
                      ? 'border-amber-400 bg-amber-500/15 text-amber-300 hover:scale-[1.02] shadow cursor-pointer ring-1 ring-amber-400/50' 
                      : canAfford
                      ? 'border-amber-500/40 bg-slate-900/90 text-slate-300'
                      : 'border-slate-800 bg-slate-950/80 text-slate-400 opacity-70'
                  }`}
                  title={canAfford ? (isCurrentTurn ? 'Click to recruit reserved card' : 'Can recruit on your turn') : 'Need more gems to recruit'}
                >
                  {/* Left: Thumbnail & Name & Element */}
                  <div className="flex items-center gap-1.5 min-w-0">
                    <img src={card.image} className="w-7 h-7 rounded-lg object-cover flex-shrink-0 border border-slate-700" />
                    <div className="min-w-0 flex flex-col">
                      <span className="font-bold text-[10px] text-white truncate max-w-[75px] md:max-w-[95px] leading-tight">
                        {card.name}
                      </span>
                      <div className="flex items-center gap-1 mt-0.5">
                        {/* Bonus element badge */}
                        <span 
                          className={`w-2.5 h-2.5 rounded-full ${bonusGemObj?.color} border border-white/60 flex-shrink-0`} 
                          title={`+1 ${bonusGemObj?.name} Bonus`} 
                        />
                        {/* Prestige points */}
                        {card.prestige > 0 ? (
                          <span className="text-[8.5px] font-black text-amber-400 flex items-center gap-0.5">
                            <Trophy className="w-2 h-2 text-amber-400" />
                            {card.prestige}
                          </span>
                        ) : (
                          <span className="text-[8px] text-slate-500 font-bold">0 pts</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Cost Badges */}
                  <div className="flex items-center gap-0.5 flex-shrink-0">
                    {Object.entries(card.cost).map(([gemId, costAmount]) => {
                      const gemObj = GEM_TYPES.find(g => g.id === gemId);
                      const playerBonus = player.bonuses[gemId] || 0;
                      const effectiveNeed = Math.max(0, costAmount - playerBonus);
                      const playerHas = (player.tokens[gemId] || 0) + (player.tokens.gold || 0);
                      const isSatisfied = playerHas >= effectiveNeed;

                      return (
                        <span 
                          key={gemId} 
                          className={`w-4 h-4 rounded-full ${gemObj?.color} text-[8.5px] font-black flex items-center justify-center text-white border shadow-xs ${
                            isSatisfied ? 'border-white/80 ring-1 ring-white/30' : 'border-black/50 opacity-60'
                          }`}
                          title={`Cost: ${costAmount} ${gemObj?.name} (After discounts: ${effectiveNeed})`}
                        >
                          {costAmount}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
