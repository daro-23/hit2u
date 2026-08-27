'use client';

import React, { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Flame, Award, Share2, Sparkles } from 'lucide-react';
import { OpeningSession, PokemonCard } from '@/types/pokemon';

interface RoiSummaryProps {
  session: OpeningSession;
  onOpenShareModal: () => void;
  onInspectTopHit: (card: PokemonCard) => void;
}

export const RoiSummary: React.FC<RoiSummaryProps> = ({
  session,
  onOpenShareModal,
  onInspectTopHit
}) => {
  const [packCost, setPackCost] = useState<number>(session.packCostUsd || 5.99);

  const totalValue = session.cards.reduce((acc, c) => acc + c.prices.raw, 0);
  const profitUsd = totalValue - packCost;
  const roiPercentage = packCost > 0 ? ((totalValue - packCost) / packCost) * 100 : 0;
  const isProfitable = profitUsd >= 0;
  const topHit = session.topHitCard || session.cards[0];

  return (
    <div className="space-y-4 rounded-2xl border border-slate-800 bg-[#0d121c] p-5 shadow-2xl">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-amber-400" />
          <h3 className="text-base font-bold text-white">Resumen de Rentabilidad (ROI)</h3>
        </div>
        <button
          onClick={onOpenShareModal}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 px-3 py-1.5 text-xs font-bold text-black shadow-lg shadow-amber-500/20 hover:opacity-95 transition-opacity"
        >
          <Share2 className="h-3.5 w-3.5" />
          Compartir Hit
        </button>
      </div>

      {/* Main Metric Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {/* Total Pulled Value */}
        <div className="rounded-xl border border-slate-800/90 bg-slate-900/60 p-3.5">
          <span className="text-[11px] font-semibold text-slate-400">Valor Total Extraído</span>
          <div className="mt-1 text-xl font-extrabold text-white">
            \${totalValue.toFixed(2)}
          </div>
          <span className="text-[10px] text-slate-500">
            {session.cards.length} cartas valoradas
          </span>
        </div>

        {/* Cost input */}
        <div className="rounded-xl border border-slate-800/90 bg-slate-900/60 p-3.5">
          <span className="text-[11px] font-semibold text-slate-400">Costo del Sobre/Caja</span>
          <div className="mt-1 flex items-center">
            <span className="text-lg font-bold text-slate-300 mr-1">\$</span>
            <input
              type="number"
              value={packCost}
              onChange={(e) => setPackCost(parseFloat(e.target.value) || 0)}
              className="w-full bg-transparent text-lg font-bold text-white focus:outline-none focus:ring-1 focus:ring-amber-400 rounded px-1"
              step="0.5"
            />
          </div>
          <span className="text-[10px] text-slate-500">Modificable</span>
        </div>

        {/* Profit / Net Return */}
        <div
          className={`rounded-xl border p-3.5 ${
            isProfitable
              ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-400'
              : 'border-rose-500/30 bg-rose-950/20 text-rose-400'
          }`}
        >
          <span className="text-[11px] font-semibold opacity-80">Ganancia / Pérdida</span>
          <div className="mt-1 flex items-center gap-1 text-xl font-extrabold">
            {isProfitable ? (
              <TrendingUp className="h-5 w-5 text-emerald-400" />
            ) : (
              <TrendingDown className="h-5 w-5 text-rose-400" />
            )}
            <span>
              {isProfitable ? '+' : ''}\${profitUsd.toFixed(2)}
            </span>
          </div>
          <span className="text-[10px] opacity-75">
            {isProfitable ? '¡Apertura Rentable!' : 'Pérdida en el pack'}
          </span>
        </div>

        {/* ROI Percentage */}
        <div
          className={`rounded-xl border p-3.5 ${
            roiPercentage >= 0
              ? 'border-amber-500/30 bg-amber-950/20 text-amber-300'
              : 'border-slate-800 bg-slate-900/60 text-slate-400'
          }`}
        >
          <span className="text-[11px] font-semibold opacity-80">Retorno (ROI)</span>
          <div className="mt-1 text-xl font-extrabold">
            {roiPercentage >= 0 ? '+' : ''}{roiPercentage.toFixed(1)}%
          </div>
          <span className="text-[10px] opacity-75">Multiplicador de inversión</span>
        </div>
      </div>

      {/* Top Hit Spotlight */}
      {topHit && (
        <div
          onClick={() => onInspectTopHit(topHit)}
          className="group relative cursor-pointer overflow-hidden rounded-xl border border-amber-500/40 bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-indigo-500/10 p-4 transition-all hover:border-amber-400 hover:shadow-xl hover:shadow-amber-500/10"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-black font-black shadow-lg shadow-amber-500/30 group-hover:scale-105 transition-transform">
                <Flame className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400">
                    TOP HIT DE LA SESIÓN
                  </span>
                  <span className="rounded bg-amber-400/20 px-1 py-0.2 text-[9px] font-bold text-amber-300">
                    {topHit.rarity}
                  </span>
                </div>
                <h4 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                  {topHit.name} #{topHit.number}
                </h4>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-semibold text-slate-400 uppercase">Valor Raw</span>
              <div className="text-xl font-black text-amber-400">
                \${topHit.prices.raw.toFixed(2)}
              </div>
              {topHit.prices.psa10 && (
                <span className="text-[10px] font-bold text-emerald-400">
                  PSA 10: \${topHit.prices.psa10.toFixed(0)}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
