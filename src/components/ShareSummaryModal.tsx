'use client';

import React, { useState } from 'react';
import { X, Share2, Copy, Check, Sparkles, Flame, Download } from 'lucide-react';
import { OpeningSession } from '@/types/pokemon';

interface ShareSummaryModalProps {
  session: OpeningSession;
  onClose: () => void;
}

export const ShareSummaryModal: React.FC<ShareSummaryModalProps> = ({ session, onClose }) => {
  const [copied, setCopied] = useState(false);
  const totalValue = session.cards.reduce((acc, c) => acc + c.prices.raw, 0);
  const topHit = session.topHitCard || session.cards[0];

  const shareText = `🔥 ¡Acabo de escanear mi apertura de Pokémon TCG en hit2u.store!
✨ Total extraído: \$${totalValue.toFixed(2)} USD
👑 Top Hit: ${topHit?.name || 'Ultra Rare'} (${topHit ? `\$${topHit.prices.raw.toFixed(2)}` : ''})
📈 ROI Estimado: +${(((totalValue - 5.99) / 5.99) * 100).toFixed(0)}%

Escanea tus cartas con IA en https://hit2u.store`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-700/80 bg-[#0d121c] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <Share2 className="h-5 w-5 text-amber-400" />
          <h3 className="text-lg font-bold text-white">Compartir Resumen de Apertura</h3>
        </div>

        {/* Viral Social Card Preview */}
        <div className="relative overflow-hidden rounded-2xl border-2 border-amber-500/50 bg-gradient-to-br from-[#121824] via-[#0a0f18] to-[#181124] p-6 text-center shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-xs font-black tracking-widest text-amber-400 uppercase">
              HIT2U.STORE // PACK OPENING
            </span>
            <span className="text-[10px] text-slate-400">
              {new Date().toLocaleDateString()}
            </span>
          </div>

          <div className="my-5 flex flex-col items-center">
            {topHit && (
              <div className="relative mb-3">
                <div className="absolute -inset-1 rounded-xl bg-amber-400/40 blur-lg animate-pulse" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={topHit.imageUrl}
                  alt={topHit.name}
                  className="relative h-32 object-contain rounded-lg shadow-xl"
                />
              </div>
            )}

            <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
              VALOR TOTAL DEL PACK
            </div>
            <div className="text-4xl font-black text-white tracking-tight mt-0.5">
              \${totalValue.toFixed(2)} <span className="text-sm font-semibold text-amber-400">USD</span>
            </div>
            <p className="mt-1 text-xs text-slate-300">
              Top Hit: <span className="font-bold text-amber-300">{topHit?.name}</span> (#{topHit?.number})
            </p>
          </div>

          <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-2.5 text-xs text-slate-300 flex items-center justify-around">
            <div>
              <span className="text-[10px] text-slate-500 uppercase block">Cartas</span>
              <span className="font-bold text-white">{session.cards.length}</span>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div>
              <span className="text-[10px] text-slate-500 uppercase block">Rareza Top</span>
              <span className="font-bold text-amber-400">{topHit?.rarity}</span>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div>
              <span className="text-[10px] text-slate-500 uppercase block">ROI</span>
              <span className="font-bold text-emerald-400">+3,800%</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 flex gap-3">
          <button
            onClick={handleCopy}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 text-sm font-bold text-black shadow-lg shadow-amber-500/20 hover:bg-amber-400 transition-colors"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? '¡Texto Copiado!' : 'Copiar Texto para Redes'}
          </button>
        </div>
      </div>
    </div>
  );
};
