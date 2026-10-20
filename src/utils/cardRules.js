export const RARITY_INFO = {
  C: {
    label: 'Common',
    color: 'text-slate-400',
    border: 'border-slate-500/40',
    bg: 'from-slate-800 to-slate-900',
    glow: 'rgba(148, 163, 184, 0.2)',
    badge: 'bg-slate-700/80 text-slate-300',
    weight: 50,
  },
  UC: {
    label: 'Uncommon',
    color: 'text-emerald-400',
    border: 'border-emerald-500/50',
    bg: 'from-emerald-950/60 to-slate-900',
    glow: 'rgba(16, 185, 129, 0.3)',
    badge: 'bg-emerald-900/80 text-emerald-300',
    weight: 28,
  },
  R: {
    label: 'Rare',
    color: 'text-blue-400',
    border: 'border-blue-500/60',
    bg: 'from-blue-950/60 to-slate-900',
    glow: 'rgba(59, 130, 246, 0.4)',
    badge: 'bg-blue-900/80 text-blue-300',
    weight: 14,
  },
  SR: {
    label: 'Super Rare',
    color: 'text-purple-400',
    border: 'border-purple-500/70',
    bg: 'from-purple-950/60 to-slate-900',
    glow: 'rgba(168, 85, 247, 0.5)',
    badge: 'bg-purple-900/80 text-purple-200',
    weight: 6,
  },
  UR: {
    label: 'Ultra Rare',
    color: 'text-amber-400',
    border: 'border-amber-400',
    bg: 'from-amber-950/60 to-slate-900',
    glow: 'rgba(251, 191, 36, 0.7)',
    badge: 'bg-amber-600 text-amber-950 font-black',
    weight: 1.8,
  },
  SEC: {
    label: 'Secret Rare',
    color: 'text-rose-400',
    border: 'border-rose-500 animate-pulse',
    bg: 'from-rose-950/80 to-slate-950',
    glow: 'rgba(244, 63, 94, 0.9)',
    badge: 'bg-gradient-to-r from-rose-500 to-indigo-500 text-white font-black',
    weight: 0.2,
  }
};

export const ELEMENT_COLORS = {
  Fire: 'text-rose-400 bg-rose-950/60 border-rose-800',
  Water: 'text-sky-400 bg-sky-950/60 border-sky-800',
  Wind: 'text-teal-400 bg-teal-950/60 border-teal-800',
  Earth: 'text-amber-500 bg-amber-950/60 border-amber-800',
  Light: 'text-yellow-300 bg-yellow-950/60 border-yellow-800',
  Dark: 'text-purple-400 bg-purple-950/60 border-purple-800',
};

// Roll random card based on rarity weight distribution
export function pullRandomCard(cardPool) {
  if (!cardPool || cardPool.length === 0) return null;

  const rand = Math.random() * 100;
  let targetRarity = 'C';

  if (rand < 0.2) targetRarity = 'SEC';
  else if (rand < 2.0) targetRarity = 'UR';
  else if (rand < 8.0) targetRarity = 'SR';
  else if (rand < 22.0) targetRarity = 'R';
  else if (rand < 50.0) targetRarity = 'UC';
  else targetRarity = 'C';

  const matches = cardPool.filter(c => c.rarity === targetRarity);
  const selected = matches.length > 0 
    ? matches[Math.floor(Math.random() * matches.length)]
    : cardPool[Math.floor(Math.random() * cardPool.length)];

  // Create a unique instance of this card with level 1 and unique instance ID
  return {
    ...selected,
    instanceId: `${selected.id}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    level: 1,
    exp: 0,
    equipped: false,
  };
}
