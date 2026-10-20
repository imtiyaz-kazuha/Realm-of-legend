import React, { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import Navbar from './components/Navbar';
import SummonGate from './components/SummonGate';
import Inventory from './components/Inventory';
import BattleArena from './components/BattleArena';
import AuthModal from './components/AuthModal';

function GameContent() {
  const { currentUser } = useGame();
  const [activeTab, setActiveTab] = useState('summon');

  if (!currentUser) {
    return <AuthModal />;
  }

  return (
    <div className="min-h-screen bg-game-dark flex flex-col">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1">
        {activeTab === 'summon' && <SummonGate />}
        {activeTab === 'collection' && <Inventory />}
        {activeTab === 'battle' && <BattleArena />}
      </main>

      <footer className="py-6 border-t border-game-border text-center text-xs text-slate-500">
        Realm of Legends • Logged in as <span className="text-white font-bold">{currentUser.username}</span> • Powered by AniList & React
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
