'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, Flame, Sparkles } from 'lucide-react';
import { PokemonCard } from '@/types/pokemon';

interface VideoPlayerProps {
  videoUrl: string | null;
  duration: number;
  cards: PokemonCard[];
  activeCard: PokemonCard | null;
  onSelectCard: (card: PokemonCard) => void;
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

  // Simulation timer if no real video uploaded (demo mode)
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

          // Find if there's a card at this timestamp
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
      {/* Video Screen / Simulation Screen */}
      <div className="relative aspect-video w-full overflow-hidden bg-black flex items-center justify-center">
        {videoUrl ? (
          <video
            ref={videoRef}
            src={videoUrl}
            className="h-full w-full object-contain"
            muted={isMuted}
            playsInline
            onTimeUpdate={() => {
              if (videoRef.current) {
                setCurrentTime(videoRef.current.currentTime);
              }
            }}
            onEnded={() => setIsPlaying(false)}
          />
        ) : (
          <div className="relative flex h-full w-full flex-col items-center justify-center p-6 text-center bg-radial from-slate-900 via-black to-[#05070a]">
            {/* Animated card preview in simulation */}
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

            {/* Live Hit Alert Banner */}
            {activeCard?.isGodHit && (
              <div className="absolute top-4 right-4 flex items-center gap-2 rounded-xl bg-amber-500/20 border border-amber-400/50 px-3.5 py-2 text-amber-300 shadow-xl backdrop-blur-md animate-bounce">
                <Flame className="h-5 w-5 text-amber-400" />
                <span className="text-xs font-black tracking-wide uppercase">
                  BIG HIT DETECTED!
                </span>
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
              className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-amber-500 to-rose-500"
              style={{
                width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`
              }}
            />

            {/* Hit Pins on Timeline */}
            {cards.map((card) => {
              const leftPercent = duration > 0 ? (card.detectedTimestamp / duration) * 100 : 0;
              const isSelected = activeCard?.id === card.id;

              return (
                <div
                  key={card.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectCard(card);
                  }}
                  title={`${card.name} - \$${card.prices.raw.toFixed(2)}`}
                  className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 cursor-pointer transition-transform hover:scale-125 ${
                    isSelected ? 'scale-125' : ''
                  }`}
                  style={{ left: `${Math.min(Math.max(leftPercent, 4), 96)}%` }}
                >
                  <div
                    className={`flex h-4 w-4 items-center justify-center rounded-full border-2 shadow-lg ${
                      card.isGodHit
                        ? 'border-amber-300 bg-amber-500 ring-2 ring-amber-400/50 animate-pulse'
                        : card.isHit
                        ? 'border-rose-300 bg-rose-500'
                        : 'border-slate-300 bg-blue-500'
                    }`}
                  >
                    <span className="text-[7px] font-black text-black leading-none">
                      {card.isGodHit ? '★' : '•'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Time indicators */}
          <div className="flex justify-between text-[11px] font-medium text-slate-500">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-black hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
            </button>

            <button
              onClick={() => {
                setCurrentTime(0);
                setSimulatedTime(0);
                if (videoRef.current) videoRef.current.currentTime = 0;
              }}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-800/60 text-slate-300 hover:bg-slate-700 transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            {videoUrl && (
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-800/60 text-slate-300 hover:bg-slate-700 transition-colors"
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">
              {cards.length} {cards.length === 1 ? 'Hit detectado' : 'Hits detectados'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
