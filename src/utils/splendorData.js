import { TIER_1_CARDS, TIER_2_CARDS, TIER_3_CARDS, NOBLE_PATRONS as ALL_NOBLES } from './massiveDeck';

export const GEM_TYPES = [
  { id: 'ruby', name: 'Ruby (Fire)', color: 'bg-rose-600', text: 'text-rose-400', border: 'border-rose-500' },
  { id: 'sapphire', name: 'Sapphire (Water)', color: 'bg-sky-600', text: 'text-sky-400', border: 'border-sky-500' },
  { id: 'emerald', name: 'Emerald (Wind)', color: 'bg-emerald-600', text: 'text-emerald-400', border: 'border-emerald-500' },
  { id: 'amber', name: 'Amber (Earth)', color: 'bg-amber-600', text: 'text-amber-400', border: 'border-amber-500' },
  { id: 'onyx', name: 'Onyx (Dark)', color: 'bg-purple-900', text: 'text-purple-400', border: 'border-purple-500' },
  { id: 'gold', name: 'Gold (Wildcard)', color: 'bg-yellow-400', text: 'text-yellow-950 font-black', border: 'border-yellow-300', isWildcard: true },
];

export function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Generates 100 fully randomized & shuffled cards per tier + 4 random nobles from the pool of 15
export function getShuffledSplendorDecks() {
  const tier1 = shuffleArray(TIER_1_CARDS.map((c, i) => ({ ...c, id: `t1_${i}_${Math.random().toString(36).substr(2, 4)}` })));
  const tier2 = shuffleArray(TIER_2_CARDS.map((c, i) => ({ ...c, id: `t2_${i}_${Math.random().toString(36).substr(2, 4)}` })));
  const tier3 = shuffleArray(TIER_3_CARDS.map((c, i) => ({ ...c, id: `t3_${i}_${Math.random().toString(36).substr(2, 4)}` })));

  // Pick 4 random Nobles from the expanded pool of 15 iconic Nobles
  const pickedNobles = shuffleArray(ALL_NOBLES).slice(0, 4);

  return {
    tier1,
    tier2,
    tier3,
    nobles: pickedNobles
  };
}
