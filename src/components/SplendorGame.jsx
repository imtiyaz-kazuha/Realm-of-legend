import React, { useState, useEffect } from 'react';
import { GEM_TYPES, NOBLE_PATRONS, getSplendorDeck } from '../utils/splendorData';
import { p2p } from '../utils/multiplayer';
import SplendorCard from './SplendorCard';
import PlayerBoard from './PlayerBoard';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, Crown, CircleDot, Info, ArrowLeft, Share2, Layers, Loader2, Copy, Check } from 'lucide-react';

export default function SplendorGame({ roomName, playerOneName, onExitToLobby }) {
  // Multiplayer Connection State
  const [isWaitingForOpponent, setIsWaitingForOpponent] = useState(Boolean(roomName));
  const [opponentName, setOpponentName] = useState(roomName ? 'Waiting for opponent...' : 'Player 2');
  const [myPlayerIndex, setMyPlayerIndex] = useState(0); // 0 = Player 1, 1 = Player 2
  const [copiedLink, setCopiedLink] = useState(false);

  // Game Board State
  const [deck, setDeck] = useState([]);
  const [market, setMarket] = useState({ 1: [], 2: [], 3: [] });
  const [gemBank, setGemBank] = useState({ ruby: 7, sapphire: 7, emerald: 7, amber: 7, onyx: 7, gold: 5 });
  const [nobles, setNobles] = useState([]);
  const [selectedTokens, setSelectedTokens] = useState([]);
  const [winner, setWinner] = useState(null);
  const [log, setLog] = useState([`Match initialized.`]);

  // Mobile Tab selector: 'market' | 'bank' | 'players'
  const [mobileTab, setMobileTab] = useState('market');

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
      name: opponentName,
      score: 0,
      tokens: { ruby: 0, sapphire: 0, emerald: 0, amber: 0, onyx: 0, gold: 0 },
      bonuses: { ruby: 0, sapphire: 0, emerald: 0, amber: 0, onyx: 0 },
      purchased: [],
      reserved: [],
    }
  ]);

  const [activePlayerIdx, setActivePlayerIdx] = useState(0);

  // Initialize board
  const setupBoard = () => {
    const allCards = getSplendorDeck();
    const tier1 = allCards.filter(c => c.tier === 1);
    const tier2 = allCards.filter(c => c.tier === 2);
    const tier3 = allCards.filter(c => c.tier === 3);

    const initialMarket = {
      3: tier3.slice(0, 4),
      2: tier2.slice(0, 4),
      1: tier1.slice(0, 4),
    };
    const initialDeck = [
      ...tier3.slice(4),
      ...tier2.slice(4),
      ...tier1.slice(4)
    ];

    setMarket(initialMarket);
    setDeck(initialDeck);
    setNobles(NOBLE_PATRONS);

    return {
      market: initialMarket,
      deck: initialDeck,
      nobles: NOBLE_PATRONS,
      gemBank: { ruby: 7, sapphire: 7, emerald: 7, amber: 7, onyx: 7, gold: 5 }
    };
  };

  // Connect via P2P if room mode
  useEffect(() => {
    const initialData = setupBoard();

    if (roomName) {
      p2p.init(
        roomName,
        playerOneName,
        // onConnected
        ({ isHost, remoteName }) => {
          setIsWaitingForOpponent(false);
          setOpponentName(remoteName);
          setMyPlayerIndex(isHost ? 0 : 1);

          setPlayers(prev => [
            { ...prev[0], name: isHost ? playerOneName : remoteName },
            { ...prev[1], name: isHost ? remoteName : playerOneName }
          ]);

          addLog(`🎮 Opponent ${remoteName} connected! Game is live.`);

          // If Host, broadcast initial board state to Guest
          if (isHost) {
            p2p.send({
              type: 'INIT_STATE',
              market: initialData.market,
              deck: initialData.deck,
              nobles: initialData.nobles,
              gemBank: initialData.gemBank,
              hostName: playerOneName,
            });
          }
        },
        // onDataReceived (sync game state from other player)
        (data) => {
          if (data.type === 'INIT_STATE') {
            setMarket(data.market);
            setDeck(data.deck);
            setNobles(data.nobles);
            setGemBank(data.gemBank);
          } else if (data.type === 'GAME_SYNC') {
            setMarket(data.market);
            setDeck(data.deck);
            setNobles(data.nobles);
            setGemBank(data.gemBank);
            setPlayers(data.players);
            setActivePlayerIdx(data.activePlayerIdx);
            if (data.winner) setWinner(data.winner);
            if (data.newLog) addLog(data.newLog);
          }
        },
        // onDisconnected
        () => {
          addLog('⚠️ Opponent disconnected.');
          setIsWaitingForOpponent(true);
        }
      );

      return () => {
        p2p.destroy();
      };
    }
  }, [roomName]);

  const activePlayer = players[activePlayerIdx];
  const isMyTurn = !roomName || (activePlayerIdx === myPlayerIndex);

  // Broadcast game state to peer
  const broadcastState = (updatedState) => {
    if (roomName) {
      p2p.send({
        type: 'GAME_SYNC',
        market: updatedState.market ?? market,
        deck: updatedState.deck ?? deck,
        nobles: updatedState.nobles ?? nobles,
        gemBank: updatedState.gemBank ?? gemBank,
        players: updatedState.players ?? players,
        activePlayerIdx: updatedState.activePlayerIdx ?? activePlayerIdx,
        winner: updatedState.winner ?? winner,
        newLog: updatedState.newLog ?? null,
      });
    }
  };

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
    if (!isMyTurn) {
      alert("It's not your turn!");
      return;
    }
    if (gemId === 'gold') {
      alert('Gold gems cannot be taken directly. Reserve a card to claim a Gold wildcard!');
      return;
    }
    if (gemBank[gemId] <= 0) {
      alert('No more gems of this color left in bank.');
      return;
    }

    let next = [...selectedTokens];
    if (next.length === 1 && next[0] === gemId) {
      if (gemBank[gemId] < 4) {
        alert('You can only take 2 of the same color if 4+ are in bank.');
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
    if (!isMyTurn) return;

    const nextBank = { ...gemBank };
    selectedTokens.forEach(g => { nextBank[g] -= 1; });

    const nextPlayers = players.map((p, idx) => {
      if (idx !== activePlayerIdx) return p;
      const updatedTokens = { ...p.tokens };
      selectedTokens.forEach(g => {
        updatedTokens[g] = (updatedTokens[g] || 0) + 1;
      });
      return { ...p, tokens: updatedTokens };
    });

    const nextTurn = activePlayerIdx === 0 ? 1 : 0;
    const actionMsg = `${activePlayer.name} took ${selectedTokens.length} gems (${selectedTokens.join(', ')}).`;

    setGemBank(nextBank);
    setPlayers(nextPlayers);
    setSelectedTokens([]);
    setActivePlayerIdx(nextTurn);
    addLog(actionMsg);

    broadcastState({
      gemBank: nextBank,
      players: nextPlayers,
      activePlayerIdx: nextTurn,
      newLog: actionMsg
    });
  };

  const buyCard = (card, fromReserved = false) => {
    if (!isMyTurn) {
      alert("It's not your turn!");
      return;
    }
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

    const nextBonuses = { ...activePlayer.bonuses };
    nextBonuses[card.bonusGem] = (nextBonuses[card.bonusGem] || 0) + 1;
    let nextScore = activePlayer.score + (card.prestige || 0);

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

    const nextPlayers = players.map((p, idx) => {
      if (idx !== activePlayerIdx) return p;
      return {
        ...p,
        score: nextScore,
        tokens: remainingTokens,
        bonuses: nextBonuses,
        purchased: [...p.purchased, card],
        reserved: fromReserved ? p.reserved.filter(c => c.id !== card.id) : p.reserved
      };
    });

    // Replace card on market from deck
    let nextMarket = { ...market };
    let nextDeck = [...deck];
    if (!fromReserved) {
      const tierCards = nextMarket[card.tier] || [];
      const replacement = nextDeck.find(c => c.tier === card.tier);
      nextMarket[card.tier] = tierCards.map(c => c.id === card.id ? replacement : c).filter(Boolean);
      if (replacement) {
        nextDeck = nextDeck.filter(c => c.id !== replacement.id);
      }
    }

    const nextTurn = activePlayerIdx === 0 ? 1 : 0;
    const actionMsg = `✨ ${activePlayer.name} recruited ${card.name} (+${card.prestige} prestige)!`;

    setGemBank(returnedToBank);
    setNobles(remainingNobles);
    setPlayers(nextPlayers);
    setMarket(nextMarket);
    setDeck(nextDeck);
    setActivePlayerIdx(nextTurn);
    addLog(actionMsg);

    let newWinner = null;
    if (nextScore >= 15) {
      newWinner = activePlayer.name;
      setWinner(newWinner);
      confetti({ particleCount: 150, spread: 80 });
    }

    broadcastState({
      gemBank: returnedToBank,
      nobles: remainingNobles,
      players: nextPlayers,
      market: nextMarket,
      deck: nextDeck,
      activePlayerIdx: nextTurn,
      winner: newWinner,
      newLog: actionMsg
    });
  };

  const reserveCard = (card) => {
    if (!isMyTurn) {
      alert("It's not your turn!");
      return;
    }
    if (activePlayer.reserved.length >= 3) {
      alert('You can only hold up to 3 reserved cards at a time.');
      return;
    }

    let gainedGold = false;
    let nextBank = { ...gemBank };
    if (nextBank.gold > 0) {
      nextBank.gold -= 1;
      gainedGold = true;
    }

    const nextPlayers = players.map((p, idx) => {
      if (idx !== activePlayerIdx) return p;
      return {
        ...p,
        reserved: [...p.reserved, card],
        tokens: {
          ...p.tokens,
          gold: p.tokens.gold + (gainedGold ? 1 : 0)
        }
      };
    });

    let nextMarket = { ...market };
    let nextDeck = [...deck];
    const tierCards = nextMarket[card.tier] || [];
    const replacement = nextDeck.find(c => c.tier === card.tier);
    nextMarket[card.tier] = tierCards.map(c => c.id === card.id ? replacement : c).filter(Boolean);
    if (replacement) {
      nextDeck = nextDeck.filter(c => c.id !== replacement.id);
    }

    const nextTurn = activePlayerIdx === 0 ? 1 : 0;
    const actionMsg = `📌 ${activePlayer.name} reserved ${card.name}${gainedGold ? ' and took 1 Gold wildcard' : ''}.`;

    setGemBank(nextBank);
    setPlayers(nextPlayers);
    setMarket(nextMarket);
    setDeck(nextDeck);
    setActivePlayerIdx(nextTurn);
    addLog(actionMsg);

    broadcastState({
      gemBank: nextBank,
      players: nextPlayers,
      market: nextMarket,
      deck: nextDeck,
      activePlayerIdx: nextTurn,
      newLog: actionMsg
    });
  };

  const addLog = (msg) => {
    setLog(prev => [msg, ...prev].slice(0, 15));
  };

  const copyRoomLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col pb-16 md:pb-0">
      {/* WAITING ROOM MODAL (Until Opponent Connects) */}
      {isWaitingForOpponent && roomName && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-amber-500/80 rounded-3xl p-6 md:p-8 max-w-md w-full text-center shadow-2xl relative">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mb-4">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <h2 className="text-2xl font-black text-white">Waiting for Opponent...</h2>
            <p className="text-xs text-slate-400 mt-2">
              Both players must enter the exact same room name to match!
            </p>

            <div className="mt-5 p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="text-left">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Room Code</span>
                <span className="text-sm font-black text-amber-400">#{roomName}</span>
              </div>
              <button
                onClick={copyRoomLink}
                className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedLink ? 'Copied!' : 'Copy Link'}
              </button>
            </div>

            <p className="text-[11px] text-slate-400 mt-3">
              Send this room name or link to your friend. As soon as they type <strong>#{roomName}</strong> or click the link, the game will start automatically!
            </p>

            <button
              onClick={onExitToLobby}
              className="mt-6 text-xs text-slate-500 hover:text-white"
            >
              Cancel & Exit to Lobby
            </button>
          </div>
        </div>
      )}

      {/* Navbar */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-3 md:px-4 h-14 md:h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={onExitToLobby}
            className="p-1.5 md:p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
            title="Back to Lobby"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center font-black text-white text-sm shadow">
            RL
          </div>
          <div>
            <h1 className="font-black text-white tracking-wider text-xs md:text-sm">
              REALM OF LEGENDS
            </h1>
            <div className="flex items-center gap-1.5">
              {roomName && (
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] px-1 rounded font-black">
                  ROOM: #{roomName}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Turn Indicator */}
        <div className="flex items-center gap-2">
          <div className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 border ${
            isMyTurn 
              ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow animate-pulse' 
              : 'bg-slate-800 border-slate-700 text-slate-400'
          }`}>
            <span>Turn:</span>
            <span className="font-black truncate max-w-[90px]">
              {isMyTurn ? 'YOUR TURN' : activePlayer.name}
            </span>
          </div>

          <button
            onClick={() => window.location.reload()}
            title="Reset Board"
            className="p-1.5 md:p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </button>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900 border-t border-slate-800 flex justify-around p-2 text-xs font-bold">
        <button
          onClick={() => setMobileTab('market')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg ${mobileTab === 'market' ? 'bg-amber-400 text-slate-950' : 'text-slate-400'}`}
        >
          <Layers className="w-4 h-4" />
          Market
        </button>
        <button
          onClick={() => setMobileTab('bank')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg ${mobileTab === 'bank' ? 'bg-amber-400 text-slate-950' : 'text-slate-400'}`}
        >
          <CircleDot className="w-4 h-4" />
          Bank
        </button>
        <button
          onClick={() => setMobileTab('players')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg ${mobileTab === 'players' ? 'bg-amber-400 text-slate-950' : 'text-slate-400'}`}
        >
          <Trophy className="w-4 h-4" />
          Players ({activePlayer.score})
        </button>
      </div>

      {/* Main Board Layout */}
      <div className="flex-1 max-w-7xl mx-auto w-full p-2.5 md:p-4 grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6 items-start">
        {/* Left Column: Noble Patrons & Gem Bank */}
        <div className={`space-y-4 md:space-y-6 ${mobileTab !== 'bank' ? 'hidden md:block' : 'block'}`}>
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 md:p-4 shadow-xl">
            <h3 className="text-xs font-black uppercase text-amber-400 flex items-center gap-1.5 mb-2.5">
              <Crown className="w-4 h-4" />
              Noble Patrons (3 Pts Each)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2">
              {nobles.map(noble => (
                <div key={noble.id} className="flex items-center gap-2.5 bg-slate-950/80 border border-slate-800/80 p-2 rounded-xl">
                  <img src={noble.image} className="w-11 h-11 rounded-lg object-cover" />
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

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 md:p-4 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-black uppercase text-indigo-400 flex items-center gap-1.5">
                <CircleDot className="w-4 h-4" />
                Gem Bank
              </h3>
              {selectedTokens.length > 0 && isMyTurn && (
                <button
                  onClick={confirmGemSelection}
                  className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-lg shadow active:scale-95 transition-all cursor-pointer"
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
                    disabled={count === 0 || !isMyTurn}
                    onClick={() => toggleSelectGem(gem.id)}
                    className={`p-2 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                      isSelected 
                        ? 'border-amber-400 ring-2 ring-amber-400 bg-amber-500/20 scale-105' 
                        : 'border-slate-800 hover:border-slate-700 bg-slate-950'
                    } disabled:opacity-30 disabled:cursor-not-allowed`}
                  >
                    <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full ${gem.color} border border-white/60 shadow flex items-center justify-center text-xs font-black text-white`}>
                      {count}
                    </div>
                    <span className="text-[10px] font-bold text-slate-300 mt-1 capitalize">{gem.name.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] text-slate-500 mt-2.5 leading-relaxed">
              Pick 3 different colors OR 2 identical (if 4+ in bank). Click "Take" to claim.
            </p>
          </div>
        </div>

        {/* Center: Card Market */}
        <div className={`lg:col-span-2 space-y-3.5 ${mobileTab !== 'market' ? 'hidden md:block' : 'block'}`}>
          {[3, 2, 1].map(tier => (
            <div key={tier} className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-2.5 md:p-3 shadow-lg">
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-xs font-black uppercase text-slate-300 tracking-wider">
                  {tier === 3 ? 'Tier III (Legendary Heroes)' : tier === 2 ? 'Tier II (Skilled Champions)' : 'Tier I (Recruits & Apprentices)'}
                </span>
                <span className="text-[10px] text-slate-500 font-bold">
                  Deck: {deck.filter(c => c.tier === tier).length} left
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-2.5">
                {(market[tier] || []).map(card => (
                  <SplendorCard
                    key={card.id}
                    card={card}
                    canAfford={checkCanAfford(activePlayer, card) && isMyTurn}
                    onBuy={(c) => buyCard(c, false)}
                    onReserve={(c) => reserveCard(c)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Right: Players & Telemetry */}
        <div className={`space-y-3.5 ${mobileTab !== 'players' ? 'hidden md:block' : 'block'}`}>
          {players.map((p, idx) => (
            <PlayerBoard
              key={p.id}
              player={p}
              isCurrentTurn={idx === activePlayerIdx}
              checkCanAfford={checkCanAfford}
              onPlayReserved={(c) => buyCard(c, true)}
            />
          ))}

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 md:p-4 shadow-xl">
            <h4 className="text-xs font-black uppercase text-slate-400 mb-2 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-indigo-400" />
              Game Telemetry Log
            </h4>
            <div className="space-y-1 max-h-32 overflow-y-auto text-xs font-mono text-slate-300">
              {log.map((entry, i) => (
                <p key={i} className="leading-snug text-[11px]">{entry}</p>
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
