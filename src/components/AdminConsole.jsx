import React, { useState } from 'react';
import { ShieldCheck, PlusCircle, Coins, Gem, Trophy, Sparkles, X } from 'lucide-react';
import { useGame } from '../context/GameContext';

export default function AdminConsole({ onClose }) {
  const { adminSetResources, adminSpawnCard, gold, gems, highestFloor } = useGame();
  const [goldToAdd, setGoldToAdd] = useState(100000);
  const [gemsToAdd, setGemsToAdd] = useState(10000);
  const [targetFloor, setTargetFloor] = useState(highestFloor);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-game-card border-2 border-amber-500/80 rounded-2xl p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-amber-400 font-black text-sm uppercase tracking-wider mb-2">
          <ShieldCheck className="w-5 h-5" />
          Administrator Command Center
        </div>
        <h2 className="text-2xl font-black text-white">
          Manage Realm Resources
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          Exclusive admin privileges for player <span className="text-game-gold font-bold">Imtinos</span>.
        </p>

        {/* Currency Grant Section */}
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Add Gold</label>
              <input
                type="number"
                value={goldToAdd}
                onChange={(e) => setGoldToAdd(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-game-dark border border-slate-700 rounded-xl text-white text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Add Gems</label>
              <input
                type="number"
                value={gemsToAdd}
                onChange={(e) => setGemsToAdd(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-game-dark border border-slate-700 rounded-xl text-white text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Set Battle Tower Floor</label>
            <input
              type="number"
              value={targetFloor}
              onChange={(e) => setTargetFloor(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 bg-game-dark border border-slate-700 rounded-xl text-white text-sm"
            />
          </div>

          <button
            onClick={() => adminSetResources(goldToAdd, gemsToAdd, targetFloor)}
            className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-game-gold hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            Apply Currencies & Floor Level
          </button>
        </div>

        {/* Card Spawner Section */}
        <div className="pt-4 border-t border-slate-800">
          <div className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Instant Card Spawner (Direct to Inventory)
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => adminSpawnCard('SEC')}
              className="py-2 px-2 bg-gradient-to-r from-rose-600 to-indigo-600 text-white font-bold text-xs rounded-xl shadow hover:scale-105 active:scale-95"
            >
              Spawn Secret (SEC)
            </button>
            <button
              onClick={() => adminSpawnCard('UR')}
              className="py-2 px-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold text-xs rounded-xl shadow hover:scale-105 active:scale-95"
            >
              Spawn Ultra (UR)
            </button>
            <button
              onClick={() => adminSpawnCard('SR')}
              className="py-2 px-2 bg-purple-900 border border-purple-600 text-purple-200 font-bold text-xs rounded-xl shadow hover:scale-105 active:scale-95"
            >
              Spawn Super (SR)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
