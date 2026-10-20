import React, { useState } from 'react';
import { ShieldCheck, User, Lock, Sparkles, LogIn, UserPlus } from 'lucide-react';
import { useGame } from '../context/GameContext';

export default function AuthModal() {
  const { login, register } = useGame();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [username, setUsername] = useState('Imtinos');
  const [password, setPassword] = useState('Imtiyaz#$ecure');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (isRegisterMode) {
      const res = register(username, password);
      if (!res.success) setErrorMsg(res.message);
    } else {
      const res = login(username, password);
      if (!res.success) setErrorMsg(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-game-card border border-game-border rounded-2xl p-6 md:p-8 shadow-2xl relative">
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-amber-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 text-white font-black text-2xl mb-3">
            RL
          </div>
          <h2 className="text-2xl font-black text-white tracking-wide">
            REALM OF LEGENDS
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isRegisterMode ? 'Create an adventurer account' : 'Sign in to access your cards and tower progress'}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs text-center font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
              Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full pl-10 pr-4 py-2.5 bg-game-dark border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-game-accent transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-10 pr-4 py-2.5 bg-game-dark border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-game-accent transition-all"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-game-accent to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all active:scale-95 cursor-pointer"
          >
            {isRegisterMode ? (
              <>
                <UserPlus className="w-4 h-4" />
                Register New Account
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-800 text-center">
          <button
            onClick={() => {
              setIsRegisterMode(!isRegisterMode);
              setErrorMsg('');
            }}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
          >
            {isRegisterMode 
              ? 'Already have an account? Sign In' 
              : "Don't have an account yet? Register here"}
          </button>
        </div>

        {/* Tip for Admin */}
        <div className="mt-4 p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400 text-center">
          Admin pre-filled: <span className="text-white font-bold">Imtinos</span> / <span className="text-game-gold font-bold">Imtiyaz#$ecure</span>
        </div>
      </div>
    </div>
  );
}
