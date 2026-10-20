import React, { useState } from 'react';
import { Play, Users, Hash, ShieldCheck, Sparkles, Plus, ArrowRight } from 'lucide-react';

export default function LobbyMenu({ onStartLocal, onJoinRoom, onCreateRoom }) {
  const [roomInput, setRoomInput] = useState('');
  const [playerName, setPlayerName] = useState('Hero_' + Math.floor(100 + Math.random() * 900));

  const quickRooms = ['dragon-ball', 'jujutsu-arena', 'straw-hats', 'soul-society'];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4">
      <div className="max-w-xl w-full">
        {/* Logo and Intro */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 flex items-center justify-center font-black text-white text-3xl shadow-xl shadow-amber-500/20 mb-4 animate-bounce">
            RL
          </div>
          <h1 className="text-4xl font-black text-white tracking-wider">
            REALM OF LEGENDS
          </h1>
          <p className="text-sm text-amber-400 font-bold uppercase tracking-widest mt-1">
            Anime Strategy Boardgame
          </p>
          <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto">
            Collect gem tokens, recruit legendary anime champions, attract noble patrons, and be the first to reach 15 Prestige!
          </p>
        </div>

        {/* Player Name Tag */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-6 shadow-xl">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
            Your Player Name
          </label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold text-sm focus:outline-none focus:border-amber-400"
            placeholder="Enter player name"
          />
        </div>

        {/* Game Mode Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Option 1: Pass & Play Local / Solo */}
          <div className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between shadow-xl">
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-400 flex items-center justify-center mb-3">
                <Play className="w-5 h-5 fill-indigo-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Local Play</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Play on this screen with a friend (Pass & Play) or practice your gem strategy solo.
              </p>
            </div>
            <button
              onClick={() => onStartLocal(playerName)}
              className="mt-6 w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg active:scale-95 cursor-pointer flex items-center justify-center gap-2"
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
              <h3 className="text-lg font-bold text-white">Online Room</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Type or pick a room name to join your friends from anywhere with no server required.
              </p>

              {/* Room Name Input */}
              <div className="mt-3">
                <input
                  type="text"
                  value={roomInput}
                  onChange={(e) => setRoomInput(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))}
                  placeholder="Enter custom room name"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Quick Pick Room List */}
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
                className="flex-1 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs transition-all shadow-lg active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-1.5"
              >
                Join Room
              </button>
              <button
                onClick={() => onCreateRoom(playerName)}
                className="px-3 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition-all active:scale-95 cursor-pointer"
                title="Create a random room name"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Rules Summary */}
        <div className="mt-8 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 leading-relaxed text-center">
          💡 <span className="text-slate-200 font-semibold">Quick Rules:</span> On your turn, take 3 different tokens or 2 of the same color. Spend tokens to recruit anime heroes. Each hero gives a permanent discount on future cards!
        </div>
      </div>
    </div>
  );
}
