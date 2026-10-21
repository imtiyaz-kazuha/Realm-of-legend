import React, { useState, useEffect } from 'react';
import { GEM_TYPES, getShuffledSplendorDecks } from '../utils/splendorData';
import { p2p } from '../utils/multiplayer';
import { sendDiscordMatchWebhook } from '../utils/discordWebhook';
import SplendorCard from './SplendorCard';
import PlayerBoard from './PlayerBoard';
import confetti from 'canvas-confetti';
import { Trophy, Crown, CircleDot, Info, ArrowLeft, Layers, Loader2, Copy, Check, Shuffle } from 'lucide-react';

export default function SplendorGame({ roomName, playerOneName, onExitToLobby }) {
  const [isWaitingForOpponent, setIsWaitingForOpponent] = useState(Boolean(roomName));
  const [opponentName, setOpponentName] = useState(roomName ? 'Waiting for opponent...' : 'Player 2');
  const [myPlayerIndex, setMyPlayerIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  const [deckTier1, setDeckTier1] = useState([]);
  const [deckTier2, setDeckTier2] = useState([]);
  const [deckTier3, setDeckTier3] = useState([]);

  const [market, setMarket] = useState({ 1: [], 2: [], 3: [] });
  const [gemBank, setGemBank] = useState({ ruby: 7, sapphire: 7, emerald: 7, amber: 7, onyx: 7, gold: 5 });
  const [nobles, setNobles] = useState([]);
  const [selectedTokens, setSelectedTokens] = useState([]);
  const [winner, setWinner] = useState(null);
  const [log, setLog] = useState([`Decks shuffled! Match initialized.`]);

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

  const setupBoard = () => {
    const { tier1, tier2, tier3, nobles: pickedNobles } = getShuffledSplendorDecks();

    const initialMarket = {
      3: tier3.slice(0, 4),
      2: tier2.slice(0, 4),
      1: tier1.slice(0, 4),
    };

    const remainingT1 = tier1.slice(4);
    const remainingT2 = tier2.slice(4);
    const remainingT3 = tier3.slice(4);

    setMarket(initialMarket);
    setDeckTier1(remainingT1);
    setDeckTier2(remainingT2);
    setDeckTier3(remainingT3);
    setNobles(pickedNobles);

    return {
      market: initialMarket,
      deckTier1: remainingT1,
      deckTier2: remainingT2,
      deckTier3: remainingT3,
      nobles: pickedNobles,
      gemBank: { ruby: 7, sapphire: 7, emerald: 7, amber: 7, onyx: 7, gold: 5 }
    };
  };

  useEffect(() => {
    const initialData = setupBoard();

    if (roomName) {
      p2p.init(
        roomName,
        playerOneName,
        ({ isHost, remoteName }) => {
          setIsWaitingForOpponent(false);
          setOpponentName(remoteName);
          setMyPlayerIndex(isHost ? 0 : 1);

          setPlayers(prev => [
            { ...prev[0], name: isHost ? playerOneName : remoteName },
            { ...prev[1], name: isHost ? remoteName : playerOneName }
          ]);

          addLog(`🎮 Opponent ${remoteName} connected! Game is live.`);

          if (isHost) {
            p2p.send({
              type: 'INIT_STATE',
              market: initialData.market,
              deckTier1: initialData.deckTier1,
              deckTier2: initialData.deckTier2,
              deckTier3: initialData.deckTier3,
              nobles: initialData.nobles,
              gemBank: initialData.gemBank,
              hostName: playerOneName,
            });
          }
        },
        (data) => {
          if (data.type === 'INIT_STATE') {
            setMarket(data.market);
            setDeckTier1(data.deckTier1);
            setDeckTier2(data.deckTier2);
            setDeckTier3(data.deckTier3);
            setNobles(data.nobles);
            setGemBank(data.gemBank);
          } else if (data.type === 'GAME_SYNC') {
            setMarket(data.market);
            setDeckTier1(data.deckTier1);
            setDeckTier2(data.deckTier2);
            setDeckTier3(data.deckTier3);
            setNobles(data.nobles);
            setGemBank(data.gemBank);
            setPlayers(data.players);
            setActivePlayerIdx(data.activePlayerIdx);
            if (data.winner) setWinner(data.winner);
            if (data.newLog) addLog(data.newLog);
          }
        },
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

  const broadcastState = (updatedState) => {
    if (roomName) {
      p2p.send({
        type: 'GAME_SYNC',
        market: updatedState.market ?? market,
        deckTier1: updatedState.deckTier1 ?? deckTier1,
        deckTier2: updatedState.deckTier2 ?? deckTier2,
        deckTier3: updatedState.deckTier3 ?? deckTier3,
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
        addLog(`👑 ${activePlayer.name} visited by ${n.name}! (+${n.points} pts)`);
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

    let nextMarket = { ...market };
    let nextT1 = [...deckTier1];
    let nextT2 = [...deckTier2];
    let nextT3 = [...deckTier3];

    if (!fromReserved) {
      let replacement = null;
      if (card.tier === 1 && nextT1.length > 0) replacement = nextT1.shift();
      if (card.tier === 2 && nextT2.length > 0) replacement = nextT2.shift();
      if (card.tier === 3 && nextT3.length > 0) replacement = nextT3.shift();

      nextMarket[card.tier] = (nextMarket[card.tier] || []).map(c => c.id === card.id ? replacement : c).filter(Boolean);
    }

    const nextTurn = activePlayerIdx === 0 ? 1 : 0;
    const actionMsg = `✨ ${activePlayer.name} recruited ${card.name} (+${card.prestige} pts)!`;

    setGemBank(returnedToBank);
    setNobles(remainingNobles);
    setPlayers(nextPlayers);
    setMarket(nextMarket);
    setDeckTier1(nextT1);
    setDeckTier2(nextT2);
    setDeckTier3(nextT3);
    setActivePlayerIdx(nextTurn);
    addLog(actionMsg);

    let newWinner = null;
    if (nextScore >= 15) {
      newWinner = activePlayer.name;
      setWinner(newWinner);
      confetti({ particleCount: 150, spread: 80 });
      addLog(`🏆 ${activePlayer.name} HAS REACHED 15 PRESTIGE AND WON THE REALM!`);

      const savedWebhook = localStorage.getItem('rol_discord_webhook');
      if (savedWebhook) {
        const otherPlayer = nextPlayers.find(p => p.name !== activePlayer.name) || nextPlayers[1];
        sendDiscordMatchWebhook(savedWebhook, {
          winner: activePlayer.name,
          loser: otherPlayer.name,
          winnerScore: nextScore,
          loserScore: otherPlayer.score,
          roomName: roomName || null
        });
      }
      return;
    }

    broadcastState({
      gemBank: returnedToBank,
      nobles: remainingNobles,
      players: nextPlayers,
      market: nextMarket,
      deckTier1: nextT1,
      deckTier2: nextT2,
      deckTier3: nextT3,
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
      alert('Max 3 reserved cards.');
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
    let nextT1 = [...deckTier1];
    let nextT2 = [...deckTier2];
    let nextT3 = [...deckTier3];

    let replacement = null;
    if (card.tier === 1 && nextT1.length > 0) replacement = nextT1.shift();
    if (card.tier === 2 && nextT2.length > 0) replacement = nextT2.shift();
    if (card.tier === 3 && nextT3.length > 0) replacement = nextT3.shift();

    nextMarket[card.tier] = (nextMarket[card.tier] || []).map(c => c.id === card.id ? replacement : c).filter(Boolean);

    const nextTurn = activePlayerIdx === 0 ? 1 : 0;
    const actionMsg = `📌 ${activePlayer.name} reserved ${card.name}.`;

    setGemBank(nextBank);
    setPlayers(nextPlayers);
    setMarket(nextMarket);
    setDeckTier1(nextT1);
    setDeckTier2(nextT2);
    setDeckTier3(nextT3);
    setActivePlayerIdx(nextTurn);
    addLog(actionMsg);

    broadcastState({
      gemBank: nextBank,
      players: nextPlayers,
      market: nextMarket,
      deckTier1: nextT1,
      deckTier2: nextT2,
      deckTier3: nextT3,
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
    <div className="h-screen w-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden p-1.5 sm:p-2 md:p-2.5">
      {/* Waiting Room Modal */}
      {isWaitingForOpponent && roomName && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-amber-500/80 rounded-3xl p-6 max-w-md w-full text-center shadow-2xl relative">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mb-3">
              <Loader2 className="w-7 h-7 animate-spin" />
            </div>
            <h2 className="text-xl font-black text-white">Waiting for Opponent...</h2>
            <p className="text-xs text-slate-400 mt-1">
              Both players must join room: <span className="text-amber-400 font-bold">#{roomName}</span>
            </p>

            <div className="mt-4 p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-sm font-black text-amber-400">#{roomName}</span>
              <button
                onClick={copyRoomLink}
                className="px-3 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1 cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedLink ? 'Copied!' : 'Copy Link'}
              </button>
            </div>

            <button
              onClick={onExitToLobby}
              className="mt-5 text-xs text-slate-500 hover:text-white cursor-pointer"
            >
              Cancel & Exit to Lobby
            </button>
          </div>
        </div>
      )}

      {/* Header Bar */}
      <header className="flex-shrink-0 z-40 bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-xl px-2.5 h-10 flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <button
            onClick={onExitToLobby}
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
            title="Back to Lobby"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center font-black text-white text-[10px] shadow">
            RL
          </div>
          <span className="font-black text-white text-[11px] tracking-wider">
            REALM OF LEGENDS
          </span>
          {roomName && (
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] px-1 rounded font-black">
              #{roomName}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className={`px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1 border ${
            isMyTurn 
              ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow animate-pulse' 
              : 'bg-slate-800 border-slate-700 text-slate-400'
          }`}>
            <span>Turn:</span>
            <span className="font-black truncate max-w-[80px]">
              {isMyTurn ? 'YOUR TURN' : activePlayer.name}
            </span>
          </div>

          <button
            onClick={() => window.location.reload()}
            title="Reshuffle Match"
            className="p-1 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1"
          >
            <Shuffle className="w-3 h-3 text-amber-400" />
            <span className="hidden sm:inline">Reshuffle</span>
          </button>
        </div>
      </header>

      {/* Main Single-Screen Grid Layout: Exactly 100% viewport height, zero vertical scroll */}
      <div className="flex-1 min-h-0 grid grid-cols-12 gap-1.5 sm:gap-2 items-stretch overflow-hidden">
        {/* Left Column (2 Cols): Nobles & Gem Bank */}
        <div className="col-span-12 md:col-span-3 lg:col-span-2 flex flex-col justify-between gap-1.5 overflow-hidden">
          {/* Noble Patrons */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-1.5 sm:p-2 shadow flex-1 flex flex-col justify-between min-h-0 overflow-hidden">
            <h3 className="text-[10px] font-black uppercase text-amber-400 flex items-center gap-1 mb-0.5 flex-shrink-0">
              <Crown className="w-3 h-3" />
              Nobles (3 Pts)
            </h3>
            <div className="space-y-1 flex-1 flex flex-col justify-around min-h-0">
              {nobles.map(noble => (
                <div key={noble.id} className="flex items-center gap-2 bg-slate-950/80 border border-slate-800/80 p-1 rounded-lg">
                  <img src={noble.image} className="w-8 h-8 rounded-md object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-[10px] sm:text-[11px] font-bold text-white truncate leading-none">{noble.name}</h5>
                    <div className="flex gap-1 mt-0.5">
                      {Object.entries(noble.requires).map(([gemId, req]) => {
                        const g = GEM_TYPES.find(x => x.id === gemId);
                        return (
                          <span key={gemId} className={`w-3.5 h-3.5 rounded-full ${g?.color} text-[8px] font-black flex items-center justify-center text-white`}>
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
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-1.5 sm:p-2 shadow flex-shrink-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-[10px] font-black uppercase text-indigo-400 flex items-center gap-1">
                <CircleDot className="w-3 h-3" />
                Gem Bank
              </h3>
              {selectedTokens.length > 0 && isMyTurn && (
                <button
                  onClick={confirmGemSelection}
                  className="px-2 py-0.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[9.5px] rounded shadow active:scale-95 transition-all cursor-pointer"
                >
                  Take ({selectedTokens.length})
                </button>
              )}
            </div>

            <div className="grid grid-cols-3 gap-1 text-center">
              {GEM_TYPES.map(gem => {
                const count = gemBank[gem.id] || 0;
                const isSelected = selectedTokens.includes(gem.id);
                return (
                  <button
                    key={gem.id}
                    disabled={count === 0 || !isMyTurn}
                    onClick={() => toggleSelectGem(gem.id)}
                    className={`p-1 rounded-lg border flex flex-col items-center justify-center transition-all cursor-pointer ${
                      isSelected 
                        ? 'border-amber-400 ring-1 ring-amber-400 bg-amber-500/20 scale-102' 
                        : 'border-slate-800 bg-slate-950'
                    } disabled:opacity-30 disabled:cursor-not-allowed`}
                  >
                    <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full ${gem.color} border border-white/60 shadow flex items-center justify-center text-[10px] sm:text-[11px] font-black text-white`}>
                      {count}
                    </div>
                    <span className="text-[8.5px] font-bold text-slate-300 mt-0.5 capitalize">{gem.name.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Center: All 3 Tiers (Tier 3, Tier 2, Tier 1) - Divided into 3 equal flex-1 rows */}
        <div className="col-span-12 md:col-span-6 lg:col-span-7 flex flex-col justify-between gap-1.5 min-h-0 overflow-hidden">
          {[3, 2, 1].map(tier => {
            const count = tier === 3 ? deckTier3.length : tier === 2 ? deckTier2.length : deckTier1.length;
            return (
              <div key={tier} className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-1 sm:p-1.5 flex-1 flex flex-col justify-between min-h-0 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-1 mb-0.5 flex-shrink-0">
                  <span className="text-[9.5px] sm:text-[10px] font-black uppercase text-slate-300 tracking-wider">
                    {tier === 3 ? 'Tier III (Legendary)' : tier === 2 ? 'Tier II (Champions)' : 'Tier I (Recruits)'}
                  </span>
                  <span className="text-[8.5px] text-amber-400 font-bold bg-slate-800 px-1.5 py-0.2 rounded-full">
                    Deck: {count} left
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1 sm:gap-1.5 flex-1 min-h-0 items-stretch">
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
            );
          })}
        </div>

        {/* Right Column: Players & Telemetry */}
        <div className="col-span-12 md:col-span-3 lg:col-span-3 flex flex-col justify-between gap-1.5 min-h-0 overflow-hidden">
          <div className="space-y-1.5 flex-shrink-0">
            {players.map((p, idx) => (
              <PlayerBoard
                key={p.id}
                player={p}
                isCurrentTurn={idx === activePlayerIdx}
                checkCanAfford={checkCanAfford}
                onPlayReserved={(c) => buyCard(c, true)}
              />
            ))}
          </div>

          {/* Telemetry Log */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-1.5 sm:p-2 shadow flex-1 flex flex-col justify-between min-h-0 overflow-hidden">
            <h4 className="text-[9.5px] font-black uppercase text-slate-400 flex items-center gap-1 mb-0.5 flex-shrink-0">
              <Info className="w-3 h-3 text-indigo-400" />
              Game Telemetry Log
            </h4>
            <div className="space-y-0.5 flex-1 overflow-y-auto text-[9.5px] font-mono text-slate-300 pr-1">
              {log.map((entry, i) => (
                <p key={i} className="leading-tight py-0.5 border-b border-slate-850 truncate">{entry}</p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Winner Overlay */}
      {winner && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-amber-400 rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl">
            <Trophy className="w-14 h-14 text-amber-400 mx-auto animate-bounce mb-2" />
            <h2 className="text-2xl font-black text-white">{winner} WINS!</h2>
            <p className="text-slate-300 text-xs mt-1">
              Gathered 15 Prestige points and won the Realm!
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-5 px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs transition-all cursor-pointer"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
