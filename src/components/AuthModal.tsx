'use client';

import React, { useState } from 'react';
import { X, User, Mail, Lock, Sparkles, Check, LogOut, Film, Award, DollarSign } from 'lucide-react';
import { UserProfile, OpeningSession } from '@/types/pokemon';
import { UserAuthService } from '@/lib/userAuthService';

interface AuthModalProps {
  user: UserProfile | null;
  onUserChanged: (user: UserProfile | null) => void;
  onLoadSavedSession: (session: OpeningSession) => void;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  user,
  onUserChanged,
  onLoadSavedSession,
  onClose
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.includes('@')) {
      setError('Por favor ingresa un correo electrónico válido.');
      return;
    }

    if (mode === 'register') {
      const res = UserAuthService.register(email, password, name);
      if (res.success && res.user) {
        onUserChanged(res.user);
      } else {
        setError(res.error || 'Error al registrar.');
      }
    } else {
      const res = UserAuthService.login(email, password);
      if (res.success && res.user) {
        onUserChanged(res.user);
      } else {
        setError(res.error || 'Error al iniciar sesión.');
      }
    }
  };

  const handleLogout = () => {
    UserAuthService.logout();
    onUserChanged(null);
  };

  const totalPortfolioValue = user?.portfolioCards?.reduce((acc, c) => acc + (c.prices.raw || 0), 0) || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-700 bg-[#0d121c] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {user ? (
          /* User Profile & Saved Sessions Dashboard */
          <div className="space-y-5">
            <div className="flex items-center gap-3.5 border-b border-slate-800 pb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={user.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.email}`}
                alt={user.name}
                className="h-14 w-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 p-1"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white truncate">{user.name}</h3>
                  <span className="rounded-md bg-amber-500/20 border border-amber-400/40 px-2 py-0.5 text-[9px] font-extrabold text-amber-400 uppercase">
                    PRO COLLECTOR
                  </span>
                </div>
                <p className="text-xs text-slate-400 truncate">{user.email}</p>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs text-slate-300 hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/30 transition-all"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Salir</span>
              </button>
            </div>

            {/* Portfolio Summary Stats */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-3">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Valor Portafolio</span>
                <div className="text-base font-black text-amber-400 mt-0.5">
                  \${totalPortfolioValue.toFixed(2)}
                </div>
              </div>
              <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-3">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Cartas Guardadas</span>
                <div className="text-base font-bold text-white mt-0.5">
                  {user.portfolioCards?.length || 0}
                </div>
              </div>
              <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-3">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Aperturas</span>
                <div className="text-base font-bold text-emerald-400 mt-0.5">
                  {user.savedSessions?.length || 0}
                </div>
              </div>
            </div>

            {/* Saved Video Openings List */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Film className="h-4 w-4 text-amber-400" />
                Mis Aperturas y Box Breaks Guardados
              </span>

              {user.savedSessions && user.savedSessions.length > 0 ? (
                <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                  {user.savedSessions.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => {
                        onLoadSavedSession(s);
                        onClose();
                      }}
                      className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-3 hover:border-amber-400/50 hover:bg-slate-800/80 transition-all cursor-pointer group"
                    >
                      <div className="min-w-0 pr-2">
                        <h4 className="truncate text-xs font-bold text-white group-hover:text-amber-300">
                          {s.title}
                        </h4>
                        <span className="text-[10px] text-slate-400">
                          {new Date(s.createdAt).toLocaleDateString()} • {s.cards.length} cartas
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-black text-amber-400">
                          \${s.totalValueUsd.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic p-3 rounded-xl bg-slate-900/40 border border-dashed border-slate-800 text-center">
                  Aún no tienes aperturas guardadas. Sube un video y haz clic en &quot;Guardar en Mi Cuenta&quot;.
                </p>
              )}
            </div>
          </div>
        ) : (
          /* Login & Register Form */
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <User className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Mi Cuenta de Coleccionista</h3>
                <p className="text-xs text-slate-400">Guarda tus aperturas, cartas y fotos de integridad</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-900/90 p-1 border border-slate-800 text-xs font-bold">
              <button
                onClick={() => setMode('login')}
                className={`py-2 rounded-lg transition-all ${
                  mode === 'login' ? 'bg-amber-500 text-black shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => setMode('register')}
                className={`py-2 rounded-lg transition-all ${
                  mode === 'register' ? 'bg-amber-500 text-black shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Crear Cuenta
              </button>
            </div>

            {error && (
              <div className="rounded-xl bg-rose-500/20 border border-rose-500/40 p-2.5 text-xs text-rose-300 font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 pt-1">
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre o Nickname</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Alex Coleccionista"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Correo Electrónico</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="tu@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/90 pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/90 pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 py-3 text-xs font-black text-black shadow-lg shadow-amber-500/20 hover:opacity-95 transition-opacity"
              >
                <Sparkles className="h-4 w-4" />
                {mode === 'login' ? 'Entrar a Mi Cuenta' : 'Crear Cuenta y Guardar Cartas'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
