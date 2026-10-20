import React from 'react';
import { GEM_TYPES } from '../utils/splendorData';
import { Trophy, BookmarkPlus, Sparkles } from 'lucide-react';

export default function SplendorCard({ card, onBuy, onReserve, canAfford, isReserved = false }) {
  const bonusGemObj = GEM_TYPES.find(g => g.id === card.bonusGem);

  return (
    <div className={`relative group rounded-xl overflow-hidden border-2 bg-slate-900 flex flex-col justify-between transition-all duration-300 shadow-lg ${
      canAfford 
        ? 'border-amber-400 hover:scale-[1.03] shadow-amber-500/20' 
        : 'border-slate-800 hover:border-slate-700'
    }`}>
      {/* Top Bar: Prestige points & Bonus Gem discount */}
      <div className="flex items-center justify-between px-2.5 py-1.5 bg-black/70 backdrop-blur-sm z-10">
        <div className="flex items-center gap-1">
          {card.prestige > 0 ? (
            <span className="text-sm font-black text-white flex items-center gap-0.5 bg-amber-500/30 px-1.5 py-0.5 rounded border border-amber-500/50">
              <Trophy className="w-3 h-3 text-amber-400" />
              {card.prestige}
            </span>
          ) : (
            <span className="text-[10px] text-slate-500 font-bold">Tier {card.tier}</span>
          )}
        </div>

        {/* Permanent Bonus Gem provided by card */}
        <div className={`w-5 h-5 rounded-full ${bonusGemObj?.color} border-2 border-white/80 shadow flex items-center justify-center`} title={`Bonus ${bonusGemObj?.name}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
        </div>
      </div>

      {/* Character Image */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-950">
        <img 
          src={card.image} 
          alt={card.name} 
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300" 
          loading="lazy" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90" />
        
        {/* Name and Series */}
        <div className="absolute bottom-1.5 left-2 right-2">
          <h4 className="text-xs font-black text-white truncate drop-shadow">{card.name}</h4>
          <p className="text-[9px] text-slate-400 truncate">{card.series}</p>
        </div>
      </div>

      {/* Bottom Gem Cost Row */}
      <div className="p-2 bg-slate-950/95 border-t border-slate-800/80 flex items-center justify-between gap-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          {Object.entries(card.cost).map(([gemId, amount]) => {
            const gem = GEM_TYPES.find(g => g.id === gemId);
            return (
              <div 
                key={gemId}
                className={`flex items-center justify-center w-5 h-5 rounded-full ${gem?.color} text-[10px] font-black text-white border border-white/40 shadow-sm`}
                title={`${amount} ${gem?.name}`}
              >
                {amount}
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          {onReserve && !isReserved && (
            <button
              onClick={() => onReserve(card)}
              title="Reserve Card & Take 1 Gold Wildcard"
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] transition-all"
            >
              <BookmarkPlus className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={() => onBuy(card)}
            disabled={!canAfford}
            className={`px-2 py-1 rounded text-[10px] font-black transition-all ${
              canAfford
                ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md active:scale-95 cursor-pointer'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-60'
            }`}
          >
            Recruit
          </button>
        </div>
      </div>
    </div>
  );
}
