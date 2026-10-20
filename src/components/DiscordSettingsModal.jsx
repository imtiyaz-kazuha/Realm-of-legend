import React, { useState } from 'react';
import { X, Send, BellRing, Check, ShieldCheck } from 'lucide-react';

export default function DiscordSettingsModal({ onClose }) {
  const [webhookUrl, setWebhookUrl] = useState(() => {
    return localStorage.getItem('rol_discord_webhook') || '';
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem('rol_discord_webhook', webhookUrl.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6">
      <div className="bg-slate-900 border-2 border-indigo-500/80 rounded-3xl p-5 md:p-7 max-w-lg w-full shadow-2xl relative my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2.5 text-indigo-400 mb-2">
          <BellRing className="w-6 h-6 text-indigo-400" />
          <h2 className="text-2xl font-black text-white tracking-wide">
            Discord Match Log Webhook
          </h2>
        </div>
        <p className="text-xs text-slate-400 mb-5 leading-relaxed">
          Automatically post victory announcements, winner scores, and match statistics to your Discord server channel whenever a game concludes!
        </p>

        {/* Webhook Input */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
              Discord Webhook URL
            </label>
            <input
              type="text"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://discord.com/api/webhooks/..."
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-400 font-mono transition-all"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
            <strong className="text-white block mb-0.5">How to get a Discord Webhook:</strong>
            1. In your Discord server, right-click any channel $\rightarrow$ <strong>Edit Channel</strong>.<br/>
            2. Go to <strong>Integrations</strong> $\rightarrow$ <strong>Webhooks</strong> $\rightarrow$ <strong>New Webhook</strong>.<br/>
            3. Click <strong>Copy Webhook URL</strong> and paste it right here!
          </div>

          <button
            onClick={handleSave}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer"
          >
            {saved ? <Check className="w-4 h-4 text-emerald-300" /> : <Send className="w-4 h-4" />}
            {saved ? 'Webhook Saved!' : 'Save Discord Webhook'}
          </button>
        </div>
      </div>
    </div>
  );
}
