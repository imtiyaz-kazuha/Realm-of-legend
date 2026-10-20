import React, { useState } from 'react';
import { Swords, Trophy, ShieldAlert, Award, Play } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useGame } from '../context/GameContext';
import CardView from './CardView';

export default function BattleArena() {
  const { inventory, teamIds, highestFloor, setHighestFloor, setGold, setGems } = useGame();
  const [battleLogs, setBattleLogs] = useState([]);
  const [inCombat, setInCombat] = useState(false);
  const [battleResult, setBattleResult] = useState(null); // 'VICTORY' | 'DEFEAT'

  // Get active team cards
  const squad = inventory.filter(c => teamIds.includes(c.instanceId));

  // Generate boss / enemy team for the floor
  const enemyTeam = [
    {
      id: 9991,
      name: `Shadow Fiend (Floor ${highestFloor})`,
      series: 'Abyssal Domain',
      element: 'Dark',
      rarity: highestFloor > 10 ? 'UR' : 'SR',
      image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop&q=60',
      hp: 3000 + highestFloor * 1200,
      atk: 750 + highestFloor * 280,
      def: 500 + highestFloor * 190,
      spd: 100 + highestFloor * 2,
    }
  ];

  const startBattle = () => {
    if (squad.length === 0) {
      alert('You have no cards selected for your squad! Go to Collection and pick up to 3 cards.');
      return;
    }

    setInCombat(true);
    setBattleResult(null);
    setBattleLogs([]);

    const logs = [];
    logs.push(`⚔️ Floor ${highestFloor} Challenge Commenced!`);

    // Simple turn simulation
    let playerTotalHp = squad.reduce((sum, c) => sum + (c.hp || 1000), 0);
    let playerTotalAtk = squad.reduce((sum, c) => sum + (c.atk || 300), 0);
    let enemyHp = enemyTeam[0].hp;
    let enemyAtk = enemyTeam[0].atk;

    let round = 1;
    const interval = setInterval(() => {
      if (round > 6 || playerTotalHp <= 0 || enemyHp <= 0) {
        clearInterval(interval);
        setInCombat(false);

        if (enemyHp <= 0 || playerTotalHp > 0) {
          // Victory
          setBattleResult('VICTORY');
          const goldReward = 800 + highestFloor * 200;
          const gemReward = 50 + highestFloor * 10;
          setGold(g => g + goldReward);
          setGems(gem => gem + gemReward);
          setHighestFloor(f => f + 1);

          confetti({ particleCount: 100, spread: 60 });
          logs.push(`🎉 VICTORY! Cleared Floor ${highestFloor}! Rewarded +${goldReward} Gold & +${gemReward} Gems.`);
        } else {
          // Defeat
          setBattleResult('DEFEAT');
          logs.push(`💀 DEFEAT! Your squad fell to Floor ${highestFloor}. Upgrade your cards and try again!`);
        }
        setBattleLogs([...logs]);
        return;
      }

      // Player attacks enemy
      const pDmg = Math.round(playerTotalAtk * (0.85 + Math.random() * 0.3));
      enemyHp -= pDmg;
      logs.push(`Round ${round}: Your squad attacked for 💥 ${pDmg.toLocaleString()} DMG! Enemy HP: ${Math.max(0, enemyHp).toLocaleString()}`);

      if (enemyHp > 0) {
        // Enemy attacks player
        const eDmg = Math.round(enemyAtk * (0.85 + Math.random() * 0.3));
        playerTotalHp -= eDmg;
        logs.push(`Round ${round}: Enemy struck back for 🩸 ${eDmg.toLocaleString()} DMG! Squad HP: ${Math.max(0, playerTotalHp).toLocaleString()}`);
      }

      round++;
      setBattleLogs([...logs]);
    }, 800);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Floor Header */}
      <div className="bg-game-card border border-game-border rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-game-gold font-bold text-xs uppercase tracking-wider">
            <Trophy className="w-4 h-4" />
            Tower Campaign
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">
            Floor {highestFloor}: The Abyssal Gate
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Defeat the guardian to unlock the next floor and earn Gold & Gems.
          </p>
        </div>

        <button
          disabled={inCombat || squad.length === 0}
          onClick={startBattle}
          className="px-8 py-3.5 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-black rounded-xl flex items-center gap-2 shadow-lg shadow-rose-900/40 active:scale-95 disabled:opacity-50 transition-all text-base cursor-pointer"
        >
          <Play className="w-5 h-5 fill-white" />
          {inCombat ? 'Battle in Progress...' : 'Start Battle'}
        </button>
      </div>

      {/* Matchup Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Your Squad */}
        <div className="bg-game-dark/80 border border-game-border rounded-2xl p-5 shadow-lg">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
            <Swords className="w-5 h-5 text-indigo-400" />
            Your Battle Squad ({squad.length}/3)
          </h2>

          {squad.length === 0 ? (
            <div className="p-8 text-center text-slate-400 border-2 border-dashed border-slate-800 rounded-xl">
              <p>No cards equipped in squad.</p>
              <p className="text-xs text-slate-500 mt-1">Visit your Collection tab and click up to 3 cards to equip them.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {squad.map(card => (
                <CardView key={card.instanceId} card={card} isCompact={true} showActions={false} />
              ))}
            </div>
          )}
        </div>

        {/* Floor Boss */}
        <div className="bg-game-dark/80 border border-game-border rounded-2xl p-5 shadow-lg">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
            <ShieldAlert className="w-5 h-5 text-rose-500" />
            Floor Guardian
          </h2>
          <div className="max-w-xs mx-auto">
            <CardView card={enemyTeam[0]} isCompact={true} showActions={false} />
          </div>
        </div>
      </div>

      {/* Battle Log Box */}
      {battleLogs.length > 0 && (
        <div className="mt-8 bg-slate-950 border border-slate-800 rounded-2xl p-6 font-mono text-sm shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <span className="text-slate-400 font-bold uppercase text-xs flex items-center gap-2">
              <Award className="w-4 h-4 text-game-gold" />
              Combat Telemetry Log
            </span>
            {battleResult && (
              <span className={`text-xs font-black px-2.5 py-1 rounded-md ${
                battleResult === 'VICTORY' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
              }`}>
                {battleResult}
              </span>
            )}
          </div>
          <div className="space-y-2 max-h-56 overflow-y-auto">
            {battleLogs.map((log, i) => (
              <p key={i} className="text-slate-300 leading-relaxed">
                {log}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
