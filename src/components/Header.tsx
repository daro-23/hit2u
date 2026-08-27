'use client';

import React from 'react';
import { Sparkles, Flame, Zap, User, Save, Sun, Moon, Key } from 'lucide-react';
import { UserProfile } from '@/types/pokemon';

interface HeaderProps {
  user: UserProfile | null;
  theme: 'dark' | 'light';
  hasApiKey: boolean;
  onOpenApiKeyModal: () => void;
  onToggleTheme: () => void;
  onOpenAuth: () => void;
  onSaveCurrentSession: () => void;
  hasUnsavedSession: boolean;
  totalCardsDetected: number;
  totalValue: number;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  theme,
  hasApiKey,
  onOpenApiKeyModal,
  onToggleTheme,
  onOpenAuth,
  onSaveCurrentSession,
  hasUnsavedSession,
  totalCardsDetected,
  totalValue
}) => {
  const isDark = theme === 'dark';

  return (
    <header className={`sticky top-0 z-40 w-full border-b backdrop-blur-xl transition-all duration-300 ${
      isDark
        ? 'border-white/10 bg-[#090d14]/85 text-slate-100'
        : 'border-slate-200/90 bg-white/90 text-slate-900 shadow-sm'
    }`}>
      {/* Ticker bar for live TCG & Sports Card Market Stats */}
      <div className={`hidden md:flex items-center justify-between border-b px-6 py-1 text-xs transition-colors ${
        isDark
          ? 'border-white/5 bg-black/40 text-slate-400'
          : 'border-slate-200/60 bg-slate-100/70 text-slate-600'
      }`}>
        <div className="flex items-center gap-4 overflow-hidden">
          <span className={`flex items-center gap-1 font-extrabold ${
            isDark ? 'text-amber-400' : 'text-amber-600'
          }`}>
            <Flame className="h-3.5 w-3.5" /> LIVE MARKET TRENDS:
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            ⚽ Folarin Balogun Scorers Club /49 <span className="text-emerald-600 dark:text-emerald-400 font-bold">\$45.00 (+7.2%)</span>
          </span>
          <span className="opacity-30">•</span>
          <span className="flex items-center gap-1.5 font-medium">
            ⚽ Lamine Yamal Topps RC <span className="text-emerald-600 dark:text-emerald-400 font-bold">\$280.00 (+14.2%)</span>
          </span>
          <span className="opacity-30">•</span>
          <span className="flex items-center gap-1.5 font-medium">
            ⚽ Cristiano Ronaldo Silver <span className="text-emerald-600 dark:text-emerald-400 font-bold">\$28.00 (+5.1%)</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold">
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
            <div className={`flex h-full w-full items-center justify-center rounded-[10px] ${
              isDark ? 'bg-[#0c1017]' : 'bg-white'
            }`}>
              <Sparkles className="h-5 w-5 text-amber-500 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                hit2u<span className="text-amber-500">.store</span>
              </span>
              <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold border ${
                isDark
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  : 'bg-amber-100 text-amber-800 border-amber-300'
              }`}>
                SPORTS & TCG AI
              </span>
            </div>
            <p className={`text-[11px] font-medium hidden sm:block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Deportes (Fútbol, NBA, MLB) & TCG Pack Openings con Valuación en Vivo
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Gemini AI Key button */}
          <button
            onClick={onOpenApiKeyModal}
            className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-2 text-xs font-bold transition-all shadow-sm ${
              hasApiKey
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                : 'border-amber-500/40 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 animate-pulse'
            }`}
          >
            <Key className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{hasApiKey ? 'Gemini AI Activo' : 'Conectar Gemini AI'}</span>
          </button>

          {/* Save to Account Button */}
          {hasUnsavedSession && (
            <button
              onClick={onSaveCurrentSession}
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition-all shadow-sm ${
                isDark
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              <Save className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Guardar en Mi Cuenta</span>
            </button>
          )}

          {/* User Account / Login Button */}
          <button
            onClick={onOpenAuth}
            className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold transition-all shadow-sm ${
              isDark
                ? 'border-slate-700 bg-slate-800/90 text-slate-200 hover:border-amber-400/60 hover:bg-slate-800'
                : 'border-slate-300 bg-slate-100 text-slate-800 hover:border-amber-500 hover:bg-white'
            }`}
          >
            {user ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={user.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.email}`}
                  alt={user.name}
                  className="h-4 w-4 rounded-full bg-amber-400/20"
                />
                <span className="hidden sm:inline truncate max-w-[100px]">{user.name}</span>
              </>
            ) : (
              <>
                <User className="h-3.5 w-3.5 text-amber-500" />
                <span className="hidden sm:inline">Mi Cuenta</span>
              </>
            )}
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            title={isDark ? 'Cambiar a Pantalla Clara' : 'Cambiar a Pantalla Oscura'}
            className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-all ${
              isDark
                ? 'border-slate-700 bg-slate-800/80 text-amber-400 hover:bg-slate-700 hover:border-amber-400/50'
                : 'border-slate-300 bg-slate-100 text-slate-700 hover:bg-white hover:border-slate-400 hover:text-amber-600'
            }`}
          >
            {isDark ? (
              <Sun className="h-4 w-4 transition-transform hover:rotate-45" />
            ) : (
              <Moon className="h-4 w-4 transition-transform hover:-rotate-12" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
