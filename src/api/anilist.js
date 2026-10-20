import { DEFAULT_CARDS } from './defaultCards';

const ANILIST_API_URL = 'https://graphql.anilist.co';

// GraphQL query to fetch top popular anime characters with HD images and media title
const CHARACTERS_QUERY = `
query ($page: Int, $perPage: Int) {
  Page(page: $page, perPage: $perPage) {
    pageInfo {
      hasNextPage
    }
    characters(sort: FAVOURITES_DESC) {
      id
      name {
        full
      }
      image {
        large
      }
      favourites
      media(sort: POPULARITY_DESC, perPage: 1) {
        nodes {
          title {
            english
            romaji
          }
        }
      }
      description
    }
  }
}
`;

const ELEMENTS = ['Fire', 'Water', 'Wind', 'Earth', 'Light', 'Dark'];

// Assigns rarity and balanced stats based on popularity/favourites
function generateCardFromAniList(character) {
  const favs = character.favourites || 100;
  let rarity = 'C';
  let statMultiplier = 1.0;

  if (favs > 80000) {
    rarity = 'SEC';
    statMultiplier = 4.2;
  } else if (favs > 45000) {
    rarity = 'UR';
    statMultiplier = 3.2;
  } else if (favs > 25000) {
    rarity = 'SR';
    statMultiplier = 2.4;
  } else if (favs > 10000) {
    rarity = 'R';
    statMultiplier = 1.8;
  } else if (favs > 4000) {
    rarity = 'UC';
    statMultiplier = 1.3;
  } else {
    rarity = 'C';
    statMultiplier = 1.0;
  }

  // Consistent element selection based on character id
  const element = ELEMENTS[character.id % ELEMENTS.length];
  const series = character.media?.nodes?.[0]?.title?.english || 
                 character.media?.nodes?.[0]?.title?.romaji || 
                 'Anime Universe';

  const baseHp = 1200 + ((character.id * 37) % 500);
  const baseAtk = 400 + ((character.id * 19) % 150);
  const baseDef = 300 + ((character.id * 23) % 120);
  const baseSpd = 85 + ((character.id * 13) % 35);

  return {
    id: character.id,
    name: character.name.full,
    series,
    element,
    rarity,
    image: character.image.large,
    hp: Math.round(baseHp * statMultiplier),
    atk: Math.round(baseAtk * statMultiplier),
    def: Math.round(baseDef * statMultiplier),
    spd: Math.round(baseSpd * (1 + (statMultiplier - 1) * 0.3)),
    description: character.description?.replace(/<[^>]*>?/gm, '').slice(0, 150) || 'An iconic character in the AniGame universe.'
  };
}

export async function fetchLiveAniListCards(page = 1, perPage = 30) {
  try {
    const res = await fetch(ANILIST_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: CHARACTERS_QUERY,
        variables: { page, perPage }
      })
    });

    if (!res.ok) {
      console.warn('AniList API error, fallback to default card list');
      return DEFAULT_CARDS;
    }

    const data = await res.json();
    const characters = data?.data?.Page?.characters || [];
    if (characters.length === 0) return DEFAULT_CARDS;

    return characters.map(generateCardFromAniList);
  } catch (err) {
    console.warn('AniList fetch failed, using fallback card deck', err);
    return DEFAULT_CARDS;
  }
}
