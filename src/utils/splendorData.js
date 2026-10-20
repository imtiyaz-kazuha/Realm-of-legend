import { DEFAULT_CARDS } from '../api/defaultCards';

// GEM TYPES (Splendor style)
export const GEM_TYPES = [
  { id: 'ruby', name: 'Ruby (Fire)', color: 'bg-rose-600', text: 'text-rose-400', border: 'border-rose-500', glow: 'shadow-rose-500/50' },
  { id: 'sapphire', name: 'Sapphire (Water)', color: 'bg-sky-600', text: 'text-sky-400', border: 'border-sky-500', glow: 'shadow-sky-500/50' },
  { id: 'emerald', name: 'Emerald (Wind)', color: 'bg-emerald-600', text: 'text-emerald-400', border: 'border-emerald-500', glow: 'shadow-emerald-500/50' },
  { id: 'amber', name: 'Amber (Earth)', color: 'bg-amber-600', text: 'text-amber-400', border: 'border-amber-500', glow: 'shadow-amber-500/50' },
  { id: 'onyx', name: 'Onyx (Dark)', color: 'bg-purple-900', text: 'text-purple-400', border: 'border-purple-500', glow: 'shadow-purple-500/50' },
  { id: 'gold', name: 'Gold (Wildcard)', color: 'bg-yellow-400', text: 'text-yellow-950 font-black', border: 'border-yellow-300', glow: 'shadow-yellow-400/80', isWildcard: true },
];

const GEM_IDS = ['ruby', 'sapphire', 'emerald', 'amber', 'onyx'];

// Map Anime characters to 3 Tiers of Splendor cards
export function generateSplendorCards(cardPool) {
  const pool = (cardPool && cardPool.length > 0) ? cardPool : DEFAULT_CARDS;
  const cards = [];

  pool.forEach((char, idx) => {
    // Determine card tier based on rarity or index
    let tier = 1;
    let prestige = 0;
    let cost = {};
    const bonusGem = GEM_IDS[idx % GEM_IDS.length];

    if (char.rarity === 'SEC' || char.rarity === 'UR') {
      tier = 3;
      prestige = 3 + (idx % 3); // 3 - 5 Prestige Points
      // Tier 3 heavy cost (7-8 gems total)
      const primaryGem = GEM_IDS[(idx + 1) % GEM_IDS.length];
      const secondaryGem = GEM_IDS[(idx + 2) % GEM_IDS.length];
      cost[primaryGem] = 4 + (idx % 2);
      cost[secondaryGem] = 3 + (idx % 2);
    } else if (char.rarity === 'SR' || char.rarity === 'R') {
      tier = 2;
      prestige = 1 + (idx % 3); // 1 - 3 Prestige Points
      // Tier 2 moderate cost (4-6 gems)
      const primaryGem = GEM_IDS[(idx + 1) % GEM_IDS.length];
      const secondaryGem = GEM_IDS[(idx + 3) % GEM_IDS.length];
      cost[primaryGem] = 2 + (idx % 2);
      cost[secondaryGem] = 2;
      cost[bonusGem] = 1;
    } else {
      tier = 1;
      prestige = (idx % 4 === 0) ? 1 : 0; // 0 - 1 Prestige Points
      // Tier 1 cheap cost (3-4 gems)
      const g1 = GEM_IDS[(idx + 1) % GEM_IDS.length];
      const g2 = GEM_IDS[(idx + 2) % GEM_IDS.length];
      cost[g1] = 1 + (idx % 2);
      cost[g2] = 2;
    }

    cards.push({
      id: `sc_${char.id}_${idx}`,
      name: char.name,
      series: char.series,
      image: char.image,
      tier,
      prestige,
      bonusGem,
      cost,
    });
  });

  return cards;
}

// Noble / Legend patrons (worth 3 points each when you recruit specific gem bonuses)
export const NOBLE_PATRONS = [
  {
    id: 'noble_1',
    name: 'Satoru Gojo',
    title: 'The Honored One',
    image: 'https://s4.anilist.co/file/anilistcdn/character/large/b127993-9qU2Q2yK0E7z.png',
    points: 3,
    requires: { onyx: 3, ruby: 3, sapphire: 3 }
  },
  {
    id: 'noble_2',
    name: 'Luffy (Gear 5)',
    title: 'Warrior of Liberation',
    image: 'https://s4.anilist.co/file/anilistcdn/character/large/b40-X19WpX4q04qH.png',
    points: 3,
    requires: { ruby: 4, amber: 4 }
  },
  {
    id: 'noble_3',
    name: 'Levi Ackerman',
    title: 'Humanity\'s Strongest',
    image: 'https://s4.anilist.co/file/anilistcdn/character/large/b45627-yN4oOQ6sY96B.png',
    points: 3,
    requires: { emerald: 3, sapphire: 3, amber: 3 }
  },
  {
    id: 'noble_4',
    name: 'Ichigo Kurosaki',
    title: 'Soul Reaper Sovereign',
    image: 'https://s4.anilist.co/file/anilistcdn/character/large/b5-bYj14iV4iM2O.png',
    points: 3,
    requires: { onyx: 4, emerald: 4 }
  }
];
