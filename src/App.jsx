import React, { useState } from 'react';
import { GameProvider } from './context/GameContext';
import Navbar from './components/Navbar';
import SummonGate from './components/SummonGate';
import Inventory from './components/Inventory';
import BattleArena from './components/BattleArena';

function GameContent() {
  const [activeTab, setActiveTab] = useState('summon');

  return (
    <div className="min-h-screen bg-game-dark flex flex-col">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1">
        {activeTab === 'summon' && <SummonGate />}
        {activeTab === 'collection' && <Inventory />}
        {activeTab === 'battle' && <BattleArena />}
      </main>

      <footer className="py-6 border-t border-game-border text-center text-xs text-slate-500">
        Realm of Legends • Anime Card Battler & Gacha • Powered by AniList & React
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}
