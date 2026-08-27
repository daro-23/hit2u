'use client';

import React from 'react';

interface ThemeBackgroundProps {
  theme: 'dark' | 'light';
}

export const ThemeBackground: React.FC<ThemeBackgroundProps> = ({ theme }) => {
  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none transition-colors duration-500">
      {/* Dynamic Radial Ambient Lighting */}
      <div
        className={`absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] rounded-full blur-[140px] transition-opacity duration-700 ${
          isDark
            ? 'bg-gradient-to-b from-blue-900/15 via-amber-500/10 to-transparent opacity-80'
            : 'bg-gradient-to-b from-amber-200/40 via-blue-200/30 to-transparent opacity-70'
        }`}
      />
      <div
        className={`absolute bottom-0 -left-40 w-[600px] h-[600px] rounded-full blur-[130px] transition-opacity duration-700 ${
          isDark ? 'bg-indigo-900/10 opacity-60' : 'bg-slate-300/30 opacity-60'
        }`}
      />
      <div
        className={`absolute top-1/3 -right-40 w-[600px] h-[600px] rounded-full blur-[130px] transition-opacity duration-700 ${
          isDark ? 'bg-amber-600/10 opacity-50' : 'bg-amber-200/30 opacity-50'
        }`}
      />

      {/* SVG Watermark Patterns: Booster Boxes, Cards, Slabs & Prisms */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
      >
        <defs>
          {/* Metallic Gold Gradient */}
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity={isDark ? "0.14" : "0.22"} />
            <stop offset="50%" stopColor="#f59e0b" stopOpacity={isDark ? "0.08" : "0.15"} />
            <stop offset="100%" stopColor="#d97706" stopOpacity={isDark ? "0.16" : "0.25"} />
          </linearGradient>

          {/* Metallic Silver Gradient */}
          <linearGradient id="silverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e2e8f0" stopOpacity={isDark ? "0.12" : "0.25"} />
            <stop offset="50%" stopColor="#94a3b8" stopOpacity={isDark ? "0.06" : "0.15"} />
            <stop offset="100%" stopColor="#cbd5e1" stopOpacity={isDark ? "0.15" : "0.28"} />
          </linearGradient>

          {/* Slate Gray Subtle Gradient */}
          <linearGradient id="grayGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isDark ? "#334155" : "#94a3b8"} stopOpacity={isDark ? "0.18" : "0.18"} />
            <stop offset="100%" stopColor={isDark ? "#1e293b" : "#cbd5e1"} stopOpacity={isDark ? "0.08" : "0.1"} />
          </linearGradient>
        </defs>

        {/* --- Top Left: Floating Slab & Card Grid (Silver & Gray) --- */}
        <g transform="translate(60, 120) rotate(-12)" className="transition-all duration-700">
          {/* Card Outer Slab Frame */}
          <rect
            x="0"
            y="0"
            width="130"
            height="200"
            rx="14"
            stroke="url(#silverGradient)"
            strokeWidth="1.5"
            strokeDasharray="4 2"
          />
          {/* Slab Label Tag */}
          <rect x="15" y="15" width="100" height="28" rx="4" stroke="url(#goldGradient)" strokeWidth="1" />
          <line x1="25" y1="24" x2="85" y2="24" stroke="url(#goldGradient)" strokeWidth="1" />
          <line x1="25" y1="32" x2="60" y2="32" stroke="url(#goldGradient)" strokeWidth="1" />
          {/* Inner Card Artwork */}
          <rect x="15" y="52" width="100" height="135" rx="8" stroke="url(#grayGradient)" strokeWidth="1" />
          <circle cx="65" cy="105" r="22" stroke="url(#silverGradient)" strokeWidth="1" />
          <polygon points="65,92 73,115 57,115" stroke="url(#goldGradient)" strokeWidth="1" />
        </g>

        {/* --- Top Right: Booster Box Relief (Gold & Silver) --- */}
        <g transform="translate(1080, 80) rotate(15)" className="transition-all duration-700 hidden sm:block">
          {/* Isometric Booster Box Outline */}
          <polygon
            points="70,0 140,35 140,140 70,105"
            stroke="url(#goldGradient)"
            strokeWidth="1.5"
          />
          <polygon
            points="0,35 70,0 70,105 0,140"
            stroke="url(#goldGradient)"
            strokeWidth="1.5"
          />
          <polygon
            points="0,35 70,0 140,35 70,70"
            stroke="url(#silverGradient)"
            strokeWidth="1.5"
          />
          {/* Pack Silhouettes inside */}
          <line x1="25" y1="52" x2="45" y2="42" stroke="url(#goldGradient)" strokeWidth="1" />
          <line x1="35" y1="58" x2="55" y2="48" stroke="url(#goldGradient)" strokeWidth="1" />
          <line x1="45" y1="64" x2="65" y2="54" stroke="url(#goldGradient)" strokeWidth="1" />
        </g>

        {/* --- Mid Left: Holographic Prism Refractor Angles --- */}
        <g transform="translate(40, 680) rotate(8)" className="transition-all duration-700 hidden md:block">
          <polygon
            points="0,60 90,0 180,60 180,180 90,240 0,180"
            stroke="url(#silverGradient)"
            strokeWidth="1.2"
          />
          <polygon
            points="30,80 90,40 150,80 150,160 90,200 30,160"
            stroke="url(#goldGradient)"
            strokeWidth="1"
          />
          <line x1="0" y1="60" x2="90" y2="120" stroke="url(#grayGradient)" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="180" y1="60" x2="90" y2="120" stroke="url(#grayGradient)" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="90" y1="240" x2="90" y2="120" stroke="url(#grayGradient)" strokeWidth="1" strokeDasharray="3 3" />
        </g>

        {/* --- Mid Right: Overlapping Sports & Pokémon Cards --- */}
        <g transform="translate(1120, 720) rotate(-18)" className="transition-all duration-700">
          {/* Back Card */}
          <rect
            x="0"
            y="0"
            width="120"
            height="180"
            rx="12"
            stroke="url(#grayGradient)"
            strokeWidth="1.2"
          />
          {/* Front Card */}
          <g transform="translate(35, 30) rotate(12)">
            <rect
              x="0"
              y="0"
              width="120"
              height="180"
              rx="12"
              stroke="url(#goldGradient)"
              strokeWidth="1.8"
            />
            <rect x="12" y="12" width="96" height="110" rx="6" stroke="url(#silverGradient)" strokeWidth="1" />
            <line x1="20" y1="135" x2="80" y2="135" stroke="url(#goldGradient)" strokeWidth="1" />
            <line x1="20" y1="145" x2="55" y2="145" stroke="url(#goldGradient)" strokeWidth="1" />
            {/* Sparkle badge */}
            <circle cx="95" cy="140" r="10" stroke="url(#silverGradient)" strokeWidth="1" />
            <polygon points="95,133 97,138 102,140 97,142 95,147 93,142 88,140 93,138" fill="url(#goldGradient)" />
          </g>
        </g>

        {/* --- Bottom Center: Vintage Pack Wrapper Foil Lines --- */}
        <g transform="translate(540, 1100)" className="transition-all duration-700 hidden lg:block">
          <path
            d="M0,0 L200,0 L210,15 L190,30 L210,45 L190,60 L210,75 L190,90 L210,105 L190,120 L200,140 L0,140 L-10,120 L10,105 L-10,90 L10,75 L-10,60 L10,45 L-10,30 L10,15 Z"
            stroke="url(#silverGradient)"
            strokeWidth="1.2"
          />
          <text
            x="100"
            y="75"
            textAnchor="middle"
            fill="url(#goldGradient)"
            fontSize="11"
            fontWeight="900"
            letterSpacing="4"
          >
            HIT2U
          </text>
        </g>
      </svg>
    </div>
  );
};
