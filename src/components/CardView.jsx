import React from 'react';
import { Shield, Swords, Zap, Heart, Sparkles, CheckCircle2 } from 'lucide-react';
import { RARITY_INFO, ELEMENT_COLORS } from '../utils/cardRules';

export default function CardView({ 
  card, 
  onSelect, 
  isSelected, 
  onUpgrade, 
  isCompact = false,
  showActions = true 
}) {
  const rarity = RARITY_INFO[card.rarity] || RARITY_INFO.C;
  const isHighRarity = card.rarity === 'UR' || card.rarity === 'SEC';

  return (
    <div 
      onClick={() => onSelect && onSelect(card)}
      className={`relative group rounded-xl overflow-hidden border-2 transition-all duration-300 cursor-pointer flex flex-col
        ${rarity.border} 
        ${card.rarity === 'UR' ? 'foil-ur shadow-amber-500/20 shadow-lg' : ''}
        ${card.rarity === 'SEC' ? 'foil-sec shadow-purple-500/30 shadow-xl' : 'hover:scale-[1.02]'}
        ${isSelected ? 'ring-4 ring-game-gold shadow-2xl scale-[1.03]' : ''}
        bg-gradient-to-b ${rarity.bg}
      `}
      style={{
        boxShadow: isHighRarity ? `0 10px 25px -5px ${rarity.glow}` : undefined
      }}
    >
      {/* Top Banner: Series & Rarity */}
      <div className="flex items-center justify-between px-3 py-2 bg-black/40 backdrop-blur-sm z-10">
        <span className="text-xs font-semibold text-slate-300 truncate max-w-[140px]">
          {card.series}
        </span>
        <div className="flex items-center gap-1.5">
          <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${rarity.badge}`}>
            {card.rarity}
          </span>
          {isSelected && (
            <CheckCircle2 className="w-4 h-4 text-game-gold animate-bounce" />
          )}
        </div>
      </div>

      {/* Character Image with Gradient Vignette */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-950">
        <img 
          src={card.image} 
          alt={card.name}
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-game-dark via-transparent to-transparent opacity-90" />
        
        {/* Element Tag */}
        <div className="absolute top-2 left-2 z-10">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border backdrop-blur-md ${ELEMENT_COLORS[card.element] || 'text-white'}`}>
            {card.element}
          </span>
        </div>

        {/* Level Tag */}
        {card.level && (
          <div className="absolute bottom-2 right-2 bg-game-dark/90 border border-slate-700 px-2 py-0.5 rounded text-xs font-bold text-game-gold shadow">
            Lv. {card.level}
          </div>
        )}
      </div>

      {/* Info & Stats */}
      <div className="p-3 flex-1 flex flex-col justify-between bg-game-dark/80 backdrop-blur-md z-10">
        <div>
          <h3 className="font-bold text-sm tracking-wide text-white truncate drop-shadow">
            {card.name}
          </h3>
          {!isCompact && (
            <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 min-h-[32px]">
              {card.description}
            </p>
          )}
        </div>

        {/* Base / Current Stats */}
        <div className="grid grid-cols-2 gap-1.5 mt-2.5 pt-2 border-t border-slate-800 text-[11px]">
          <div className="flex items-center gap-1 text-rose-400">
            <Heart className="w-3.5 h-3.5" />
            <span className="font-bold">{card.hp?.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1 text-amber-400">
            <Swords className="w-3.5 h-3.5" />
            <span className="font-bold">{card.atk?.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1 text-blue-400">
            <Shield className="w-3.5 h-3.5" />
            <span className="font-bold">{card.def?.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1 text-emerald-400">
            <Zap className="w-3.5 h-3.5" />
            <span className="font-bold">{card.spd} SPD</span>
          </div>
        </div>

        {/* Upgrade Button */}
        {showActions && onUpgrade && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onUpgrade(card.instanceId);
            }}
            className="mt-3 w-full py-1.5 bg-gradient-to-r from-game-accent to-indigo-600 hover:from-indigo-500 hover:to-indigo-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1 shadow-md transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            Upgrade (500 G)
          </button>
        )}
      </div>
    </div>
  );
}
