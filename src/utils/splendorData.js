import { EXPANDED_CHARACTERS, NOBLE_PATRONS as ALL_NOBLES } from './reliableCharacters';

export const GEM_TYPES = [
  { id: 'ruby', name: 'Ruby (Fire)', color: 'bg-rose-600', text: 'text-rose-400', border: 'border-rose-500' },
  { id: 'sapphire', name: 'Sapphire (Water)', color: 'bg-sky-600', text: 'text-sky-400', border: 'border-sky-500' },
  { id: 'emerald', name: 'Emerald (Wind)', color: 'bg-emerald-600', text: 'text-emerald-400', border: 'border-emerald-500' },
  { id: 'amber', name: 'Amber (Earth)', color: 'bg-amber-600', text: 'text-amber-400', border: 'border-amber-500' },
  { id: 'onyx', name: 'Onyx (Dark)', color: 'bg-purple-900', text: 'text-purple-400', border: 'border-purple-500' },
  { id: 'gold', name: 'Gold (Wildcard)', color: 'bg-yellow-400', text: 'text-yellow-950 font-black', border: 'border-yellow-300', isWildcard: true },
];

// Fisher-Yates array shuffle algorithm
export function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Generate randomized, fully shuffled decks for a match
export function getShuffledSplendorDecks() {
  const cards = EXPANDED_CHARACTERS.map((char, index) => ({
    ...char,
    id: `card_${char.tier}_${index}_${Math.random().toString(36).substr(2, 4)}`,
  }));

  const tier1 = shuffleArray(cards.filter(c => c.tier === 1));
  const tier2 = shuffleArray(cards.filter(c => c.tier === 2));
  const tier3 = shuffleArray(cards.filter(c => c.tier === 3));

  // Pick 3 random Nobles out of the noble pool for each match
  const shuffledNobles = shuffleArray(ALL_NOBLES).slice(0, 3);

  return {
    tier1,
    tier2,
    tier3,
    nobles: shuffledNobles
  };
}
