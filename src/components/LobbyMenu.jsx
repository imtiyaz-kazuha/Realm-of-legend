import React, { useState } from 'react';
import { Play, Users, Hash, ShieldCheck, Sparkles, Plus, ArrowRight, BookOpen, Trophy, MessageSquare, Bot, Zap } from 'lucide-react';
import RulesModal from './RulesModal';
import LeaderboardModal from './LeaderboardModal';
import DiscordSettingsModal from './DiscordSettingsModal';

export default function LobbyMenu({ onStartLocal, onStartAi, onJoinRoom, onCreateRoom }) {
  const [roomInput, setRoomInput] = useState('');
  const [playerName, setPlayerName] = useState('Hero_' + Math.floor(100 + Math.random() * 900));
  const [showRules, setShowRules] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showDiscord, setShowDiscord] = useState(false);

  const quickRooms = ['dragon-ball', 'jujutsu-arena', 'straw-hats', 'soul-society'];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 relative">
      {/* Modals */}
      {showRules && <RulesModal onClose={() => setShowRules(false)} />}
      {showLeaderboard && <LeaderboardModal onClose={() => setShowLeaderboard(false)} />}
      {showDiscord && <DiscordSettingsModal onClose={() => setShowDiscord(false)} />}

      <div className="max-w-2xl w-full">
        {/* Top Action Pills (Rules, Leaderboard, Discord Webhook) */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-6">
          <button
            onClick={() => setShowRules(true)}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-400/60 rounded-xl text-xs font-bold text-amber-300 flex items-center gap-1.5 shadow transition-all active:scale-95 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            Learn Rules
          </button>

          <button
            onClick={() => setShowLeaderboard(true)}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-indigo-400/60 rounded-xl text-xs font-bold text-indigo-300 flex items-center gap-1.5 shadow transition-all active:scale-95 cursor-pointer"
          >
            <Trophy className="w-3.5 h-3.5 text-indigo-400" />
            Leaderboard
          </button>

          <button
            onClick={() => setShowDiscord(true)}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-violet-400/60 rounded-xl text-xs font-bold text-violet-300 flex items-center gap-1.5 shadow transition-all active:scale-95 cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5 text-violet-400" />
            Discord Webhook
          </button>
        </div>

        {/* Logo and Intro */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 flex items-center justify-center font-black text-white text-3xl shadow-xl shadow-amber-500/20 mb-3 animate-bounce">
            RL
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-wider">
            REALM OF LEGENDS
          </h1>
          <p className="text-xs md:text-sm text-amber-400 font-bold uppercase tracking-widest mt-0.5">
            Anime Strategy Boardgame
          </p>
          <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto">
            Collect gem tokens, recruit legendary anime champions, and race your opponent or our smart AI to 15 Prestige points!
          </p>
        </div>

        {/* Player Name Input */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-5 shadow-xl">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
            Your Duelist Name
          </label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold text-sm focus:outline-none focus:border-amber-400"
            placeholder="Enter player name"
          />
        </div>

        {/* Game Mode Cards (3 Options) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* Option 1: AI Duel Mode (Grandmaster Bot) */}
          <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-emerald-950/30 border-2 border-emerald-500/50 hover:border-emerald-400 rounded-2xl p-4 flex flex-col justify-between shadow-xl relative overflow-hidden group">
            <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-emerald-500/20 border border-emerald-500/40 rounded-full text-[9px] font-black text-emerald-400 uppercase tracking-wider flex items-center gap-0.5">
              <Zap className="w-2.5 h-2.5 fill-emerald-400" />
              Smart AI
            </div>
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mb-2.5">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1">
                VS Athena AI
              </h3>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Play instantly against a clever heuristics engine that builds card engines and targets nobles!
              </p>
            </div>
            <button
              onClick={() => onStartAi(playerName)}
              className="mt-4 w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
            >
              Play VS AI
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Option 2: Pass & Play Local / Solo */}
          <div className="bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-4 flex flex-col justify-between shadow-xl">
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-400 flex items-center justify-center mb-2.5">
                <Play className="w-5 h-5 fill-indigo-400" />
              </div>
              <h3 className="text-sm font-bold text-white">Local Match</h3>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Pass & Play on this single screen with a friend or test moves solo.
              </p>
            </div>
            <button
              onClick={() => onStartLocal(playerName)}
              className="mt-4 w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition-all shadow active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
            >
              Start Local
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Option 3: Multiplayer Online Room */}
          <div className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-4 flex flex-col justify-between shadow-xl">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mb-2.5">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Online Room</h3>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                P2P room code to duel a remote friend over WebRTC.
              </p>

              <div className="mt-2.5">
                <input
                  type="text"
                  value={roomInput}
                  onChange={(e) => setRoomInput(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))}
                  placeholder="Room code"
                  className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="mt-1.5 flex flex-wrap gap-1">
                {quickRooms.slice(0, 2).map(r => (
                  <button
                    key={r}
                    onClick={() => setRoomInput(r)}
                    className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                  >
                    #{r}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-3 flex gap-1.5">
              <button
                disabled={!roomInput.trim()}
                onClick={() => onJoinRoom(roomInput.trim(), playerName)}
                className="flex-1 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs transition-all shadow active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-1"
              >
                Join
              </button>
              <button
                onClick={() => onCreateRoom(playerName)}
                className="px-2.5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition-all active:scale-95 cursor-pointer"
                title="Create random room"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
