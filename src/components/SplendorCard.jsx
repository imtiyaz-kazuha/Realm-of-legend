import React from 'react';
import { GEM_TYPES } from '../utils/splendorData';
import { Trophy, BookmarkPlus } from 'lucide-react';

export default function SplendorCard({ card, onBuy, onReserve, canAfford, isReserved = false }) {
  const bonusGemObj = GEM_TYPES.find(g => g.id === card.bonusGem);

  return (
    <div className={`relative group rounded-xl overflow-hidden border bg-slate-900 flex flex-col justify-between transition-all duration-150 shadow-md ${
      canAfford 
        ? 'border-amber-400 ring-1 ring-amber-400 shadow-amber-500/15 scale-[1.01]' 
        : 'border-slate-800'
    }`}>
      {/* Top Bar: Prestige & Gem Discount */}
      <div className="flex items-center justify-between px-2 py-1 bg-black/85 backdrop-blur-sm z-10 flex-shrink-0">
        <div>
          {card.prestige > 0 ? (
            <span className="text-[11px] font-black text-amber-400 flex items-center gap-0.5 bg-amber-500/20 px-1.5 py-0.2 rounded border border-amber-500/40">
              <Trophy className="w-3 h-3 text-amber-400" />
              {card.prestige}
            </span>
          ) : (
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">T{card.tier}</span>
          )}
        </div>

        {/* Permanent Card Gem Discount */}
        <div className={`w-4 h-4 rounded-full ${bonusGemObj?.color} border border-white/80 shadow flex items-center justify-center`} title={`Permanent ${bonusGemObj?.name} Discount`}>
          <span className="w-1.5 h-1.5 rounded-full bg-white/90" />
        </div>
      </div>

      {/* Proper 4:3 Aspect Ratio Card Image (Holds ratio naturally, no stretching or weird squish) */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
        <img 
          src={card.image} 
          alt={card.name} 
          className="w-full h-full object-cover object-top" 
          loading="lazy" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90" />
        
        {/* Character Title Overlay */}
        <div className="absolute bottom-1 left-2 right-2">
          <h4 className="text-[11px] font-black text-white truncate drop-shadow">{card.name}</h4>
          <p className="text-[8px] text-slate-400 truncate leading-none">{card.series}</p>
        </div>
      </div>

      {/* Costs & Action Buttons */}
      <div className="p-1.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-1 flex-shrink-0">
        <div className="flex items-center gap-1 flex-wrap">
          {Object.entries(card.cost).map(([gemId, amount]) => {
            const gem = GEM_TYPES.find(g => g.id === gemId);
            return (
              <div 
                key={gemId}
                className={`flex items-center justify-center w-4 h-4 rounded-full ${gem?.color} text-[9px] font-black text-white border border-white/40 shadow-xs`}
                title={`${amount} ${gem?.name}`}
              >
                {amount}
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          {onReserve && !isReserved && (
            <button
              onClick={() => onReserve(card)}
              title="Reserve & Take 1 Gold Wildcard"
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer"
            >
              <BookmarkPlus className="w-3 h-3" />
            </button>
          )}

          <button
            onClick={() => onBuy(card)}
            disabled={!canAfford}
            className={`px-2 py-0.5 rounded text-[10px] font-black transition-all ${
              canAfford
                ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow active:scale-95 cursor-pointer'
                : 'bg-slate-800 text-slate-600 cursor-not-allowed opacity-50'
            }`}
          >
            Buy
          </button>
        </div>
      </div>
    </div>
  );
}
