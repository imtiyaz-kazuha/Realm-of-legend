import React, { useState } from 'react';
import { Play, Users, Hash, ShieldCheck, Sparkles, Plus, ArrowRight, BookOpen, Trophy, MessageSquare } from 'lucide-react';
import RulesModal from './RulesModal';
import LeaderboardModal from './LeaderboardModal';
import DiscordSettingsModal from './DiscordSettingsModal';

export default function LobbyMenu({ onStartLocal, onJoinRoom, onCreateRoom }) {
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

      <div className="max-w-xl w-full">
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
            Collect gem tokens, recruit legendary anime champions, and race your opponent to 15 Prestige points!
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

        {/* Game Mode Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Option 1: Pass & Play Local / Solo */}
          <div className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between shadow-xl">
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-400 flex items-center justify-center mb-3">
                <Play className="w-5 h-5 fill-indigo-400" />
              </div>
              <h3 className="text-base font-bold text-white">Local Match</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Play on this single screen with a friend (Pass & Play) or practice solo.
              </p>
            </div>
            <button
              onClick={() => onStartLocal(playerName)}
              className="mt-6 w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition-all shadow active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
            >
              Start Local Match
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Option 2: Multiplayer Online Room */}
          <div className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 flex flex-col justify-between shadow-xl">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mb-3">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Online Room</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Type or pick a room code to match with a friend across the internet.
              </p>

              <div className="mt-3">
                <input
                  type="text"
                  value={roomInput}
                  onChange={(e) => setRoomInput(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))}
                  placeholder="Enter custom room name"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="mt-2 flex flex-wrap gap-1.5">
                {quickRooms.map(r => (
                  <button
                    key={r}
                    onClick={() => setRoomInput(r)}
                    className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                  >
                    #{r}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                disabled={!roomInput.trim()}
                onClick={() => onJoinRoom(roomInput.trim(), playerName)}
                className="flex-1 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs transition-all shadow active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-1"
              >
                Join Room
              </button>
              <button
                onClick={() => onCreateRoom(playerName)}
                className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition-all active:scale-95 cursor-pointer"
                title="Create a random room name"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
