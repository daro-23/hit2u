'use client';

import React, { useState } from 'react';
import { Sparkles, ExternalLink, Flame, Shield, TrendingUp, Clock, Award } from 'lucide-react';
import { PokemonCard } from '@/types/pokemon';

interface CardFeedProps {
  cards: PokemonCard[];
  activeCard: PokemonCard | null;
  onSelectCard: (card: PokemonCard) => void;
  onInspectCard: (card: PokemonCard) => void;
}

export const CardFeed: React.FC<CardFeedProps> = ({
  cards,
  activeCard,
  onSelectCard,
  onInspectCard
}) => {
  const [filter, setFilter] = useState<'all' | 'hits' | 'godHits'>('all');

  const filteredCards = cards.filter((card) => {
    if (filter === 'hits') return card.isHit;
    if (filter === 'godHits') return card.isGodHit;
    return true;
  });

  const formatTimestamp = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Header & Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-400" />
          <h3 className="text-base font-bold text-white">Cartas Extraídas</h3>
          <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs font-bold text-slate-300">
            {cards.length}
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 rounded-xl bg-slate-900/90 p-1 border border-slate-800 text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`rounded-lg px-2.5 py-1 font-medium transition-all ${
              filter === 'all'
                ? 'bg-amber-500 text-black font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Todas ({cards.length})
          </button>
          <button
            onClick={() => setFilter('hits')}
            className={`flex items-center gap-1 rounded-lg px-2.5 py-1 font-medium transition-all ${
              filter === 'hits'
                ? 'bg-rose-500 text-white font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Flame className="h-3 w-3" /> Hits ({cards.filter((c) => c.isHit).length})
          </button>
          <button
            onClick={() => setFilter('godHits')}
            className={`flex items-center gap-1 rounded-lg px-2.5 py-1 font-medium transition-all ${
              filter === 'godHits'
                ? 'bg-amber-400 text-black font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ★ Chase ({cards.filter((c) => c.isGodHit).length})
          </button>
        </div>
      </div>

      {/* Cards List / Grid */}
      {filteredCards.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 p-8 text-center text-slate-500">
          <p className="text-sm">No hay cartas que coincidan con este filtro.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
          {filteredCards.map((card) => {
            const isSelected = activeCard?.id === card.id;

            return (
              <div
                key={card.id}
                onClick={() => onSelectCard(card)}
                className={`group relative overflow-hidden rounded-2xl border p-3.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-amber-400 bg-slate-800/90 shadow-xl shadow-amber-500/10 scale-[1.01]'
                    : card.isGodHit
                    ? 'border-amber-500/50 bg-[#121722] hover:border-amber-400'
                    : 'border-slate-800 bg-[#0d111a]/80 hover:border-slate-700 hover:bg-slate-800/50'
                }`}
              >
                {/* God hit animated aura */}
                {card.isGodHit && (
                  <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-bl from-amber-500/20 to-transparent pointer-events-none rounded-bl-full" />
                )}

                <div className="flex items-center gap-3.5">
                  {/* Card Thumbnail with Holo effect */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      onInspectCard(card);
                    }}
                    className="relative shrink-0 holo-shimmer group-hover:scale-105 transition-transform"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={card.imageUrl}
                      alt={card.name}
                      className="h-20 w-14 rounded-lg object-contain bg-slate-900 border border-slate-700/60 shadow-md"
                    />
                    <div className="absolute -bottom-1.5 -right-1.5 flex items-center justify-center rounded-full bg-slate-900/90 border border-slate-700 px-1 py-0.5 text-[9px] font-bold text-slate-300">
                      <Clock className="h-2.5 w-2.5 mr-0.5 text-amber-400" />
                      {formatTimestamp(card.detectedTimestamp)}
                    </div>
                  </div>

                  {/* Card Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="truncate text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                        {card.name}
                      </h4>
                      {card.isGodHit && (
                        <span className="flex items-center gap-0.5 rounded bg-amber-500/20 border border-amber-400/40 px-1.5 py-0.2 text-[9px] font-extrabold text-amber-400 uppercase">
                          <Flame className="h-2.5 w-2.5" /> BIG HIT
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                      <span className="truncate">{card.setName}</span>
                      <span>•</span>
                      <span className="font-mono text-slate-300">#{card.number}</span>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="rounded-md bg-slate-800/80 px-2 py-0.5 text-[10px] font-semibold text-slate-300 border border-slate-700">
                        {card.rarity}
                      </span>
                      {card.prices.marketTrend24h !== undefined && (
                        <span
                          className={`flex items-center gap-0.5 text-[10px] font-semibold ${
                            card.prices.marketTrend24h >= 0 ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          <TrendingUp className="h-2.5 w-2.5" />
                          {card.prices.marketTrend24h >= 0 ? '+' : ''}
                          {card.prices.marketTrend24h}%
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Pricing Column */}
                  <div className="text-right shrink-0">
                    <div className="text-[10px] uppercase font-semibold text-slate-400">Raw Market</div>
                    <div className="text-base font-extrabold text-amber-400">
                      \${card.prices.raw.toFixed(2)}
                    </div>
                    {card.prices.psa10 && (
                      <div className="flex items-center justify-end gap-1 text-[10px] text-emerald-400 font-bold">
                        <Award className="h-3 w-3 text-emerald-400" />
                        PSA 10: \${card.prices.psa10.toFixed(0)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Direct Action Links */}
                <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-2 text-xs">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onInspectCard(card);
                    }}
                    className="text-[11px] font-semibold text-slate-400 hover:text-amber-400 transition-colors"
                  >
                    Ver Grados PSA & Gráficas →
                  </button>

                  <div className="flex items-center gap-2">
                    {card.prices.tcgplayerUrl && (
                      <a
                        href={card.prices.tcgplayerUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-blue-400 transition-colors"
                      >
                        TCGPlayer <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    )}
                    {card.prices.ebaySoldUrl && (
                      <a
                        href={card.prices.ebaySoldUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-amber-400 transition-colors"
                      >
                        eBay Sold <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
