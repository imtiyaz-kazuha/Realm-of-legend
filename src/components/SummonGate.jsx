import React, { useState } from 'react';
import { Sparkles, Flame, RefreshCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useGame } from '../context/GameContext';
import { pullRandomCard } from '../utils/cardRules';
import CardView from './CardView';

export default function SummonGate() {
  const { gems, setGems, addCards, cardPool, loadingPool } = useGame();
  const [pulledCards, setPulledCards] = useState([]);
  const [isSummoning, setIsSummoning] = useState(false);

  const COST_SINGLE = 160;
  const COST_MULTI = 1500; // 10-pull discount

  const triggerSummon = (count, cost) => {
    if (gems < cost) {
      alert(`Not enough Gems! You need ${cost} Gems.`);
      return;
    }

    setGems(prev => prev - cost);
    setIsSummoning(true);
    setPulledCards([]);

    // Dramatic summon timing
    setTimeout(() => {
      const results = [];
      let hasLegendary = false;

      for (let i = 0; i < count; i++) {
        const card = pullRandomCard(cardPool);
        if (card) {
          results.push(card);
          if (card.rarity === 'UR' || card.rarity === 'SEC') {
            hasLegendary = true;
          }
        }
      }

      addCards(results);
      setPulledCards(results);
      setIsSummoning(false);

      // Trigger party confetti if rare card pulled
      if (hasLegendary) {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }, 1200);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Banner Card */}
      <div className="relative rounded-2xl overflow-hidden border border-game-border bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 p-6 md:p-10 shadow-2xl mb-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-game-accent/20 border border-game-accent/40 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Standard Anime Gate
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow">
            Realm of Legends
          </h1>
          <p className="mt-3 text-slate-300 text-sm md:text-base leading-relaxed">
            Summon iconic anime heroes and villains from across the multiverse into the Realm of Legends! 
            Featuring live artwork straight from the AniList universe.
          </p>

          {/* Summon Buttons */}
          <div className="flex flex-wrap items-center gap-4 mt-8">
            <button
              disabled={isSummoning || loadingPool}
              onClick={() => triggerSummon(1, COST_SINGLE)}
              className="px-6 py-3.5 rounded-xl font-bold bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 shadow-lg"
            >
              <RefreshCcw className={`w-4 h-4 ${isSummoning ? 'animate-spin' : ''}`} />
              Summon x1
              <span className="text-game-gem text-xs bg-game-dark px-2 py-0.5 rounded border border-cyan-800">
                160 💎
              </span>
            </button>

            <button
              disabled={isSummoning || loadingPool}
              onClick={() => triggerSummon(10, COST_MULTI)}
              className="px-8 py-3.5 rounded-xl font-black bg-gradient-to-r from-amber-500 to-game-gold hover:from-amber-400 hover:to-yellow-400 text-slate-950 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 shadow-xl shadow-amber-500/20"
            >
              <Flame className="w-5 h-5 fill-slate-950" />
              Summon x10
              <span className="text-slate-950 text-xs bg-amber-400/80 px-2 py-0.5 rounded font-black">
                1,500 💎
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Summoning Animation Overlay */}
      {isSummoning && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center animate-fade-in">
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-4 border-game-accent border-t-transparent animate-spin" />
            <Sparkles className="w-10 h-10 text-game-gold absolute inset-0 m-auto animate-pulse" />
          </div>
          <h2 className="text-2xl font-black text-white mt-6 tracking-wider animate-pulse">
            COMMUNING WITH THE ANIME MULTIVERSE...
          </h2>
          <p className="text-slate-400 text-sm mt-2">Opening dimensional gate</p>
        </div>
      )}

      {/* Pulled Results Display */}
      {pulledCards.length > 0 && !isSummoning && (
        <div className="mt-8 p-6 rounded-2xl bg-game-card border border-game-border shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-game-gold" />
              Summon Results ({pulledCards.length})
            </h2>
            <button
              onClick={() => setPulledCards([])}
              className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800"
            >
              Close Results
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {pulledCards.map((card) => (
              <CardView key={card.instanceId} card={card} showActions={false} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
