'use client';

import React from 'react';
import { Flame, Sparkles, TrendingUp, ArrowRight, ShieldCheck, DollarSign } from 'lucide-react';
import { TRENDING_COLLECTIONS } from '@/data/trendingCollections';
import { CardCategory, CollectionSet } from '@/types/pokemon';

interface TrendingSetsProps {
  activeCategory: CardCategory;
  onSelectCollection?: (collection: CollectionSet) => void;
}

export const TrendingSetsSection: React.FC<TrendingSetsProps> = ({
  activeCategory,
  onSelectCollection
}) => {
  const filteredSets = TRENDING_COLLECTIONS.filter((set) => {
    if (activeCategory === 'all') return true;
    return set.category === activeCategory;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <Flame className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Colecciones & Sets en Tendencia</h3>
            <p className="text-xs text-slate-400">
              Cajas y sobres con mayor volumen de aperturas y chase cards de alto valor
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
          {filteredSets.length} sets destacados
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredSets.map((set) => (
          <div
            key={set.id}
            onClick={() => onSelectCollection && onSelectCollection(set)}
            className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-[#0d121c] p-4 transition-all hover:border-amber-400/60 hover:shadow-xl hover:shadow-amber-500/5 cursor-pointer flex flex-col justify-between"
          >
            {/* Top row */}
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-slate-800/90 border border-slate-700 px-2 py-0.5 text-[10px] font-black text-slate-300 uppercase">
                  {set.publisher} • {set.year}
                </span>
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                  <TrendingUp className="h-3 w-3" />
                  {set.estimatedSetRoi}
                </span>
              </div>

              <h4 className="mt-2.5 text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                {set.name}
              </h4>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {set.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded bg-slate-900 px-2 py-0.5 text-[10px] font-medium text-slate-400 border border-slate-800"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Chase Grail Card Info */}
            <div className="mt-4 rounded-xl bg-slate-900/80 border border-slate-800/90 p-3">
              <div className="flex items-center justify-between">
                <div className="min-w-0 pr-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                    <Sparkles className="h-3 w-3" /> TOP CHASE GRAIL
                  </span>
                  <p className="truncate text-xs font-bold text-slate-200 mt-0.5">
                    {set.topChaseCard}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-400 block">Est. Market</span>
                  <span className="text-sm font-black text-amber-400">
                    \${set.topChaseValueUsd >= 1000 ? `${(set.topChaseValueUsd / 1000).toFixed(1)}k` : set.topChaseValueUsd.toFixed(0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="mt-3 flex items-center justify-between border-t border-slate-800/80 pt-2.5 text-xs text-slate-400">
              <span>Costo Sobre: <strong className="text-white">\${set.avgPackPriceUsd.toFixed(2)}</strong></span>
              <span className="flex items-center gap-1 text-amber-400 font-bold group-hover:translate-x-0.5 transition-transform text-[11px]">
                Escanear este Set <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
