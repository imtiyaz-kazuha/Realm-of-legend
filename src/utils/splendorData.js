import { RELIABLE_CHARACTERS, NOBLES_LIST } from './reliableCharacters';

export const GEM_TYPES = [
  { id: 'ruby', name: 'Ruby (Fire)', color: 'bg-rose-600', text: 'text-rose-400', border: 'border-rose-500' },
  { id: 'sapphire', name: 'Sapphire (Water)', color: 'bg-sky-600', text: 'text-sky-400', border: 'border-sky-500' },
  { id: 'emerald', name: 'Emerald (Wind)', color: 'bg-emerald-600', text: 'text-emerald-400', border: 'border-emerald-500' },
  { id: 'amber', name: 'Amber (Earth)', color: 'bg-amber-600', text: 'text-amber-400', border: 'border-amber-500' },
  { id: 'onyx', name: 'Onyx (Dark)', color: 'bg-purple-900', text: 'text-purple-400', border: 'border-purple-500' },
  { id: 'gold', name: 'Gold (Wildcard)', color: 'bg-yellow-400', text: 'text-yellow-950 font-black', border: 'border-yellow-300', isWildcard: true },
];

export function getSplendorDeck() {
  return RELIABLE_CHARACTERS.map((char, index) => ({
    ...char,
    id: `card_${char.tier}_${index}`,
  }));
}

export const NOBLE_PATRONS = NOBLES_LIST;
