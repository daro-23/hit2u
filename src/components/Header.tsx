'use client';

import React from 'react';
import { Sparkles, Key, Zap, Flame, DollarSign, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  onOpenSettings: () => void;
  hasApiKey: boolean;
  totalCardsDetected: number;
  totalValue: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSettings,
  hasApiKey,
  totalCardsDetected,
  totalValue
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#090d14]/80 backdrop-blur-xl transition-all">
      {/* Ticker bar for live TCG market stats */}
      <div className="hidden md:flex items-center justify-between border-b border-white/5 bg-black/40 px-6 py-1 text-xs text-slate-400">
        <div className="flex items-center gap-4 overflow-hidden">
          <span className="flex items-center gap-1 font-semibold text-amber-400">
            <Flame className="h-3.5 w-3.5" /> LIVE TCG TRENDS:
          </span>
          <span className="flex items-center gap-1.5 text-slate-300">
            Charizard ex 199/165 <span className="text-emerald-400 font-medium">\$124.50 (+3.2%)</span>
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-1.5 text-slate-300">
            Mew ex Shiny 232/091 <span className="text-emerald-400 font-medium">\$92.50 (+8.4%)</span>
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-1.5 text-slate-300">
            Umbreon VMAX 215 <span className="text-emerald-400 font-medium">\$890.00 (+12.5%)</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            TCGPlayer & eBay Live Sync
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 p-0.5 shadow-lg shadow-amber-500/20">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#0c1017]">
              <Sparkles className="h-5 w-5 text-amber-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight text-white">
                hit2u<span className="text-amber-400">.store</span>
              </span>
              <span className="rounded-md bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-500/20">
                AI SCAN
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              Pokémon Pack Opening & AI Real-Time Valuation
            </p>
          </div>
        </div>

        {/* Live session pill + Action buttons */}
        <div className="flex items-center gap-3">
          {totalCardsDetected > 0 && (
            <div className="flex items-center gap-2 rounded-xl bg-slate-800/80 border border-slate-700/60 px-3.5 py-1.5 text-xs shadow-inner">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-slate-400">Cards Hit</span>
                <span className="font-bold text-white text-sm">{totalCardsDetected}</span>
              </div>
              <div className="h-6 w-px bg-slate-700 mx-1" />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-slate-400">Pull Value</span>
                <span className="font-extrabold text-amber-400 text-sm">
                  \${totalValue.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {/* AI Status / API Key Button */}
          <button
            onClick={onOpenSettings}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
              hasApiKey
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 shadow-sm shadow-emerald-500/10'
                : 'border-slate-700 bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
            }`}
          >
            <Key className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">
              {hasApiKey ? 'Gemini AI Vision Activo' : 'Configurar Gemini API'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
