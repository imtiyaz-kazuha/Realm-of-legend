import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_CARDS } from '../api/defaultCards';
import { fetchLiveAniListCards } from '../api/anilist';

const GameContext = createContext();

export function GameProvider({ children }) {
  // Load local state from localStorage or set defaults
  const [gold, setGold] = useState(() => {
    return parseInt(localStorage.getItem('anigame_gold')) || 10000;
  });
  const [gems, setGems] = useState(() => {
    return parseInt(localStorage.getItem('anigame_gems')) || 1500;
  });
  const [highestFloor, setHighestFloor] = useState(() => {
    return parseInt(localStorage.getItem('anigame_floor')) || 1;
  });
  const [inventory, setInventory] = useState(() => {
    try {
      const saved = localStorage.getItem('anigame_inventory');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [teamIds, setTeamIds] = useState(() => {
    try {
      const saved = localStorage.getItem('anigame_team');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [cardPool, setCardPool] = useState(DEFAULT_CARDS);
  const [loadingPool, setLoadingPool] = useState(true);

  // Fetch updated cards from AniList on mount
  useEffect(() => {
    async function loadCards() {
      const liveCards = await fetchLiveAniListCards(1, 40);
      setCardPool(liveCards);
      setLoadingPool(false);
    }
    loadCards();
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('anigame_gold', gold);
    localStorage.setItem('anigame_gems', gems);
    localStorage.setItem('anigame_floor', highestFloor);
    localStorage.setItem('anigame_inventory', JSON.stringify(inventory));
    localStorage.setItem('anigame_team', JSON.stringify(teamIds));
  }, [gold, gems, highestFloor, inventory, teamIds]);

  // Give a starter card if brand new player
  useEffect(() => {
    if (inventory.length === 0 && cardPool.length > 0) {
      const starterCard = {
        ...cardPool[0],
        instanceId: `starter_${Date.now()}`,
        level: 1,
        exp: 0,
      };
      setInventory([starterCard]);
      setTeamIds([starterCard.instanceId]);
    }
  }, [cardPool]);

  // Add cards to inventory
  const addCards = (newCards) => {
    setInventory(prev => [...newCards, ...prev]);
  };

  // Toggle card in battle team (Max 3 members)
  const toggleTeamMember = (instanceId) => {
    setTeamIds(prev => {
      if (prev.includes(instanceId)) {
        return prev.filter(id => id !== instanceId);
      }
      if (prev.length >= 3) {
        alert('Your squad already has the maximum of 3 cards. Remove one first!');
        return prev;
      }
      return [...prev, instanceId];
    });
  };

  // Level up card
  const upgradeCard = (instanceId) => {
    const cost = 500;
    if (gold < cost) {
      alert('Not enough gold to upgrade this card (Cost: 500 Gold)');
      return false;
    }

    setGold(g => g - cost);
    setInventory(prev => prev.map(c => {
      if (c.instanceId === instanceId) {
        const nextLevel = c.level + 1;
        return {
          ...c,
          level: nextLevel,
          hp: Math.round(c.hp * 1.08),
          atk: Math.round(c.atk * 1.08),
          def: Math.round(c.def * 1.08),
        };
      }
      return c;
    }));
    return true;
  };

  // Claim daily rewards
  const claimDaily = () => {
    setGold(g => g + 2500);
    setGems(gem => gem + 300);
    alert('Daily Claimed! +2,500 Gold and +300 Gems added to your balance.');
  };

  // Reset entire game
  const resetSave = () => {
    if (confirm('Are you sure you want to reset all game data?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <GameContext.Provider value={{
      gold, setGold,
      gems, setGems,
      highestFloor, setHighestFloor,
      inventory, addCards,
      teamIds, toggleTeamMember,
      upgradeCard,
      cardPool, loadingPool,
      claimDaily, resetSave
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}
