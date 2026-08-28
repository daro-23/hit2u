'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, Flame, Sparkles, Shield, DollarSign, Award } from 'lucide-react';
import { UniversalCard } from '@/types/pokemon';

interface VideoPlayerProps {
  videoUrl: string | null;
  duration: number;
  cards: UniversalCard[];
  activeCard: UniversalCard | null;
  onSelectCard: (card: UniversalCard) => void;
  seekTime: number | null;
}

export const VideoPlayerWithTimeline: React.FC<VideoPlayerProps> = ({
  videoUrl,
  duration,
  cards,
  activeCard,
  onSelectCard,
  seekTime
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [simulatedTime, setSimulatedTime] = useState(0);

  // Sync active card based on currentTime
  const currentCardAtTime = cards.find(
    (c) => Math.abs(c.detectedTimestamp - currentTime) < 2.2
  ) || activeCard;

  // Handle external seek requests
  useEffect(() => {
    if (seekTime !== null) {
      if (videoUrl && videoRef.current) {
        videoRef.current.currentTime = seekTime;
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        setSimulatedTime(seekTime);
        setCurrentTime(seekTime);
        setIsPlaying(true);
      }
    }
  }, [seekTime, videoUrl]);

  // Simulation timer for demo sessions
  useEffect(() => {
    if (!videoUrl && isPlaying) {
      const interval = setInterval(() => {
        setSimulatedTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            return 0;
          }
          const next = prev + 0.5;
          setCurrentTime(next);

          const hit = cards.find(
            (c) => Math.abs(c.detectedTimestamp - next) < 1.0
          );
          if (hit && (!activeCard || activeCard.id !== hit.id)) {
            onSelectCard(hit);
          }

          return next;
        });
      }, 500);

      return () => clearInterval(interval);
    }
  }, [isPlaying, videoUrl, duration, cards, activeCard, onSelectCard]);

  const togglePlay = () => {
    if (videoUrl && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickPos = (e.clientX - rect.left) / rect.width;
    const targetTime = clickPos * duration;

    if (videoUrl && videoRef.current) {
      videoRef.current.currentTime = targetTime;
    }
    setCurrentTime(targetTime);
    setSimulatedTime(targetTime);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-[#0c1017] shadow-2xl">
      {/* Video Screen & AR HUD Overlay */}
      <div className="relative aspect-video w-full overflow-hidden bg-black flex items-center justify-center">
        {videoUrl ? (
          <>
            <video
              ref={videoRef}
              src={videoUrl}
              className="h-full w-full object-contain"
              muted={isMuted}
              playsInline
              onTimeUpdate={() => {
                if (videoRef.current) {
                  const t = videoRef.current.currentTime;
                  setCurrentTime(t);
                  const matched = cards.find((c) => Math.abs(c.detectedTimestamp - t) < 1.8);
                  if (matched && (!activeCard || activeCard.id !== matched.id)) {
                    onSelectCard(matched);
                  }
                }
              }}
              onEnded={() => setIsPlaying(false)}
            />

            {/* LIVE AR HUD OVERLAY DIRECTLY ON VIDEO */}
            {currentCardAtTime && (
              <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between animate-fadeIn">
                {/* Top AR Badges Bar */}
                <div className="flex items-center justify-between">
                  {/* Parallel Finish & Hit Status Tag */}
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 rounded-xl bg-black/80 border border-amber-500/50 px-3 py-1.5 text-xs font-black text-amber-300 shadow-xl backdrop-blur-md animate-pulse">
                      <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                      {currentCardAtTime.finish || 'Silver Prizm'}
                    </span>

                    {currentCardAtTime.isGodHit && (
                      <span className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 border border-amber-300 px-3 py-1.5 text-xs font-black text-white shadow-xl animate-bounce">
                        <Flame className="h-3.5 w-3.5 text-yellow-200" />
                        TOP HIT DETECTED
                      </span>
                    )}
                  </div>

                  {/* Real-Time Price Sticker Tag */}
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-2 rounded-xl bg-black/85 border border-emerald-500/50 px-3 py-1.5 text-emerald-300 shadow-2xl backdrop-blur-md">
                      <span className="text-[10px] text-slate-400 font-bold">RAW:</span>
                      <span className="text-sm font-black text-amber-400">
                        \${currentCardAtTime.prices.raw.toFixed(2)}
                      </span>
                      <span className="text-slate-600">|</span>
                      <span className="text-[10px] text-slate-400 font-bold">PSA 10:</span>
                      <span className="text-xs font-black text-emerald-400">
                        \${currentCardAtTime.prices.psa10.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Player Identifier Tag */}
                <div className="flex items-center justify-between bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 rounded-2xl backdrop-blur-sm border-t border-slate-800/60">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-400 font-black text-xs">
                      #{Math.floor(currentCardAtTime.detectedTimestamp)}s
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm sm:text-base font-black text-white drop-shadow-md">
                          {currentCardAtTime.playerOrCharacter || currentCardAtTime.name}
                        </h4>
                        <span className="rounded bg-slate-800/80 px-2 py-0.5 text-[10px] font-bold text-slate-300 border border-slate-700">
                          {currentCardAtTime.teamOrFranchise || 'Panini Prizm'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300">
                        {currentCardAtTime.setName}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-1 rounded-lg">
                    +{currentCardAtTime.prices.marketTrend24h}% 24h
                  </span>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="relative flex h-full w-full flex-col items-center justify-center p-6 text-center bg-radial from-slate-900 via-black to-[#05070a]">
            {activeCard ? (
              <div className="relative flex flex-col items-center animate-fadeIn">
                <div className="relative group mb-3">
                  <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 opacity-60 blur-xl group-hover:opacity-100 transition duration-500 animate-pulse" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activeCard.imageUrl}
                    alt={activeCard.name}
                    className="relative h-64 object-contain rounded-xl shadow-2xl transition-transform hover:scale-105"
                  />
                </div>
                <div className="flex items-center gap-2 rounded-full bg-slate-900/90 border border-slate-700 px-4 py-1.5 backdrop-blur-md">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-sm font-bold text-white">{activeCard.name}</span>
                  <span className="text-xs font-extrabold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                    \${activeCard.prices.raw.toFixed(2)} USD
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <Sparkles className="h-8 w-8 animate-spin" />
                </div>
                <p className="text-sm font-semibold text-slate-300">
                  Reproducción Sincronizada de Apertura
                </p>
                <p className="text-xs text-slate-500 max-w-xs">
                  Haz clic en Play o en cualquier carta del timeline para saltar al momento del Hit
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Interactive Timeline Bar with Card Markers */}
      <div className="border-t border-slate-800 bg-[#0d121c] p-4 space-y-3">
        {/* Seek track with pins */}
        <div className="relative flex flex-col space-y-1">
          <div
            onClick={handleTimelineClick}
            className="group relative h-4 w-full cursor-pointer rounded-full bg-slate-800/90 hover:h-5 transition-all"
          >
            {/* Progress fill */}
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500 transition-all duration-100"
              style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
            />

            {/* Card Pins on Timeline */}
            {cards.map((card) => {
              const posPercent = (card.detectedTimestamp / (duration || 1)) * 100;
              const isSelected = activeCard?.id === card.id;

              return (
                <button
                  key={card.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectCard(card);
                  }}
                  className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-transform hover:scale-125 z-10 ${
                    isSelected ? 'scale-125' : ''
                  }`}
                  style={{ left: `${posPercent}%` }}
                  title={`${card.name} - \$${card.prices.raw.toFixed(2)} USD`}
                >
                  <div
                    className={`h-4 w-4 rounded-full border-2 flex items-center justify-center shadow-lg ${
                      card.isGodHit
                        ? 'border-amber-300 bg-rose-500 animate-pulse ring-2 ring-amber-400'
                        : card.isHit
                        ? 'border-white bg-amber-400'
                        : 'border-slate-400 bg-slate-600'
                    }`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex justify-between text-[11px] font-semibold text-slate-500">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Video Controls Bar */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-black hover:bg-amber-400 transition-all shadow-md active:scale-95"
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
            </button>

            <button
              onClick={() => {
                if (videoRef.current) {
                  videoRef.current.currentTime = 0;
                  setCurrentTime(0);
                } else {
                  setSimulatedTime(0);
                  setCurrentTime(0);
                }
              }}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all"
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all"
            >
              {isMuted ? <VolumeX className="h-4 w-4 text-slate-400" /> : <Volume2 className="h-4 w-4 text-amber-400" />}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">
              {cards.length} Hits Detectados
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
