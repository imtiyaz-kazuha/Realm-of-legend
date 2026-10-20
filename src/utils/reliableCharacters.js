// Reliable, high-res anime characters with CORS-friendly, permanent CDN links
export const RELIABLE_CHARACTERS = [
  // Tier 3: Legendary Heroes
  {
    name: "Satoru Gojo",
    series: "Jujutsu Kaisen",
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80",
    fallback: "https://cdn.myanimelist.net/images/characters/15/422168.jpg",
    tier: 3,
    prestige: 4,
    bonusGem: "onyx",
    cost: { ruby: 3, sapphire: 3, onyx: 3 }
  },
  {
    name: "Monkey D. Luffy",
    series: "One Piece",
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80",
    fallback: "https://cdn.myanimelist.net/images/characters/9/310307.jpg",
    tier: 3,
    prestige: 5,
    bonusGem: "ruby",
    cost: { ruby: 4, amber: 3, sapphire: 2 }
  },
  {
    name: "Naruto Uzumaki",
    series: "Naruto Shippuden",
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80",
    fallback: "https://cdn.myanimelist.net/images/characters/16/76453.jpg",
    tier: 3,
    prestige: 4,
    bonusGem: "amber",
    cost: { emerald: 4, amber: 3, ruby: 2 }
  },
  {
    name: "Ichigo Kurosaki",
    series: "Bleach",
    image: "https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80",
    fallback: "https://cdn.myanimelist.net/images/characters/2/73249.jpg",
    tier: 3,
    prestige: 4,
    bonusGem: "sapphire",
    cost: { onyx: 4, sapphire: 3, emerald: 2 }
  },
  {
    name: "Eren Yeager",
    series: "Attack on Titan",
    image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600&auto=format&fit=crop&q=80",
    fallback: "https://cdn.myanimelist.net/images/characters/10/216895.jpg",
    tier: 3,
    prestige: 3,
    bonusGem: "ruby",
    cost: { ruby: 4, onyx: 3 }
  },
  {
    name: "Roronoa Zoro",
    series: "One Piece",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
    fallback: "https://cdn.myanimelist.net/images/characters/3/100534.jpg",
    tier: 3,
    prestige: 4,
    bonusGem: "emerald",
    cost: { emerald: 4, ruby: 3, amber: 2 }
  },

  // Tier 2: Skilled Champions
  {
    name: "Levi Ackerman",
    series: "Attack on Titan",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
    fallback: "https://cdn.myanimelist.net/images/characters/2/241413.jpg",
    tier: 2,
    prestige: 2,
    bonusGem: "emerald",
    cost: { emerald: 2, sapphire: 2, amber: 1 }
  },
  {
    name: "Killua Zoldyck",
    series: "Hunter x Hunter",
    image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80",
    fallback: "https://cdn.myanimelist.net/images/characters/2/327920.jpg",
    tier: 2,
    prestige: 2,
    bonusGem: "sapphire",
    cost: { sapphire: 3, ruby: 2 }
  },
  {
    name: "Tanjiro Kamado",
    series: "Demon Slayer",
    image: "https://images.unsplash.com/photo-1569701814227-2c974c8b284e?w=600&auto=format&fit=crop&q=80",
    fallback: "https://cdn.myanimelist.net/images/characters/11/384523.jpg",
    tier: 2,
    prestige: 1,
    bonusGem: "ruby",
    cost: { ruby: 2, sapphire: 2, emerald: 1 }
  },
  {
    name: "Kakashi Hatake",
    series: "Naruto",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80",
    fallback: "https://cdn.myanimelist.net/images/characters/7/284121.jpg",
    tier: 2,
    prestige: 2,
    bonusGem: "onyx",
    cost: { onyx: 3, emerald: 2 }
  },
  {
    name: "Megumi Fushiguro",
    series: "Jujutsu Kaisen",
    image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=600&auto=format&fit=crop&q=80",
    fallback: "https://cdn.myanimelist.net/images/characters/11/422170.jpg",
    tier: 2,
    prestige: 1,
    bonusGem: "amber",
    cost: { amber: 2, onyx: 2, emerald: 1 }
  },
  {
    name: "Edward Elric",
    series: "Fullmetal Alchemist",
    image: "https://images.unsplash.com/photo-1533158326339-7f3cf2404354?w=600&auto=format&fit=crop&q=80",
    fallback: "https://cdn.myanimelist.net/images/characters/9/72533.jpg",
    tier: 2,
    prestige: 2,
    bonusGem: "amber",
    cost: { amber: 3, ruby: 2 }
  },

  // Tier 1: Recruits & Apprentices
  {
    name: "Zenitsu Agatsuma",
    series: "Demon Slayer",
    image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80",
    fallback: "https://cdn.myanimelist.net/images/characters/6/384524.jpg",
    tier: 1,
    prestige: 0,
    bonusGem: "amber",
    cost: { amber: 1, ruby: 2 }
  },
  {
    name: "Sakura Haruno",
    series: "Naruto",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
    fallback: "https://cdn.myanimelist.net/images/characters/14/76454.jpg",
    tier: 1,
    prestige: 0,
    bonusGem: "emerald",
    cost: { emerald: 2, sapphire: 1 }
  },
  {
    name: "Usopp",
    series: "One Piece",
    image: "https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80",
    fallback: "https://cdn.myanimelist.net/images/characters/11/310309.jpg",
    tier: 1,
    prestige: 1,
    bonusGem: "ruby",
    cost: { ruby: 3 }
  },
  {
    name: "Nezuko Kamado",
    series: "Demon Slayer",
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80",
    fallback: "https://cdn.myanimelist.net/images/characters/4/384525.jpg",
    tier: 1,
    prestige: 0,
    bonusGem: "ruby",
    cost: { ruby: 1, emerald: 1, sapphire: 1 }
  },
  {
    name: "Armin Arlert",
    series: "Attack on Titan",
    image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600&auto=format&fit=crop&q=80",
    fallback: "https://cdn.myanimelist.net/images/characters/7/241415.jpg",
    tier: 1,
    prestige: 0,
    bonusGem: "sapphire",
    cost: { sapphire: 2, amber: 1 }
  },
  {
    name: "Nobara Kugisaki",
    series: "Jujutsu Kaisen",
    image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=600&auto=format&fit=crop&q=80",
    fallback: "https://cdn.myanimelist.net/images/characters/8/422171.jpg",
    tier: 1,
    prestige: 0,
    bonusGem: "onyx",
    cost: { onyx: 2, ruby: 1 }
  },
  {
    name: "Krillin",
    series: "Dragon Ball Z",
    image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80",
    fallback: "https://cdn.myanimelist.net/images/characters/12/306237.jpg",
    tier: 1,
    prestige: 0,
    bonusGem: "amber",
    cost: { amber: 2, onyx: 1 }
  },
  {
    name: "Genos",
    series: "One Punch Man",
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80",
    fallback: "https://cdn.myanimelist.net/images/characters/12/299606.jpg",
    tier: 1,
    prestige: 1,
    bonusGem: "onyx",
    cost: { onyx: 3 }
  }
];

export const NOBLES_LIST = [
  {
    id: 'noble_gojo',
    name: 'Satoru Gojo',
    title: 'Limitless Domain',
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80",
    points: 3,
    requires: { onyx: 3, ruby: 3, sapphire: 3 }
  },
  {
    id: 'noble_luffy',
    name: 'Sun God Nika',
    title: 'Warrior of Liberation',
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80",
    points: 3,
    requires: { ruby: 4, amber: 4 }
  },
  {
    id: 'noble_levi',
    name: 'Captain Levi',
    title: 'Humanity\'s Strongest',
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
    points: 3,
    requires: { emerald: 3, sapphire: 3, amber: 3 }
  }
];
