import React, { useState } from 'react';
import { Sparkles, Users, Swords, Gift, Coins, Gem, LogOut, ShieldAlert } from 'lucide-react';
import { useGame } from '../context/GameContext';
import AdminConsole from './AdminConsole';

export default function Navbar({ activeTab, setActiveTab }) {
  const { gold, gems, highestFloor, claimDaily, currentUser, logout, isAdmin } = useGame();
  const [showAdminConsole, setShowAdminConsole] = useState(false);

  const navItems = [
    { id: 'summon', label: 'Summon Gate', icon: Sparkles },
    { id: 'collection', label: 'Collection', icon: Users },
    { id: 'battle', label: 'Battle Tower', icon: Swords },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-game-dark/90 backdrop-blur-md border-b border-game-border">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-amber-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 font-black text-white text-base">
              RL
            </div>
            <div>
              <div className="font-black text-white tracking-wider text-base">
                REALM OF LEGENDS
              </div>
              <div className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest -mt-1 flex items-center gap-1.5">
                <span>Floor {highestFloor}</span>
                {isAdmin && (
                  <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 px-1 rounded text-[9px] font-black">
                    ADMIN
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-game-card border border-game-border rounded-xl p-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-game-accent text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Currencies & Admin Tools */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Gold */}
            <div className="flex items-center gap-1.5 bg-game-card border border-game-border px-2.5 py-1 rounded-xl text-xs font-bold text-game-gold shadow-sm">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span>{gold.toLocaleString()}</span>
            </div>

            {/* Gems */}
            <div className="flex items-center gap-1.5 bg-game-card border border-game-border px-2.5 py-1 rounded-xl text-xs font-bold text-game-gem shadow-sm">
              <Gem className="w-3.5 h-3.5 text-cyan-400" />
              <span>{gems.toLocaleString()}</span>
            </div>

            {/* Daily Gift Button */}
            <button
              onClick={claimDaily}
              title="Claim Daily Free Gold & Gems"
              className="p-1.5 bg-gradient-to-r from-amber-500 to-game-gold text-slate-950 font-black rounded-xl hover:scale-105 active:scale-95 transition-all shadow-md"
            >
              <Gift className="w-4 h-4" />
            </button>

            {/* Admin Console Toggle (Only for Admin) */}
            {isAdmin && (
              <button
                onClick={() => setShowAdminConsole(true)}
                title="Admin Control Panel"
                className="p-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl hover:scale-105 active:scale-95 transition-all shadow-md flex items-center gap-1 text-xs px-2"
              >
                <ShieldAlert className="w-4 h-4" />
                <span className="hidden md:inline font-black">ADMIN</span>
              </button>
            )}

            {/* Logout Button */}
            <button
              onClick={logout}
              title={`Sign out (${currentUser?.username})`}
              className="p-1.5 bg-slate-800 hover:bg-rose-950 hover:text-rose-400 text-slate-400 rounded-xl transition-all"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Admin modal */}
      {showAdminConsole && (
        <AdminConsole onClose={() => setShowAdminConsole(false)} />
      )}
    </>
  );
}
