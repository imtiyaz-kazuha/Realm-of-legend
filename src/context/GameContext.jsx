import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_CARDS } from '../api/defaultCards';
import { fetchLiveAniListCards } from '../api/anilist';

const GameContext = createContext();

export function GameProvider({ children }) {
  // Account state: current logged in user
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('rol_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // User database stored in localStorage
  const [userDb, setUserDb] = useState(() => {
    try {
      const saved = localStorage.getItem('rol_user_db');
      if (saved) return JSON.parse(saved);
    } catch {}

    // Initial admin account setup
    return {
      'Imtinos': {
        username: 'Imtinos',
        password: 'Imtiyaz#$ecure',
        role: 'ADMIN',
        gold: 999999,
        gems: 50000,
        floor: 1,
        inventory: [],
        team: []
      }
    };
  });

  const [cardPool, setCardPool] = useState(DEFAULT_CARDS);
  const [loadingPool, setLoadingPool] = useState(true);

  // Fetch AniList live cards
  useEffect(() => {
    async function loadCards() {
      const liveCards = await fetchLiveAniListCards(1, 40);
      setCardPool(liveCards);
      setLoadingPool(false);
    }
    loadCards();
  }, []);

  // Sync userDb and currentUser to localStorage
  useEffect(() => {
    localStorage.setItem('rol_user_db', JSON.stringify(userDb));
  }, [userDb]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('rol_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('rol_current_user');
    }
  }, [currentUser]);

  // Give default starter card if inventory empty
  useEffect(() => {
    if (currentUser && cardPool.length > 0) {
      const userData = userDb[currentUser.username];
      if (userData && userData.inventory.length === 0) {
        const starterCard = {
          ...cardPool[0],
          instanceId: `starter_${Date.now()}`,
          level: 1,
          exp: 0,
        };
        updateUserData(currentUser.username, {
          inventory: [starterCard],
          team: [starterCard.instanceId]
        });
      }
    }
  }, [currentUser, cardPool]);

  // Helper to update specific user's state
  const updateUserData = (username, updates) => {
    setUserDb(prev => {
      const existing = prev[username] || {};
      const updated = { ...existing, ...updates };
      if (currentUser?.username === username) {
        setCurrentUser(curr => ({ ...curr, ...updates }));
      }
      return { ...prev, [username]: updated };
    });
  };

  // Auth Functions
  const login = (username, password) => {
    const user = userDb[username];
    if (!user) {
      return { success: false, message: 'Account not found. Please register or check username.' };
    }
    if (user.password !== password) {
      return { success: false, message: 'Incorrect password.' };
    }
    setCurrentUser(user);
    return { success: true };
  };

  const register = (username, password) => {
    if (!username.trim() || !password.trim()) {
      return { success: false, message: 'Username and password cannot be empty.' };
    }
    if (userDb[username]) {
      return { success: false, message: 'Username is already taken.' };
    }

    const starterCard = cardPool[0] ? [{
      ...cardPool[0],
      instanceId: `starter_${Date.now()}`,
      level: 1,
      exp: 0,
    }] : [];

    const newUser = {
      username,
      password,
      role: 'PLAYER',
      gold: 10000,
      gems: 1500,
      floor: 1,
      inventory: starterCard,
      team: starterCard[0] ? [starterCard[0].instanceId] : []
    };

    setUserDb(prev => ({ ...prev, [username]: newUser }));
    setCurrentUser(newUser);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // Active user data shortcuts
  const activeData = currentUser ? (userDb[currentUser.username] || currentUser) : null;
  const gold = activeData?.gold || 0;
  const gems = activeData?.gems || 0;
  const highestFloor = activeData?.floor || 1;
  const inventory = activeData?.inventory || [];
  const teamIds = activeData?.team || [];
  const isAdmin = activeData?.role === 'ADMIN';

  // Game actions for active user
  const setGold = (val) => {
    if (!currentUser) return;
    const nextVal = typeof val === 'function' ? val(gold) : val;
    updateUserData(currentUser.username, { gold: nextVal });
  };

  const setGems = (val) => {
    if (!currentUser) return;
    const nextVal = typeof val === 'function' ? val(gems) : val;
    updateUserData(currentUser.username, { gems: nextVal });
  };

  const setHighestFloor = (val) => {
    if (!currentUser) return;
    const nextVal = typeof val === 'function' ? val(highestFloor) : val;
    updateUserData(currentUser.username, { floor: nextVal });
  };

  const addCards = (newCards) => {
    if (!currentUser) return;
    updateUserData(currentUser.username, {
      inventory: [...newCards, ...inventory]
    });
  };

  const toggleTeamMember = (instanceId) => {
    if (!currentUser) return;
    let nextTeam = [...teamIds];
    if (nextTeam.includes(instanceId)) {
      nextTeam = nextTeam.filter(id => id !== instanceId);
    } else {
      if (nextTeam.length >= 3) {
        alert('Your squad already has the maximum of 3 cards. Remove one first!');
        return;
      }
      nextTeam.push(instanceId);
    }
    updateUserData(currentUser.username, { team: nextTeam });
  };

  const upgradeCard = (instanceId) => {
    if (!currentUser) return false;
    const cost = 500;
    if (gold < cost) {
      alert('Not enough gold to upgrade this card (Cost: 500 Gold)');
      return false;
    }
    const nextInventory = inventory.map(c => {
      if (c.instanceId === instanceId) {
        return {
          ...c,
          level: (c.level || 1) + 1,
          hp: Math.round(c.hp * 1.08),
          atk: Math.round(c.atk * 1.08),
          def: Math.round(c.def * 1.08),
        };
      }
      return c;
    });
    updateUserData(currentUser.username, {
      gold: gold - cost,
      inventory: nextInventory
    });
    return true;
  };

  const claimDaily = () => {
    if (!currentUser) return;
    updateUserData(currentUser.username, {
      gold: gold + 2500,
      gems: gems + 300
    });
    alert('Daily Claimed! +2,500 Gold and +300 Gems added.');
  };

  // ADMIN Cheat: Add custom resources
  const adminSetResources = (addGold, addGems, setFloor) => {
    if (!isAdmin) return;
    updateUserData(currentUser.username, {
      gold: Math.max(0, gold + (addGold || 0)),
      gems: Math.max(0, gems + (addGems || 0)),
      floor: setFloor ? parseInt(setFloor) : highestFloor,
    });
    alert('Admin Resources Applied!');
  };

  // ADMIN Cheat: Spawn any card
  const adminSpawnCard = (rarity) => {
    if (!isAdmin) return;
    const matches = cardPool.filter(c => c.rarity === rarity);
    const chosen = matches.length > 0 ? matches[0] : cardPool[0];
    const newCard = {
      ...chosen,
      instanceId: `admin_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      level: 1,
      exp: 0,
    };
    addCards([newCard]);
    alert(`Admin spawned [${rarity}] ${newCard.name}!`);
  };

  return (
    <GameContext.Provider value={{
      currentUser,
      login, register, logout,
      isAdmin,
      gold, setGold,
      gems, setGems,
      highestFloor, setHighestFloor,
      inventory, addCards,
      teamIds, toggleTeamMember,
      upgradeCard,
      cardPool, loadingPool,
      claimDaily,
      adminSetResources,
      adminSpawnCard
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}
