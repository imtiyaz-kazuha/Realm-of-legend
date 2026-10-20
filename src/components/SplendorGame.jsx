import React, { useState, useEffect } from 'react';
import { GEM_TYPES, NOBLE_PATRONS, getSplendorDeck } from '../utils/splendorData';
import SplendorCard from './SplendorCard';
import PlayerBoard from './PlayerBoard';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, Crown, CircleDot, Info, ArrowLeft, Share2 } from 'lucide-react';

export default function SplendorGame({ roomName, playerOneName, onExitToLobby }) {
  const [deck, setDeck] = useState([]);
  const [market, setMarket] = useState({ 1: [], 2: [], 3: [] });
  const [gemBank, setGemBank] = useState({ ruby: 7, sapphire: 7, emerald: 7, amber: 7, onyx: 7, gold: 5 });
  const [nobles, setNobles] = useState([]);
  const [selectedTokens, setSelectedTokens] = useState([]);
  const [winner, setWinner] = useState(null);
  const [log, setLog] = useState([`Match started! First player to 15 Prestige points wins.`]);

  // Players
  const [players, setPlayers] = useState([
    {
      id: 1,
      name: playerOneName || 'Player 1',
      score: 0,
      tokens: { ruby: 0, sapphire: 0, emerald: 0, amber: 0, onyx: 0, gold: 0 },
      bonuses: { ruby: 0, sapphire: 0, emerald: 0, amber: 0, onyx: 0 },
      purchased: [],
      reserved: [],
    },
    {
      id: 2,
      name: roomName ? 'Player 2 (Friend)' : 'Player 2',
      score: 0,
      tokens: { ruby: 0, sapphire: 0, emerald: 0, amber: 0, onyx: 0, gold: 0 },
      bonuses: { ruby: 0, sapphire: 0, emerald: 0, amber: 0, onyx: 0 },
      purchased: [],
      reserved: [],
    }
  ]);

  const [activePlayerIdx, setActivePlayerIdx] = useState(0);

  // Initialize board with reliable character deck
  useEffect(() => {
    const allCards = getSplendorDeck();

    const tier1 = allCards.filter(c => c.tier === 1);
    const tier2 = allCards.filter(c => c.tier === 2);
    const tier3 = allCards.filter(c => c.tier === 3);

    // Initial 4 visible cards for each tier
    setMarket({
      3: tier3.slice(0, 4),
      2: tier2.slice(0, 4),
      1: tier1.slice(0, 4),
    });

    // The remaining cards form the deck
    const remainingDeck = [
      ...tier3.slice(4),
      ...tier2.slice(4),
      ...tier1.slice(4)
    ];
    setDeck(remainingDeck);
    setNobles(NOBLE_PATRONS);
  }, []);

  const activePlayer = players[activePlayerIdx];

  const checkCanAfford = (player, card) => {
    let wildcardsNeeded = 0;
    for (const [gemId, costAmount] of Object.entries(card.cost)) {
      const bonus = player.bonuses[gemId] || 0;
      const token = player.tokens[gemId] || 0;
      const effectiveCost = Math.max(0, costAmount - bonus);
      if (token < effectiveCost) {
        wildcardsNeeded += (effectiveCost - token);
      }
    }
    return (player.tokens.gold || 0) >= wildcardsNeeded;
  };

  const toggleSelectGem = (gemId) => {
    if (gemId === 'gold') {
      alert('Gold gems cannot be taken directly. Reserve a card to claim a Gold wildcard!');
      return;
    }

    if (gemBank[gemId] <= 0) {
      alert('No more gems of this type left in the bank.');
      return;
    }

    let next = [...selectedTokens];

    if (next.length === 1 && next[0] === gemId) {
      if (gemBank[gemId] < 4) {
        alert('You can only take 2 of the same color if there are at least 4 in the bank.');
        return;
      }
      next.push(gemId);
    } else if (next.includes(gemId)) {
      next = next.filter(g => g !== gemId);
    } else {
      if (next.length >= 3) {
        alert('You can take at most 3 different gems per turn.');
        return;
      }
      if (next.length === 2 && next[0] === next[1]) {
        alert('You already selected 2 identical gems.');
        return;
      }
      next.push(gemId);
    }

    setSelectedTokens(next);
  };

  const confirmGemSelection = () => {
    if (selectedTokens.length === 0) return;

    setGemBank(prev => {
      const updated = { ...prev };
      selectedTokens.forEach(g => { updated[g] -= 1; });
      return updated;
    });

    setPlayers(prev => prev.map((p, idx) => {
      if (idx !== activePlayerIdx) return p;
      const updatedTokens = { ...p.tokens };
      selectedTokens.forEach(g => {
        updatedTokens[g] = (updatedTokens[g] || 0) + 1;
      });
      return { ...p, tokens: updatedTokens };
    }));

    addLog(`${activePlayer.name} took ${selectedTokens.length} gems (${selectedTokens.join(', ')}).`);
    setSelectedTokens([]);
    endTurn();
  };

  const buyCard = (card, fromReserved = false) => {
    if (!checkCanAfford(activePlayer, card)) {
      alert('You cannot afford this card yet!');
      return;
    }

    let remainingTokens = { ...activePlayer.tokens };
    let returnedToBank = { ...gemBank };

    for (const [gemId, costAmount] of Object.entries(card.cost)) {
      const bonus = activePlayer.bonuses[gemId] || 0;
      let needed = Math.max(0, costAmount - bonus);

      if (needed > 0) {
        const canPay = Math.min(remainingTokens[gemId] || 0, needed);
        remainingTokens[gemId] -= canPay;
        returnedToBank[gemId] += canPay;
        needed -= canPay;

        if (needed > 0) {
          remainingTokens.gold -= needed;
          returnedToBank.gold += needed;
        }
      }
    }

    setGemBank(returnedToBank);

    const nextBonuses = { ...activePlayer.bonuses };
    nextBonuses[card.bonusGem] = (nextBonuses[card.bonusGem] || 0) + 1;

    let nextScore = activePlayer.score + (card.prestige || 0);

    // Check Noble Visits
    let remainingNobles = [...nobles];
    remainingNobles = remainingNobles.filter(n => {
      let meetsReq = true;
      for (const [reqGem, reqCount] of Object.entries(n.requires)) {
        if ((nextBonuses[reqGem] || 0) < reqCount) {
          meetsReq = false;
          break;
        }
      }
      if (meetsReq) {
        nextScore += n.points;
        addLog(`👑 ${activePlayer.name} was visited by Noble patron ${n.name}! (+${n.points} pts)`);
        return false;
      }
      return true;
    });

    setNobles(remainingNobles);

    setPlayers(prev => prev.map((p, idx) => {
      if (idx !== activePlayerIdx) return p;
      return {
        ...p,
        score: nextScore,
        tokens: remainingTokens,
        bonuses: nextBonuses,
        purchased: [...p.purchased, card],
        reserved: fromReserved ? p.reserved.filter(c => c.id !== card.id) : p.reserved
      };
    }));

    if (!fromReserved) {
      replaceMarketCard(card);
    }

    addLog(`✨ ${activePlayer.name} recruited ${card.name} (+${card.prestige} prestige)!`);

    if (nextScore >= 15) {
      setWinner(activePlayer.name);
      confetti({ particleCount: 150, spread: 80 });
      addLog(`🏆 ${activePlayer.name} HAS REACHED 15 PRESTIGE AND WON THE REALM!`);
      return;
    }

    endTurn();
  };

  const reserveCard = (card) => {
    if (activePlayer.reserved.length >= 3) {
      alert('You can only hold up to 3 reserved cards at a time.');
      return;
    }

    let gainedGold = false;
    if (gemBank.gold > 0) {
      setGemBank(prev => ({ ...prev, gold: prev.gold - 1 }));
      gainedGold = true;
    }

    setPlayers(prev => prev.map((p, idx) => {
      if (idx !== activePlayerIdx) return p;
      return {
        ...p,
        reserved: [...p.reserved, card],
        tokens: {
          ...p.tokens,
          gold: p.tokens.gold + (gainedGold ? 1 : 0)
        }
      };
    }));

    replaceMarketCard(card);
    addLog(`📌 ${activePlayer.name} reserved ${card.name}${gainedGold ? ' and took 1 Gold wildcard' : ''}.`);
    endTurn();
  };

  const replaceMarketCard = (card) => {
    setMarket(prev => {
      const tierCards = prev[card.tier] || [];
      const replacement = deck.find(c => c.tier === card.tier);
      const nextTier = tierCards.map(c => c.id === card.id ? replacement : c).filter(Boolean);

      if (replacement) {
        setDeck(d => d.filter(c => c.id !== replacement.id));
      }

      return { ...prev, [card.tier]: nextTier };
    });
  };

  const endTurn = () => {
    setSelectedTokens([]);
    setActivePlayerIdx(prev => (prev === 0 ? 1 : 0));
  };

  const addLog = (msg) => {
    setLog(prev => [msg, ...prev].slice(0, 15));
  };

  const copyRoomLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Room link copied to clipboard! Send it to your friend to join.');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onExitToLobby}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all mr-1 cursor-pointer"
            title="Back to Lobby"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center font-black text-white text-base shadow-lg">
            RL
          </div>
          <div>
            <h1 className="font-black text-white tracking-wider text-base">
              REALM OF LEGENDS
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest">
                Anime Splendor
              </span>
              {roomName && (
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] px-1.5 py-0.2 rounded font-black">
                  ROOM: #{roomName}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          {roomName && (
            <button
              onClick={copyRoomLink}
              className="p-1.5 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Invite Friend</span>
            </button>
          )}

          <div className="bg-slate-800 border border-slate-700 px-3 py-1 rounded-xl text-xs font-bold text-white flex items-center gap-2">
            <span>Turn:</span>
            <span className="text-amber-400 font-black">{activePlayer.name}</span>
          </div>

          <button
            onClick={() => window.location.reload()}
            title="Reset Board"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Board Layout */}
      <div className="flex-1 max-w-7xl mx-auto w-full p-4 grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Column: Noble Patrons & Gem Bank */}
        <div className="space-y-6">
          {/* Noble Patrons */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <h3 className="text-xs font-black uppercase text-amber-400 flex items-center gap-1.5 mb-3">
              <Crown className="w-4 h-4" />
              Noble Patrons (3 Pts Each)
            </h3>
            <div className="grid grid-cols-1 gap-2.5">
              {nobles.map(noble => (
                <div key={noble.id} className="flex items-center gap-3 bg-slate-950/80 border border-slate-800/80 p-2 rounded-xl">
                  <img 
                    src={noble.image} 
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80"; }}
                    className="w-12 h-12 rounded-lg object-cover" 
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-white truncate">{noble.name}</h5>
                    <p className="text-[10px] text-slate-400 truncate">{noble.title}</p>
                    <div className="flex gap-1.5 mt-1">
                      {Object.entries(noble.requires).map(([gemId, req]) => {
                        const g = GEM_TYPES.find(x => x.id === gemId);
                        return (
                          <span key={gemId} className={`w-4 h-4 rounded-full ${g?.color} text-[9px] font-black flex items-center justify-center text-white`}>
                            {req}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gem Token Bank */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-black uppercase text-indigo-400 flex items-center gap-1.5">
                <CircleDot className="w-4 h-4" />
                Gem Bank
              </h3>
              {selectedTokens.length > 0 && (
                <button
                  onClick={confirmGemSelection}
                  className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-lg shadow active:scale-95 transition-all cursor-pointer"
                >
                  Take ({selectedTokens.length})
                </button>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              {GEM_TYPES.map(gem => {
                const count = gemBank[gem.id] || 0;
                const isSelected = selectedTokens.includes(gem.id);
                return (
                  <button
                    key={gem.id}
                    disabled={count === 0}
                    onClick={() => toggleSelectGem(gem.id)}
                    className={`p-2 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                      isSelected 
                        ? 'border-amber-400 ring-2 ring-amber-400 bg-amber-500/10 scale-105' 
                        : 'border-slate-800 hover:border-slate-700 bg-slate-950'
                    } disabled:opacity-30 disabled:cursor-not-allowed`}
                  >
                    <div className={`w-7 h-7 rounded-full ${gem.color} border border-white/60 shadow flex items-center justify-center text-xs font-black text-white`}>
                      {count}
                    </div>
                    <span className="text-[10px] font-bold text-slate-300 mt-1 capitalize">{gem.name.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] text-slate-500 mt-3 leading-relaxed">
              Click 3 different gems OR 2 identical (if 4+ left). Click "Take" to claim.
            </p>
          </div>
        </div>

        {/* Center 2 Columns: Card Market (Tier 3, Tier 2, Tier 1) */}
        <div className="lg:col-span-2 space-y-4">
          {[3, 2, 1].map(tier => (
            <div key={tier} className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3 shadow-lg">
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-xs font-black uppercase text-slate-400 tracking-wider">
                  {tier === 3 ? 'Tier III (Legendary Heroes)' : tier === 2 ? 'Tier II (Skilled Champions)' : 'Tier I (Recruits & Apprentices)'}
                </span>
                <span className="text-[10px] text-slate-500 font-bold">
                  Deck: {deck.filter(c => c.tier === tier).length} left
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {(market[tier] || []).map(card => (
                  <SplendorCard
                    key={card.id}
                    card={card}
                    canAfford={checkCanAfford(activePlayer, card)}
                    onBuy={(c) => buyCard(c, false)}
                    onReserve={(c) => reserveCard(c)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Player Dashboards & Action Log */}
        <div className="space-y-4">
          {players.map((p, idx) => (
            <PlayerBoard
              key={p.id}
              player={p}
              isCurrentTurn={idx === activePlayerIdx}
              checkCanAfford={checkCanAfford}
              onPlayReserved={(c) => buyCard(c, true)}
            />
          ))}

          {/* Activity Log */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <h4 className="text-xs font-black uppercase text-slate-400 mb-2 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-indigo-400" />
              Game Telemetry Log
            </h4>
            <div className="space-y-1.5 max-h-36 overflow-y-auto text-xs font-mono text-slate-300">
              {log.map((entry, i) => (
                <p key={i} className="leading-snug">{entry}</p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Winner Overlay */}
      {winner && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-amber-400 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
            <Trophy className="w-16 h-16 text-amber-400 mx-auto animate-bounce mb-3" />
            <h2 className="text-3xl font-black text-white">{winner} WINS!</h2>
            <p className="text-slate-300 text-sm mt-2">
              Gathered 15 Prestige points by recruiting anime champions and winning over noble patrons!
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-sm transition-all cursor-pointer"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
