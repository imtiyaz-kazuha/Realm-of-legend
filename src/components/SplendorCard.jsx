import React, { useState, useEffect } from 'react';
import { GEM_TYPES } from '../utils/splendorData';
import { Trophy, BookmarkPlus, Sparkles } from 'lucide-react';

export default function SplendorCard({ card, onBuy, onReserve, canAfford, isReserved = false }) {
  const [isSpawning, setIsSpawning] = useState(true);
  const [isBuyingVfx, setIsBuyingVfx] = useState(false);
  const bonusGemObj = GEM_TYPES.find(g => g.id === card.bonusGem);

  // Trigger spawn animation whenever a new card occupies this slot
  useEffect(() => {
    setIsSpawning(true);
    const timer = setTimeout(() => setIsSpawning(false), 500);
    return () => clearTimeout(timer);
  }, [card.id]);

  const handleBuyClick = () => {
    if (!canAfford) return;
    setIsBuyingVfx(true);
    setTimeout(() => {
      onBuy(card);
      setIsBuyingVfx(false);
    }, 380);
  };

  return (
    <div className={`relative group rounded-xl overflow-hidden border bg-slate-900 flex flex-col justify-between transition-all duration-150 shadow-md h-full w-full min-h-[140px] md:min-h-0 aspect-[3/4] md:aspect-auto ${
      isBuyingVfx ? 'animate-card-buy-vfx z-30' : isSpawning ? 'animate-card-spawn' : ''
    } ${
      canAfford 
        ? 'border-amber-400 ring-1 ring-amber-400 shadow-amber-500/15' 
        : 'border-slate-800'
    }`}>
      {/* VFX Sparkle Burst on Purchase */}
      {isBuyingVfx && (
        <div className="absolute inset-0 z-40 bg-gradient-to-tr from-amber-400/40 via-yellow-200/60 to-rose-400/40 flex items-center justify-center animate-pulse pointer-events-none">
          <Sparkles className="w-12 h-12 text-yellow-200 animate-spin" />
        </div>
      )}

      {/* Top Bar: Transparent overlay with Prestige (left) & Permanent Gem Discount (right) */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-1.5 sm:px-2 py-1 bg-gradient-to-b from-black/80 via-black/40 to-transparent z-10 flex-shrink-0">
        <div>
          {card.prestige > 0 ? (
            <span className="text-[10px] sm:text-[11px] font-black text-amber-400 flex items-center gap-0.5 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded-md border border-amber-500/50 shadow-sm">
              <Trophy className="w-2.5 h-2.5 text-amber-400" />
              {card.prestige}
            </span>
          ) : (
            <span className="text-[8px] sm:text-[9px] text-white/70 font-black uppercase tracking-wider bg-black/40 backdrop-blur-xs px-1 rounded">T{card.tier}</span>
          )}
        </div>

        {/* Permanent Card Gem Discount */}
        <div className={`w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full ${bonusGemObj?.color} border border-white/90 shadow-md flex items-center justify-center`} title={`Permanent ${bonusGemObj?.name} Discount`}>
          <span className="w-1 h-1 rounded-full bg-white/90" />
        </div>
      </div>

      {/* Character Image: Full card height background */}
      <div className="relative flex-1 min-h-0 w-full overflow-hidden bg-slate-950">
        <img 
          src={card.image} 
          alt={card.name} 
          className="w-full h-full object-cover object-[center_14%]" 
          loading="lazy" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-90" />
        
        {/* Vertical Price Stack on Left (Desktop & Tablet: md+) */}
        <div className="hidden md:flex absolute left-1.5 top-8 bottom-7 flex-col justify-end gap-1 z-10 pointer-events-none">
          {Object.entries(card.cost).map(([gemId, amount]) => {
            const gem = GEM_TYPES.find(g => g.id === gemId);
            return (
              <div 
                key={gemId}
                className={`flex items-center justify-center w-4 h-4 lg:w-4.5 lg:h-4.5 rounded-full ${gem?.color} text-[8.5px] lg:text-[9.5px] font-black text-white border border-white/80 shadow-md backdrop-blur-xs`}
                title={`${amount} ${gem?.name}`}
              >
                {amount}
              </div>
            );
          })}
        </div>

        {/* Character Title Overlay */}
        <div className="absolute bottom-1.5 left-1.5 right-1.5 md:left-6.5">
          <h4 className="text-[10px] sm:text-[11px] font-black text-white truncate drop-shadow leading-tight">{card.name}</h4>
          <p className="text-[7.5px] sm:text-[8px] text-slate-300 truncate leading-none drop-shadow">{card.series}</p>
        </div>
      </div>

      {/* Footer Bar: On desktop/tablet, transparent minimal action bar (buttons on right). On mobile, includes horizontal prices */}
      <div className="px-1.5 py-1 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex items-center justify-between gap-1 flex-shrink-0 z-10">
        {/* Horizontal prices for mobile only */}
        <div className="flex md:hidden items-center gap-0.5 sm:gap-1 flex-wrap">
          {Object.entries(card.cost).map(([gemId, amount]) => {
            const gem = GEM_TYPES.find(g => g.id === gemId);
            return (
              <div 
                key={gemId}
                className={`flex items-center justify-center w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full ${gem?.color} text-[8px] sm:text-[9px] font-black text-white border border-white/40 shadow-xs`}
                title={`${amount} ${gem?.name}`}
              >
                {amount}
              </div>
            );
          })}
        </div>

        {/* Action Buttons: Pushed to right */}
        <div className="flex items-center gap-1 flex-shrink-0 ml-auto">
          {onReserve && !isReserved && (
            <button
              onClick={() => onReserve(card)}
              title="Reserve & Take 1 Gold Wildcard"
              className="p-1 rounded bg-black/60 hover:bg-slate-700 text-slate-300 border border-slate-700/60 backdrop-blur-xs transition-all cursor-pointer"
            >
              <BookmarkPlus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            </button>
          )}

          <button
            onClick={handleBuyClick}
            disabled={!canAfford || isBuyingVfx}
            className={`px-2 py-0.5 rounded text-[8.5px] sm:text-[9.5px] font-black transition-all backdrop-blur-xs ${
              canAfford
                ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md active:scale-95 cursor-pointer ring-1 ring-amber-300/80'
                : 'bg-black/60 text-slate-500 border border-slate-800/80 cursor-not-allowed opacity-50'
            }`}
          >
            Buy
          </button>
        </div>
      </div>
    </div>
  );
}
