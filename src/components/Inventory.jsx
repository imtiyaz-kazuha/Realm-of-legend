import React, { useState } from 'react';
import { Users, Filter, ArrowUpDown } from 'lucide-react';
import { useGame } from '../context/GameContext';
import CardView from './CardView';

export default function Inventory() {
  const { inventory, teamIds, toggleTeamMember, upgradeCard } = useGame();
  const [filterRarity, setFilterRarity] = useState('ALL');
  const [sortBy, setSortBy] = useState('rarity');

  const rarities = ['ALL', 'SEC', 'UR', 'SR', 'R', 'UC', 'C'];
  const rarityRank = { SEC: 6, UR: 5, SR: 4, R: 3, UC: 2, C: 1 };

  // Filter
  const filtered = inventory.filter(card => {
    if (filterRarity !== 'ALL' && card.rarity !== filterRarity) return false;
    return true;
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'rarity') {
      return (rarityRank[b.rarity] || 0) - (rarityRank[a.rarity] || 0);
    }
    if (sortBy === 'atk') return (b.atk || 0) - (a.atk || 0);
    if (sortBy === 'hp') return (b.hp || 0) - (a.hp || 0);
    if (sortBy === 'level') return (b.level || 1) - (a.level || 1);
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header & Squad Info */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-game-border">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-3">
            <Users className="w-7 h-7 text-game-accent" />
            Card Collection
          </h1>
          <p className="text-slate-400 text-xs md:text-sm mt-1">
            Total Cards: <span className="text-white font-bold">{inventory.length}</span> | 
            Active Squad: <span className="text-game-gold font-bold">{teamIds.length}/3</span> (Click a card to toggle it into your squad)
          </p>
        </div>

        {/* Filters and Sorters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Rarity filter pills */}
          <div className="flex items-center bg-game-card border border-game-border rounded-xl p-1">
            {rarities.map(r => (
              <button
                key={r}
                onClick={() => setFilterRarity(r)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  filterRarity === r 
                    ? 'bg-game-accent text-white shadow' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 bg-game-card border border-game-border rounded-xl px-3 py-1.5 text-xs text-slate-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
            >
              <option value="rarity" className="bg-slate-900">Highest Rarity</option>
              <option value="atk" className="bg-slate-900">Highest ATK</option>
              <option value="hp" className="bg-slate-900">Highest HP</option>
              <option value="level" className="bg-slate-900">Highest Level</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      {sorted.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <p className="text-lg">No cards found matching this filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
          {sorted.map(card => {
            const isSquadMember = teamIds.includes(card.instanceId);
            return (
              <div key={card.instanceId} className="relative">
                <CardView 
                  card={card}
                  isSelected={isSquadMember}
                  onSelect={() => toggleTeamMember(card.instanceId)}
                  onUpgrade={upgradeCard}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
