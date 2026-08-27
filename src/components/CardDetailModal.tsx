'use client';

import React from 'react';
import { X, ExternalLink, Award, Flame, Shield, TrendingUp, Sparkles, DollarSign } from 'lucide-react';
import { PokemonCard } from '@/types/pokemon';

interface CardDetailModalProps {
  card: PokemonCard | null;
  onClose: () => void;
}

export const CardDetailModal: React.FC<CardDetailModalProps> = ({ card, onClose }) => {
  if (!card) return null;

  // Estimated grading prices if missing
  const rawPrice = card.prices.raw;
  const psa9Price = card.prices.psa9 || Number((rawPrice * 1.35).toFixed(2));
  const psa10Price = card.prices.psa10 || Number((rawPrice * 2.8).toFixed(2));
  const bgsPristine = Number((psa10Price * 1.5).toFixed(2));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-700/80 bg-[#0d121c] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* PSA Slab Preview Card */}
          <div className="flex flex-col items-center">
            <div className="psa-slab-frame relative flex flex-col items-center rounded-2xl p-3 shadow-2xl holo-shimmer w-full max-w-[260px]">
              {/* PSA Header Label */}
              <div className="mb-2 w-full rounded-lg border border-red-500/40 bg-red-950/40 px-2 py-1.5 text-center">
                <div className="flex items-center justify-between text-[10px] font-black tracking-wider text-red-400 uppercase">
                  <span>PSA GRADING AUTH</span>
                  <span>GEM MT 10</span>
                </div>
                <div className="truncate text-xs font-bold text-white mt-0.5">
                  {card.name} - {card.rarity}
                </div>
              </div>

              {/* Card Image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={card.hiresImageUrl || card.imageUrl}
                alt={card.name}
                className="w-full rounded-xl object-contain shadow-lg"
              />
            </div>

            {card.artist && (
              <p className="mt-3 text-xs text-slate-400">
                Ilustrador: <span className="font-medium text-slate-200">{card.artist}</span>
              </p>
            )}
          </div>

          {/* Card Info & Market Valuations */}
          <div className="flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-bold text-amber-400 border border-amber-500/20">
                  {card.setName}
                </span>
                <span className="font-mono text-xs text-slate-400">#{card.number}</span>
              </div>

              <h2 className="mt-1 text-2xl font-black text-white">{card.name}</h2>

              <div className="flex items-center gap-2 mt-2">
                <span className="rounded-lg bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-300">
                  {card.rarity}
                </span>
                <span className="rounded-lg bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-300">
                  {card.finish}
                </span>
                {card.hp && (
                  <span className="rounded-lg bg-red-950/50 border border-red-500/30 px-2.5 py-1 text-xs font-bold text-red-400">
                    {card.hp} HP
                  </span>
                )}
              </div>
            </div>

            {/* Price Matrix by Grade */}
            <div className="space-y-2 rounded-2xl bg-slate-900/90 border border-slate-800 p-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Award className="h-4 w-4 text-amber-400" />
                Matriz de Precios de Mercado
              </span>

              <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                {/* Raw */}
                <div className="rounded-xl bg-slate-800/80 p-2.5 border border-slate-700">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Raw / Near Mint</span>
                  <div className="text-sm font-extrabold text-amber-400 mt-0.5">
                    \${rawPrice.toFixed(2)}
                  </div>
                </div>

                {/* PSA 9 */}
                <div className="rounded-xl bg-slate-800/80 p-2.5 border border-slate-700">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">PSA 9 Mint</span>
                  <div className="text-sm font-extrabold text-blue-400 mt-0.5">
                    \${psa9Price.toFixed(2)}
                  </div>
                </div>

                {/* PSA 10 */}
                <div className="rounded-xl bg-slate-800/80 p-2.5 border border-amber-500/30 bg-amber-500/5">
                  <span className="text-[10px] text-amber-300 uppercase font-bold">PSA 10 Gem Mint</span>
                  <div className="text-sm font-black text-emerald-400 mt-0.5">
                    \${psa10Price.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {/* External Links */}
            <div className="flex flex-col gap-2 pt-1">
              <span className="text-[11px] font-semibold text-slate-400">
                Verificar ventas comprobadas en plataformas:
              </span>
              <div className="flex flex-wrap gap-2">
                {card.prices.tcgplayerUrl && (
                  <a
                    href={card.prices.tcgplayerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-blue-600/20 border border-blue-500/40 px-3 py-2 text-xs font-bold text-blue-300 hover:bg-blue-600/30 transition-colors"
                  >
                    TCGPlayer <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
                {card.prices.pricechartingUrl && (
                  <a
                    href={card.prices.pricechartingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-600/20 border border-emerald-500/40 px-3 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-600/30 transition-colors"
                  >
                    PriceCharting <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
                {card.prices.ebaySoldUrl && (
                  <a
                    href={card.prices.ebaySoldUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-amber-600/20 border border-amber-500/40 px-3 py-2 text-xs font-bold text-amber-300 hover:bg-amber-600/30 transition-colors"
                  >
                    eBay Sold <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
