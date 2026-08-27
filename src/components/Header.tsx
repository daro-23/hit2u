'use client';

import React from 'react';
import { Sparkles, Flame, Zap } from 'lucide-react';

interface HeaderProps {
  totalCardsDetected: number;
  totalValue: number;
}

export const Header: React.FC<HeaderProps> = ({
  totalCardsDetected,
  totalValue
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#090d14]/80 backdrop-blur-xl transition-all">
      {/* Ticker bar for live TCG & Sports Card Market Stats */}
      <div className="hidden md:flex items-center justify-between border-b border-white/5 bg-black/40 px-6 py-1 text-xs text-slate-400">
        <div className="flex items-center gap-4 overflow-hidden">
          <span className="flex items-center gap-1 font-bold text-amber-400">
            <Flame className="h-3.5 w-3.5" /> LIVE MARKET TRENDS:
          </span>
          <span className="flex items-center gap-1.5 text-slate-300">
            ⚽ Lamine Yamal Topps RC <span className="text-emerald-400 font-medium">\$280.00 (+14.2%)</span>
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-1.5 text-slate-300">
            🏀 Victor Wembanyama Prizm RC <span className="text-emerald-400 font-medium">\$420.00 (+8.7%)</span>
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-1.5 text-slate-300">
            ⚡ Charizard ex 151 SIR <span className="text-emerald-400 font-medium">\$124.50 (+3.2%)</span>
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-1.5 text-slate-300">
            ⚾ Shohei Ohtani 50/50 Auto <span className="text-emerald-400 font-medium">\$2,900.00 (+18.9%)</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-emerald-400 text-[11px]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            TCGPlayer • eBay Sold • PriceCharting Live
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
                SPORTS & TCG AI
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              Deportes (Fútbol, NBA, MLB) & TCG Pack Openings con Valuación en Vivo
            </p>
          </div>
        </div>

        {/* Live session pill + AI Status */}
        <div className="flex items-center gap-3">
          {totalCardsDetected > 0 && (
            <div className="flex items-center gap-2 rounded-xl bg-slate-800/80 border border-slate-700/60 px-3.5 py-1.5 text-xs shadow-inner">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-slate-400">Cartas Hit</span>
                <span className="font-bold text-white text-sm">{totalCardsDetected}</span>
              </div>
              <div className="h-6 w-px bg-slate-700 mx-1" />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-slate-400">Valor Extraído</span>
                <span className="font-extrabold text-amber-400 text-sm">
                  \${totalValue.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {/* AI Status Badge */}
          <div className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-400 shadow-sm shadow-emerald-500/10">
            <Zap className="h-3.5 w-3.5 text-emerald-400" />
            <span className="hidden sm:inline">AI Vision Engine Activo</span>
          </div>
        </div>
      </div>
    </header>
  );
};
