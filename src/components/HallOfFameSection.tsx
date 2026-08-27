'use client';

import React from 'react';
import { Award, Flame, ExternalLink, Sparkles, Shield, TrendingUp } from 'lucide-react';
import { UNIVERSAL_CATALOG } from '@/data/pokemonCatalog';
import { UniversalCard, CardCategory } from '@/types/pokemon';

interface HallOfFameProps {
  activeCategory: CardCategory;
  onInspectCard: (card: UniversalCard) => void;
}

export const HallOfFameSection: React.FC<HallOfFameProps> = ({
  activeCategory,
  onInspectCard
}) => {
  const filteredGrails = UNIVERSAL_CATALOG.filter((card) => {
    if (activeCategory === 'all') return true;
    return card.category === activeCategory;
  }).sort((a, b) => b.prices.raw - a.prices.raw);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Award className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Hall of Fame // Grails & Big Hits</h3>
            <p className="text-xs text-slate-400">
              Las cartas más valiosas, autógrafos 1/1 y piezas históricas descubiertas
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold text-slate-500">
          Valuadas en vivo
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {filteredGrails.slice(0, 4).map((card) => (
          <div
            key={card.id}
            onClick={() =>
              onInspectCard({
                ...card,
                detectedTimestamp: 10,
                confidenceScore: 0.99,
                isHit: true,
                isGodHit: true
              })
            }
            className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-800 bg-[#0d111a] p-4 transition-all hover:border-amber-400 hover:shadow-2xl hover:shadow-amber-500/10 flex flex-col justify-between"
          >
            {/* Ambient card glow */}
            <div className="absolute top-0 right-0 h-28 w-28 bg-amber-500/10 blur-2xl group-hover:bg-amber-500/25 transition-all" />

            <div>
              {/* Category pill & number */}
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[9px] font-black text-amber-400 uppercase">
                  {card.category.toUpperCase()}
                </span>
                <span className="font-mono text-[11px] text-slate-400">{card.number}</span>
              </div>

              {/* Card visual showcase */}
              <div className="my-4 flex flex-col items-center">
                <div className="relative holo-shimmer group-hover:scale-105 transition-transform">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={card.imageUrl}
                    alt={card.name}
                    className="h-36 object-contain rounded-xl shadow-xl border border-slate-700/60 bg-slate-900"
                  />
                  {card.serialNumberNumbered && (
                    <div className="absolute -bottom-2 right-1 rounded-md bg-black/90 border border-amber-400/60 px-1.5 py-0.5 text-[9px] font-black text-amber-300">
                      ★ {card.serialNumberNumbered}
                    </div>
                  )}
                </div>
              </div>

              {/* Title & Team */}
              <h4 className="truncate text-sm font-black text-white group-hover:text-amber-300 transition-colors">
                {card.name}
              </h4>
              <p className="truncate text-xs text-slate-400 mt-0.5">
                {card.teamOrFranchise || card.setName}
              </p>
            </div>

            {/* Price footer */}
            <div className="mt-4 border-t border-slate-800/80 pt-3 flex items-end justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Raw Market</span>
                <span className="text-base font-black text-amber-400">
                  \${card.prices.raw.toLocaleString()} USD
                </span>
              </div>
              {card.prices.psa10 && (
                <div className="text-right">
                  <span className="text-[9px] uppercase font-bold text-emerald-400 block">PSA 10 Gem</span>
                  <span className="text-xs font-bold text-emerald-300">
                    \${card.prices.psa10.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
