import React from 'react';
import { X, BookOpen, Trophy, ShieldCheck, BookmarkPlus, Layers, CircleDot } from 'lucide-react';
import { GEM_TYPES } from '../utils/splendorData';

export default function RulesModal({ onClose }) {
  const sampleCard = {
    name: "Satoru Gojou",
    series: "Jujutsu Kaisen",
    image: "https://s4.anilist.co/file/anilistcdn/character/large/b127691-9zqh1xpIubn7.png",
    tier: 3,
    prestige: 4,
    bonusGem: "onyx",
    cost: { ruby: 3, sapphire: 3, onyx: 3 }
  };

  const onyxGem = GEM_TYPES.find(g => g.id === 'onyx');

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="bg-slate-900 border-2 border-amber-500/80 rounded-3xl p-5 md:p-8 max-w-2xl w-full shadow-2xl relative my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2.5 text-amber-400 mb-4">
          <BookOpen className="w-6 h-6" />
          <h2 className="text-2xl font-black text-white tracking-wide">
            How to Play: Realm of Legends
          </h2>
        </div>

        <div className="space-y-4 text-xs md:text-sm text-slate-300 max-h-[75vh] overflow-y-auto pr-2">
          {/* Goal */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30">
            <h3 className="font-black text-amber-300 text-sm flex items-center gap-1.5 mb-1">
              <Trophy className="w-4 h-4" />
              The Victory Objective
            </h3>
            <p className="leading-relaxed">
              Be the first player to reach <strong>15 Prestige Points</strong> by recruiting anime champions and winning the favor of legendary Noble patrons!
            </p>
          </div>

          {/* Turn Actions */}
          <div className="space-y-2">
            <h3 className="font-black text-white text-sm uppercase tracking-wider text-indigo-400">
              On Your Turn (Choose EXACTLY 1 Action):
            </h3>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <strong className="text-white block mb-0.5">1. Take Gem Tokens from the Bank:</strong>
              <p className="text-slate-400 text-xs leading-relaxed">
                • Take <strong>3 different color gems</strong> (e.g., 1 Ruby, 1 Sapphire, 1 Emerald)<br/>
                • OR take <strong>2 identical color gems</strong> (only permitted if 4 or more tokens of that color remain in the bank).<br/>
                • <em>Note: Max token hand limit is 10.</em>
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <strong className="text-white block mb-0.5">2. Recruit an Anime Champion:</strong>
              <p className="text-slate-400 text-xs leading-relaxed">
                Pay the required gem cost from your token pouch. Each recruited card gives you:
                <br/>• <strong>Prestige Points</strong> (shown at the top left of the card).
                <br/>• <strong>A Permanent Gem Discount</strong> (shown at the top right). Once recruited, this card permanently reduces all your future card purchases of that element!
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <strong className="text-white block mb-0.5">3. Reserve a Card:</strong>
              <p className="text-slate-400 text-xs leading-relaxed">
                Hold a card in your private hand (up to 3 held) to prevent your opponent from buying it, and claim <strong>1 Gold Wildcard</strong> token from the bank!
              </p>
            </div>
          </div>

          {/* Interactive Card Breakdown Diagram */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <h3 className="font-black text-white text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5 text-amber-400">
              <Layers className="w-4 h-4" />
              Card Anatomy & Example:
            </h3>

            <div className="flex flex-col sm:flex-row gap-4 items-center">
              {/* Sample Card */}
              <div className="w-44 rounded-xl overflow-hidden border-2 border-amber-400 bg-slate-900 shadow-xl flex-shrink-0">
                <div className="flex items-center justify-between px-2.5 py-1.5 bg-black/85">
                  <span className="text-xs font-black text-amber-400 flex items-center gap-1 bg-amber-500/20 px-1.5 py-0.5 rounded border border-amber-500/40">
                    <Trophy className="w-3 h-3 text-amber-400" />
                    {sampleCard.prestige}
                  </span>
                  <div className={`w-5 h-5 rounded-full ${onyxGem?.color} border-2 border-white/80 shadow flex items-center justify-center`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
                  </div>
                </div>
                <div className="relative aspect-[3/4] w-full bg-slate-950">
                  <img src={sampleCard.image} className="w-full h-full object-cover object-top" />
                  <div className="absolute bottom-1 left-2">
                    <div className="text-xs font-black text-white">{sampleCard.name}</div>
                    <div className="text-[9px] text-slate-400">{sampleCard.series}</div>
                  </div>
                </div>
                <div className="p-2 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
                  <div className="flex gap-1">
                    <span className="w-5 h-5 rounded-full bg-rose-600 text-[10px] font-black text-white flex items-center justify-center border border-white/40">3</span>
                    <span className="w-5 h-5 rounded-full bg-sky-600 text-[10px] font-black text-white flex items-center justify-center border border-white/40">3</span>
                    <span className="w-5 h-5 rounded-full bg-purple-900 text-[10px] font-black text-white flex items-center justify-center border border-white/40">3</span>
                  </div>
                  <span className="text-[9px] font-bold text-amber-400 bg-amber-400/20 px-2 py-0.5 rounded">Recruit</span>
                </div>
              </div>

              {/* Breakdown Labels */}
              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2">
                  <span className="text-amber-400 font-black">🏆 Top Left:</span>
                  <span><strong>{sampleCard.prestige} Prestige Points</strong> towards the 15 required to win.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-400 font-black">💎 Top Right:</span>
                  <span><strong>Permanent Onyx Discount</strong> (every future card requiring Onyx costs 1 less).</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-rose-400 font-black">🪙 Bottom Row:</span>
                  <span><strong>Gem Cost</strong>: Requires 3 Ruby, 3 Sapphire, and 3 Onyx to recruit.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Noble Patrons */}
          <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-800/40">
            <h3 className="font-black text-indigo-300 text-sm flex items-center gap-1.5 mb-1">
              <ShieldCheck className="w-4 h-4" />
              Noble Patrons (Worth 3 Points Each!)
            </h3>
            <p className="text-slate-300 text-xs leading-relaxed">
              Noble patrons (like Gojo, Gear 5 Luffy, and Captain Levi) don't cost tokens. If you gather the required number of recruited card bonuses, the noble visits you at the end of your turn automatically!
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full py-3 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black rounded-xl text-sm transition-all cursor-pointer shadow-lg active:scale-95"
        >
          Got It, Let's Play!
        </button>
      </div>
    </div>
  );
}
