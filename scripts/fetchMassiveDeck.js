import fs from 'fs';

async function fetchCharacters(page, perPage = 50) {
  const q = `
  query ($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      characters(sort: FAVOURITES_DESC) {
        id
        name {
          full
        }
        image {
          large
        }
        media(perPage: 1) {
          nodes {
            title {
              userPreferred
            }
          }
        }
      }
    }
  }
  `;

  const res = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: q, variables: { page, perPage } })
  });

  const data = await res.json();
  return data?.data?.Page?.characters || [];
}

async function main() {
  console.log('Fetching top 350 characters from AniList...');
  const all = [];

  for (let page = 1; page <= 7; page++) {
    console.log(`Fetching page ${page}...`);
    try {
      const chars = await fetchCharacters(page, 50);
      all.push(...chars);
    } catch (e) {
      console.error(`Page ${page} failed:`, e);
    }
    // Small pause to respect rate limits
    await new Promise(r => setTimeout(r, 600));
  }

  console.log(`Total retrieved: ${all.length} characters`);

  const GEM_IDS = ['ruby', 'sapphire', 'emerald', 'amber', 'onyx'];

  // Balanced cost archetypes for Splendor
  const TIER1_COSTS = [
    { ruby: 1, sapphire: 2 },
    { emerald: 2, amber: 1 },
    { onyx: 3 },
    { sapphire: 1, emerald: 1, ruby: 1 },
    { amber: 2, onyx: 1 },
    { ruby: 2, emerald: 2 },
    { sapphire: 3 },
    { amber: 1, sapphire: 1, onyx: 1 },
    { ruby: 1, amber: 1, emerald: 1 },
    { onyx: 2, ruby: 1 }
  ];

  const TIER2_COSTS = [
    { ruby: 3, sapphire: 2 },
    { emerald: 4, onyx: 1 },
    { sapphire: 3, amber: 2 },
    { onyx: 3, emerald: 2 },
    { amber: 3, ruby: 2 },
    { ruby: 2, sapphire: 2, onyx: 1 },
    { emerald: 3, ruby: 2, amber: 2 },
    { sapphire: 4, ruby: 2 },
    { amber: 4, emerald: 2 },
    { onyx: 4, sapphire: 2 }
  ];

  const TIER3_COSTS = [
    { ruby: 3, sapphire: 3, onyx: 3 },
    { ruby: 4, amber: 3, sapphire: 2 },
    { emerald: 4, sapphire: 3, ruby: 2 },
    { emerald: 4, ruby: 3, amber: 2 },
    { ruby: 4, onyx: 3 },
    { onyx: 4, sapphire: 3, amber: 2 },
    { sapphire: 5, ruby: 3 },
    { onyx: 5, emerald: 3 },
    { amber: 5, ruby: 3 },
    { emerald: 5, sapphire: 3 }
  ];

  const tier3List = [];
  const tier2List = [];
  const tier1List = [];

  all.forEach((c, idx) => {
    const name = c.name?.full;
    const series = c.media?.nodes?.[0]?.title?.userPreferred || 'Anime Multiverse';
    const image = c.image?.large;
    if (!name || !image) return;

    const bonusGem = GEM_IDS[idx % GEM_IDS.length];

    if (idx < 100) {
      // Tier 3: 100 Legendary characters (3 - 5 points)
      const costPattern = TIER3_COSTS[idx % TIER3_COSTS.length];
      const prestige = 3 + (idx % 3); // 3, 4, 5
      tier3List.push({
        name,
        series,
        image,
        tier: 3,
        prestige,
        bonusGem,
        cost: costPattern
      });
    } else if (idx < 200) {
      // Tier 2: 100 Champions (1 - 2 points)
      const costPattern = TIER2_COSTS[idx % TIER2_COSTS.length];
      const prestige = 1 + (idx % 2); // 1, 2
      tier2List.push({
        name,
        series,
        image,
        tier: 2,
        prestige,
        bonusGem,
        cost: costPattern
      });
    } else {
      // Tier 1: 100+ Recruits & Apprentices (0 - 1 point)
      const costPattern = TIER1_COSTS[idx % TIER1_COSTS.length];
      const prestige = (idx % 4 === 0) ? 1 : 0;
      tier1List.push({
        name,
        series,
        image,
        tier: 1,
        prestige,
        bonusGem,
        cost: costPattern
      });
    }
  });

  // 15 Iconic Noble Patrons across different anime
  const nobles = [
    { id: 'n1', name: 'Satoru Gojou', title: 'The Honored One', image: tier3List[0]?.image || '', points: 3, requires: { onyx: 3, ruby: 3, sapphire: 3 } },
    { id: 'n2', name: 'Monkey D. Luffy', title: 'Warrior of Liberation', image: tier3List[2]?.image || '', points: 3, requires: { ruby: 4, amber: 4 } },
    { id: 'n3', name: 'Levi Ackerman', title: 'Humanity\'s Strongest', image: tier3List[1]?.image || '', points: 3, requires: { emerald: 3, sapphire: 3, amber: 3 } },
    { id: 'n4', name: 'Zoro Roronoa', title: 'King of Hell', image: tier3List[5]?.image || '', points: 3, requires: { emerald: 4, onyx: 4 } },
    { id: 'n5', name: 'Ryomen Sukuna', title: 'King of Curses', image: 'https://s4.anilist.co/file/anilistcdn/character/large/b127213-9zqh1xpIubn7.png', points: 3, requires: { ruby: 3, onyx: 3, amber: 3 } },
    { id: 'n6', name: 'Eren Yeager', title: 'Founder of the Rumbling', image: tier3List[4]?.image || '', points: 3, requires: { ruby: 4, onyx: 4 } },
    { id: 'n7', name: 'Lelouch Lamperouge', title: 'Master of Zero Requiem', image: tier3List[6]?.image || '', points: 3, requires: { onyx: 4, sapphire: 4 } },
    { id: 'n8', name: 'L Lawliet', title: 'World\'s Greatest Detective', image: tier3List[8]?.image || '', points: 3, requires: { sapphire: 3, amber: 3, onyx: 3 } },
    { id: 'n9', name: 'Light Yagami', title: 'God of the New World', image: 'https://s4.anilist.co/file/anilistcdn/character/large/b80-26EhwSsSqQ50.png', points: 3, requires: { onyx: 4, ruby: 4 } },
    { id: 'n10', name: 'Naruto Uzumaki', title: 'Seventh Hokage', image: 'https://s4.anilist.co/file/anilistcdn/character/large/b17-740bX3Q9P591.png', points: 3, requires: { amber: 3, emerald: 3, ruby: 3 } },
    { id: 'n11', name: 'Ichigo Kurosaki', title: 'True Bankai', image: 'https://s4.anilist.co/file/anilistcdn/character/large/b5-bYj14iV4iM2O.png', points: 3, requires: { sapphire: 4, onyx: 4 } },
    { id: 'n12', name: 'Edward Elric', title: 'State Alchemist', image: 'https://s4.anilist.co/file/anilistcdn/character/large/b11-uC0bY9o6t80G.png', points: 3, requires: { amber: 4, ruby: 3, emerald: 3 } },
    { id: 'n13', name: 'Guts', title: 'The Black Swordsman', image: 'https://s4.anilist.co/file/anilistcdn/character/large/b422-VqN2vM5F1n6r.png', points: 3, requires: { onyx: 4, ruby: 4 } },
    { id: 'n14', name: 'Jotaro Kujo', title: 'Star Platinum Stand Master', image: 'https://s4.anilist.co/file/anilistcdn/character/large/b4010-0h8XU6lD9n0c.png', points: 3, requires: { sapphire: 4, ruby: 3, amber: 3 } },
    { id: 'n15', name: 'Saitama', title: 'Hero for Fun', image: 'https://s4.anilist.co/file/anilistcdn/character/large/b73935-Fv11hU0E7gN3.png', points: 3, requires: { amber: 4, ruby: 4 } }
  ];

  const content = `// Auto-generated 300+ Authentic Anime Card Multiverse & 15 Noble Patrons
export const TIER_3_CARDS = ${JSON.stringify(tier3List.slice(0, 100), null, 2)};

export const TIER_2_CARDS = ${JSON.stringify(tier2List.slice(0, 100), null, 2)};

export const TIER_1_CARDS = ${JSON.stringify(tier1List.slice(0, 100), null, 2)};

export const NOBLE_PATRONS = ${JSON.stringify(nobles, null, 2)};
`;

  fs.writeFileSync('src/utils/massiveDeck.js', content, 'utf-8');
  console.log(`Saved 100 Tier 3, 100 Tier 2, 100 Tier 1 cards and 15 Nobles into massiveDeck.js!`);
}

main();
