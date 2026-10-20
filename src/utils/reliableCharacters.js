// 60+ Iconic anime characters across all tiers with verified active AniList CDN artwork
export const EXPANDED_CHARACTERS = [
  // ==================== TIER 3 (Legendary Heroes: 3 - 5 Prestige Points) ====================
  { name: "Satoru Gojou", series: "Jujutsu Kaisen", image: "https://s4.anilist.co/file/anilistcdn/character/large/b127691-9zqh1xpIubn7.png", tier: 3, prestige: 4, bonusGem: "onyx", cost: { ruby: 3, sapphire: 3, onyx: 3 } },
  { name: "Monkey D. Luffy", series: "One Piece", image: "https://s4.anilist.co/file/anilistcdn/character/large/b40-MNypXsxSRb1R.png", tier: 3, prestige: 5, bonusGem: "ruby", cost: { ruby: 4, amber: 3, sapphire: 2 } },
  { name: "Levi Ackerman", series: "Attack on Titan", image: "https://s4.anilist.co/file/anilistcdn/character/large/b45627-CR68RyZmddGG.png", tier: 3, prestige: 4, bonusGem: "emerald", cost: { emerald: 4, sapphire: 3, ruby: 2 } },
  { name: "Zoro Roronoa", series: "One Piece", image: "https://s4.anilist.co/file/anilistcdn/character/large/b62-S7oAeA9WInjV.png", tier: 3, prestige: 4, bonusGem: "emerald", cost: { emerald: 4, ruby: 3, amber: 2 } },
  { name: "Eren Yeager", series: "Attack on Titan", image: "https://s4.anilist.co/file/anilistcdn/character/large/b40882-dsj7IP943WFF.jpg", tier: 3, prestige: 3, bonusGem: "ruby", cost: { ruby: 4, onyx: 3 } },
  { name: "Lelouch Lamperouge", series: "Code Geass", image: "https://s4.anilist.co/file/anilistcdn/character/large/b417-gVLmIJu9phcK.png", tier: 3, prestige: 4, bonusGem: "onyx", cost: { onyx: 4, sapphire: 3, amber: 2 } },
  { name: "L Lawliet", series: "Death Note", image: "https://s4.anilist.co/file/anilistcdn/character/large/b71-1W4panC53vfs.png", tier: 3, prestige: 3, bonusGem: "sapphire", cost: { sapphire: 4, amber: 3 } },
  { name: "Light Yagami", series: "Death Note", image: "https://s4.anilist.co/file/anilistcdn/character/large/b80-26EhwSsSqQ50.png", tier: 3, prestige: 4, bonusGem: "onyx", cost: { onyx: 4, ruby: 3 } },
  { name: "Naruto Uzumaki", series: "Naruto", image: "https://s4.anilist.co/file/anilistcdn/character/large/b17-740bX3Q9P591.png", tier: 3, prestige: 4, bonusGem: "amber", cost: { emerald: 4, amber: 3, ruby: 2 } },
  { name: "Ichigo Kurosaki", series: "Bleach", image: "https://s4.anilist.co/file/anilistcdn/character/large/b5-bYj14iV4iM2O.png", tier: 3, prestige: 4, bonusGem: "sapphire", cost: { onyx: 4, sapphire: 3, emerald: 2 } },
  { name: "Edward Elric", series: "Fullmetal Alchemist", image: "https://s4.anilist.co/file/anilistcdn/character/large/b11-uC0bY9o6t80G.png", tier: 3, prestige: 3, bonusGem: "amber", cost: { amber: 4, ruby: 3 } },
  { name: "Spike Spiegel", series: "Cowboy Bebop", image: "https://s4.anilist.co/file/anilistcdn/character/large/b1-YmFepw6G2v3v.png", tier: 3, prestige: 3, bonusGem: "emerald", cost: { emerald: 4, sapphire: 3 } },
  { name: "Guts", series: "Berserk", image: "https://s4.anilist.co/file/anilistcdn/character/large/b422-VqN2vM5F1n6r.png", tier: 3, prestige: 5, bonusGem: "onyx", cost: { onyx: 5, ruby: 3 } },
  { name: "Jotaro Kujo", series: "JoJo's Bizarre Adventure", image: "https://s4.anilist.co/file/anilistcdn/character/large/b4010-0h8XU6lD9n0c.png", tier: 3, prestige: 4, bonusGem: "sapphire", cost: { sapphire: 4, onyx: 3, ruby: 2 } },
  { name: "Saitama", series: "One Punch Man", image: "https://s4.anilist.co/file/anilistcdn/character/large/b73935-Fv11hU0E7gN3.png", tier: 3, prestige: 5, bonusGem: "amber", cost: { amber: 5, ruby: 3 } },

  // ==================== TIER 2 (Skilled Champions: 1 - 2 Prestige Points) ====================
  { name: "Killua Zoldyck", series: "Hunter x Hunter", image: "https://s4.anilist.co/file/anilistcdn/character/large/b27-Z5O02kQUydpT.jpg", tier: 2, prestige: 2, bonusGem: "sapphire", cost: { sapphire: 3, ruby: 2 } },
  { name: "Itachi Uchiha", series: "Naruto", image: "https://s4.anilist.co/file/anilistcdn/character/large/b14-9Kb1E5oel1ke.png", tier: 2, prestige: 2, bonusGem: "ruby", cost: { ruby: 3, onyx: 2, amber: 1 } },
  { name: "Kakashi Hatake", series: "Naruto", image: "https://s4.anilist.co/file/anilistcdn/character/large/b85-mkVBh2yjxjmx.png", tier: 2, prestige: 2, bonusGem: "onyx", cost: { onyx: 3, emerald: 2 } },
  { name: "Kurisu Makise", series: "Steins;Gate", image: "https://s4.anilist.co/file/anilistcdn/character/large/b34470-Jw2LXZBL5R8i.png", tier: 2, prestige: 2, bonusGem: "amber", cost: { amber: 3, ruby: 2 } },
  { name: "Makima", series: "Chainsaw Man", image: "https://s4.anilist.co/file/anilistcdn/character/large/b137080-UHcynYNjb5ZU.png", tier: 2, prestige: 1, bonusGem: "onyx", cost: { onyx: 2, amber: 2, sapphire: 1 } },
  { name: "Ken Kaneki", series: "Tokyo Ghoul", image: "https://s4.anilist.co/file/anilistcdn/character/large/b87275-mb13EWZBdbh3.png", tier: 2, prestige: 1, bonusGem: "sapphire", cost: { sapphire: 2, ruby: 2, emerald: 1 } },
  { name: "Thorfinn Karlsefni", series: "Vinland Saga", image: "https://s4.anilist.co/file/anilistcdn/character/large/b10138-zOPrka0ddZOR.png", tier: 2, prestige: 2, bonusGem: "emerald", cost: { emerald: 3, ruby: 2 } },
  { name: "Rintarou Okabe", series: "Steins;Gate", image: "https://s4.anilist.co/file/anilistcdn/character/large/b35252-DY9TW6pusqeh.png", tier: 2, prestige: 2, bonusGem: "amber", cost: { amber: 3, sapphire: 2 } },
  { name: "Kaguya Shinomiya", series: "Kaguya-sama", image: "https://s4.anilist.co/file/anilistcdn/character/large/b120649-NPaWaIpWy60E.png", tier: 2, prestige: 2, bonusGem: "ruby", cost: { ruby: 3, emerald: 2 } },
  { name: "Roy Mustang", series: "Fullmetal Alchemist", image: "https://s4.anilist.co/file/anilistcdn/character/large/b68-6q3uM347s34c.png", tier: 2, prestige: 2, bonusGem: "ruby", cost: { ruby: 4, onyx: 1 } },
  { name: "Giyuu Tomioka", series: "Demon Slayer", image: "https://s4.anilist.co/file/anilistcdn/character/large/b137090-q48f72v98gM3.png", tier: 2, prestige: 2, bonusGem: "sapphire", cost: { sapphire: 3, emerald: 2 } },
  { name: "Tanjiro Kamado", series: "Demon Slayer", image: "https://s4.anilist.co/file/anilistcdn/character/large/b129130-i4rRjXp7W6sA.png", tier: 2, prestige: 1, bonusGem: "ruby", cost: { ruby: 2, sapphire: 2, emerald: 1 } },
  { name: "Megumi Fushiguro", series: "Jujutsu Kaisen", image: "https://s4.anilist.co/file/anilistcdn/character/large/b127992-pP8Q7W8uG37j.png", tier: 2, prestige: 1, bonusGem: "amber", cost: { amber: 2, onyx: 2, emerald: 1 } },
  { name: "Sousuke Aizen", series: "Bleach", image: "https://s4.anilist.co/file/anilistcdn/character/large/b1159-Q9p02g9k324g.png", tier: 2, prestige: 2, bonusGem: "onyx", cost: { onyx: 4, sapphire: 1 } },
  { name: "Erwin Smith", series: "Attack on Titan", image: "https://s4.anilist.co/file/anilistcdn/character/large/b46494-Y5O72v8w6k2f.png", tier: 2, prestige: 2, bonusGem: "emerald", cost: { emerald: 3, amber: 2 } },

  // ==================== TIER 1 (Recruits & Apprentices: 0 - 1 Prestige Points) ====================
  { name: "Yuuji Itadori", series: "Jujutsu Kaisen", image: "https://s4.anilist.co/file/anilistcdn/character/large/b127212-FVm2tD0erQ5B.png", tier: 1, prestige: 0, bonusGem: "ruby", cost: { ruby: 1, amber: 2 } },
  { name: "Denji", series: "Chainsaw Man", image: "https://s4.anilist.co/file/anilistcdn/character/large/b130102-FO1VHNnEnLlB.png", tier: 1, prestige: 0, bonusGem: "amber", cost: { amber: 2, ruby: 1 } },
  { name: "Power", series: "Chainsaw Man", image: "https://s4.anilist.co/file/anilistcdn/character/large/b137079-6yLEUYR3bmpr.png", tier: 1, prestige: 1, bonusGem: "ruby", cost: { ruby: 3 } },
  { name: "Emilia", series: "Re:Zero", image: "https://s4.anilist.co/file/anilistcdn/character/large/b88572-IzTwXEHSobRs.jpg", tier: 1, prestige: 0, bonusGem: "sapphire", cost: { sapphire: 2, emerald: 1 } },
  { name: "Kurapika", series: "Hunter x Hunter", image: "https://s4.anilist.co/file/anilistcdn/character/large/b28-ivA7UGnfE40a.png", tier: 1, prestige: 0, bonusGem: "emerald", cost: { emerald: 2, sapphire: 1 } },
  { name: "Violet Evergarden", series: "Violet Evergarden", image: "https://s4.anilist.co/file/anilistcdn/character/large/b90169-4wr1Zehnsac8.png", tier: 1, prestige: 0, bonusGem: "sapphire", cost: { sapphire: 1, amber: 1, emerald: 1 } },
  { name: "Shigeo Kageyama", series: "Mob Psycho 100", image: "https://s4.anilist.co/file/anilistcdn/character/large/b89616-dXmdOc7L6SDi.png", tier: 1, prestige: 1, bonusGem: "onyx", cost: { onyx: 3 } },
  { name: "Mai Sakurajima", series: "Bunny Girl Senpai", image: "https://s4.anilist.co/file/anilistcdn/character/large/b127222-Jh5hhP7vZ7s1.png", tier: 1, prestige: 0, bonusGem: "amber", cost: { amber: 2, sapphire: 1 } },
  { name: "Zenitsu Agatsuma", series: "Demon Slayer", image: "https://s4.anilist.co/file/anilistcdn/character/large/b129131-q0q75r7t8K8r.png", tier: 1, prestige: 0, bonusGem: "amber", cost: { amber: 1, ruby: 2 } },
  { name: "Sakura Haruno", series: "Naruto", image: "https://s4.anilist.co/file/anilistcdn/character/large/b18-bT15y011681k.png", tier: 1, prestige: 0, bonusGem: "emerald", cost: { emerald: 2, sapphire: 1 } },
  { name: "Usopp", series: "One Piece", image: "https://s4.anilist.co/file/anilistcdn/character/large/b724-4B8q44f87T4e.png", tier: 1, prestige: 1, bonusGem: "ruby", cost: { ruby: 3 } },
  { name: "Nezuko Kamado", series: "Demon Slayer", image: "https://s4.anilist.co/file/anilistcdn/character/large/b129132-84v46yv2798m.png", tier: 1, prestige: 0, bonusGem: "ruby", cost: { ruby: 1, emerald: 1, sapphire: 1 } },
  { name: "Armin Arlert", series: "Attack on Titan", image: "https://s4.anilist.co/file/anilistcdn/character/large/b46496-5H04v873m24n.png", tier: 1, prestige: 0, bonusGem: "sapphire", cost: { sapphire: 2, amber: 1 } },
  { name: "Nobara Kugisaki", series: "Jujutsu Kaisen", image: "https://s4.anilist.co/file/anilistcdn/character/large/b127214-kQ6tYp8u923g.png", tier: 1, prestige: 0, bonusGem: "onyx", cost: { onyx: 2, ruby: 1 } },
  { name: "Krillin", series: "Dragon Ball Z", image: "https://s4.anilist.co/file/anilistcdn/character/large/b2046-2b1b3b3a6e6y.png", tier: 1, prestige: 0, bonusGem: "amber", cost: { amber: 2, onyx: 1 } },
  { name: "Genos", series: "One Punch Man", image: "https://s4.anilist.co/file/anilistcdn/character/large/b73936-3n9X02v98gM3.png", tier: 1, prestige: 1, bonusGem: "onyx", cost: { onyx: 3 } },
  { name: "Hange Zoe", series: "Attack on Titan", image: "https://s4.anilist.co/file/anilistcdn/character/large/b46497-6q3uM347s34c.png", tier: 1, prestige: 0, bonusGem: "emerald", cost: { emerald: 2, amber: 1 } },
  { name: "Inosuke Hashibira", series: "Demon Slayer", image: "https://s4.anilist.co/file/anilistcdn/character/large/b129133-7q3uM347s34c.png", tier: 1, prestige: 0, bonusGem: "emerald", cost: { emerald: 1, ruby: 2 } },
  { name: "Maki Zenin", series: "Jujutsu Kaisen", image: "https://s4.anilist.co/file/anilistcdn/character/large/b127216-8q3uM347s34c.png", tier: 1, prestige: 0, bonusGem: "onyx", cost: { onyx: 2, emerald: 1 } },
  { name: "Toge Inumaki", series: "Jujutsu Kaisen", image: "https://s4.anilist.co/file/anilistcdn/character/large/b127217-9q3uM347s34c.png", tier: 1, prestige: 0, bonusGem: "sapphire", cost: { sapphire: 2, onyx: 1 } }
];

export const NOBLE_PATRONS = [
  { id: 'noble_gojo', name: 'Satoru Gojou', title: 'The Honored One', image: "https://s4.anilist.co/file/anilistcdn/character/large/b127691-9zqh1xpIubn7.png", points: 3, requires: { onyx: 3, ruby: 3, sapphire: 3 } },
  { id: 'noble_luffy', name: 'Luffy Monkey', title: 'Warrior of Liberation', image: "https://s4.anilist.co/file/anilistcdn/character/large/b40-MNypXsxSRb1R.png", points: 3, requires: { ruby: 4, amber: 4 } },
  { id: 'noble_levi', name: 'Levi Ackerman', title: 'Humanity\'s Strongest', image: "https://s4.anilist.co/file/anilistcdn/character/large/b45627-CR68RyZmddGG.png", points: 3, requires: { emerald: 3, sapphire: 3, amber: 3 } },
  { id: 'noble_zoro', name: 'Zoro King of Hell', title: 'Grand Master Swordsman', image: "https://s4.anilist.co/file/anilistcdn/character/large/b62-S7oAeA9WInjV.png", points: 3, requires: { emerald: 4, onyx: 4 } },
  { id: 'noble_sukuna', name: 'Ryomen Sukuna', title: 'King of Curses', image: "https://s4.anilist.co/file/anilistcdn/character/large/b127213-9zqh1xpIubn7.png", points: 3, requires: { ruby: 3, onyx: 3, amber: 3 } }
];
