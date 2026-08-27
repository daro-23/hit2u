'use client';

import React from 'react';
import { Sparkles, Trophy, Flame, Globe, Zap } from 'lucide-react';
import { CardCategory } from '@/types/pokemon';

interface CategoryNavProps {
  activeCategory: CardCategory;
  onSelectCategory: (cat: CardCategory) => void;
}

interface CategoryOption {
  id: CardCategory;
  label: string;
  emoji: string;
  badge?: string;
  accentColor: string;
}

const CATEGORIES: CategoryOption[] = [
  { id: 'all', label: 'Todos los Hits', emoji: '🔥', accentColor: 'from-amber-500 to-rose-500' },
  { id: 'pokemon', label: 'Pokémon TCG', emoji: '⚡', badge: '151 & Fates', accentColor: 'from-yellow-400 to-amber-500' },
  { id: 'soccer', label: 'Fútbol / Soccer', emoji: '⚽', badge: 'Prizm & UCL', accentColor: 'from-blue-400 to-indigo-500' },
  { id: 'nba', label: 'NBA Básquetbol', emoji: '🏀', badge: 'Wemby RC', accentColor: 'from-orange-400 to-rose-500' },
  { id: 'mlb', label: 'MLB Béisbol', emoji: '⚾', badge: 'Ohtani 50/50', accentColor: 'from-emerald-400 to-teal-500' },
  { id: 'nfl', label: 'NFL Football', emoji: '🏈', badge: 'Mahomes', accentColor: 'from-cyan-400 to-blue-500' },
  { id: 'onepiece', label: 'One Piece TCG', emoji: '🏴‍☠️', badge: 'Manga Rare', accentColor: 'from-purple-400 to-pink-500' },
];

export const CategoryNav: React.FC<CategoryNavProps> = ({
  activeCategory,
  onSelectCategory
}) => {
  return (
    <div className="w-full space-y-3">
      {/* Category Horizontal Scrolling Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`group relative flex shrink-0 items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition-all ${
                isActive
                  ? 'bg-slate-800 border-2 border-amber-400 text-white shadow-lg shadow-amber-500/10'
                  : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200 hover:bg-slate-850'
              }`}
            >
              <span className="text-base">{cat.emoji}</span>
              <span>{cat.label}</span>

              {cat.badge && (
                <span
                  className={`rounded-md px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                    isActive
                      ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {cat.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
