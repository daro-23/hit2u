'use client';

import React, { useRef, useState } from 'react';
import { UploadCloud, Sparkles, Play, Loader2, ArrowRight, Sliders } from 'lucide-react';
import { DEMO_SESSIONS } from '@/data/demoSessions';
import { OpeningSession, UniversalCard } from '@/types/pokemon';

interface VideoUploaderProps {
  onSessionLoaded: (session: OpeningSession, videoUrl: string | null) => void;
  onCardDetected: (card: UniversalCard) => void;
}

export const VideoUploader: React.FC<VideoUploaderProps> = ({
  onSessionLoaded,
  onCardDetected
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanSpeed, setScanSpeed] = useState<'fast' | 'standard' | 'detailed'>('standard');
  const [processingStatus, setProcessingStatus] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUserVideo(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processUserVideo(e.target.files[0]);
    }
  };

  const processUserVideo = async (file: File) => {
    setIsProcessing(true);
    setProgressPercent(2);
    setProcessingStatus('Cargando video y extrayendo fotogramas con Gemini 3.7 Flash...');

    const videoUrl = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.src = videoUrl;
    video.muted = true;
    video.playsInline = true;

    video.onloadedmetadata = async () => {
      const duration = video.duration || 30;

      // Smart sampling step
      let step = 3.5;
      if (scanSpeed === 'fast') step = 5.0;
      if (scanSpeed === 'detailed') step = 2.2;

      const sampleTimes: number[] = [];
      for (let t = 1.0; t < duration - 0.5; t += step) {
        sampleTimes.push(Number(t.toFixed(1)));
      }

      setProcessingStatus(`Analizando ${sampleTimes.length} cartas con Gemini 3.7 Flash...`);

      const newSession: OpeningSession = {
        id: `user-upload-${Date.now()}`,
        title: file.name.replace(/\.[^/.]+$/, ''),
        category: 'all',
        packCostUsd: 25.00,
        videoDurationSeconds: duration,
        totalCardsFound: 0,
        totalValueUsd: 0,
        cards: [],
        createdAt: new Date().toISOString()
      };

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const foundCards: UniversalCard[] = [];

      for (let i = 0; i < sampleTimes.length; i++) {
        const time = sampleTimes[i];
        const currentPct = Math.round(((i + 1) / sampleTimes.length) * 100);
        setProgressPercent(currentPct);
        setProcessingStatus(`Analizando carta ${i + 1} de ${sampleTimes.length} (${Math.floor(time)}s / ${Math.round(duration)}s) — ${foundCards.length} cartas detectadas...`);

        try {
          video.currentTime = time;
          await new Promise((r) => {
            video.onseeked = r;
          });

          // Wait 160ms for video decoder to render full sharp frame
          await new Promise(r => setTimeout(r, 160));

          canvas.width = video.videoWidth || 720;
          canvas.height = video.videoHeight || 1280;
          ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
          const base64 = canvas.toDataURL('image/jpeg', 0.88);

          // Small delay to prevent API rate limits
          await new Promise(r => setTimeout(r, 300));

          const response = await fetch('/api/analyze-frame', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              imageBase64: base64,
              timestamp: Number(time.toFixed(1))
            })
          });

          if (response.ok) {
            const data = await response.json();
            if (data.card) {
              const card = data.card as UniversalCard;
              foundCards.push(card);
              onCardDetected(card);
            }
          }
        } catch (err) {
          console.error('Error processing frame at time', time, err);
        }
      }

      newSession.cards = foundCards;
      newSession.totalCardsFound = foundCards.length;
      newSession.totalValueUsd = foundCards.reduce((acc, c) => acc + c.prices.raw, 0);
      newSession.topHitCard = [...foundCards].sort((a, b) => b.prices.raw - a.prices.raw)[0];

      setIsProcessing(false);
      setProgressPercent(100);
      onSessionLoaded(newSession, videoUrl);
    };
  };

  const loadDemo = (demo: OpeningSession) => {
    setIsProcessing(true);
    setProcessingStatus(`Cargando sesión demo: ${demo.title}...`);

    setTimeout(() => {
      setIsProcessing(false);
      onSessionLoaded(demo, null);
    }, 400);
  };

  return (
    <div className="w-full space-y-6">
      {/* Upload Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
        className={`relative group cursor-pointer overflow-hidden rounded-3xl border-2 border-dashed p-8 text-center transition-all ${
          isDragging
            ? 'border-amber-400 bg-amber-500/10 scale-[1.01]'
            : 'border-slate-700 bg-slate-900/40 hover:border-amber-400/60 hover:bg-slate-900/80'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="video/mp4,video/quicktime,video/webm"
          className="hidden"
        />

        {/* Ambient glow */}
        <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-amber-500/10 blur-3xl pointer-events-none group-hover:bg-amber-500/20 transition-all" />
        <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl pointer-events-none group-hover:bg-blue-500/20 transition-all" />

        <div className="relative z-10 flex flex-col items-center justify-center space-y-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500/20 via-rose-500/20 to-blue-500/20 border border-amber-500/30 text-amber-400 group-hover:scale-110 transition-transform">
            {isProcessing ? (
              <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
            ) : (
              <UploadCloud className="h-8 w-8" />
            )}
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
              {isProcessing ? 'Analizando Cartas del Video con Gemini 3.7 Flash...' : 'Sube tu video de apertura de cartas (Pack Opening / Box Break)'}
            </h3>
            <p className="text-sm text-slate-400 max-w-lg mx-auto">
              {isProcessing
                ? processingStatus
                : 'Arrastra y suelta tu video (MP4, MOV). La IA analizará cada carta mostrada, leyendo nombres de jugadores, equipos, marcas y precios en vivo.'}
            </p>
          </div>

          {/* Progress bar when processing */}
          {isProcessing && (
            <div className="w-full max-w-md space-y-1.5 pt-2">
              <div className="h-2.5 w-full rounded-full bg-slate-800 overflow-hidden border border-slate-700">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] font-bold text-slate-400">
                <span>{processingStatus}</span>
                <span className="text-amber-400">{progressPercent}%</span>
              </div>
            </div>
          )}

          {/* Scan frequency options */}
          {!isProcessing && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex flex-wrap items-center justify-center gap-2 pt-2"
            >
              <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
                <Sliders className="h-3 w-3 text-amber-400" /> Frecuencia de Escaneo:
              </span>
              <button
                type="button"
                onClick={() => setScanSpeed('fast')}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                  scanSpeed === 'fast'
                    ? 'bg-amber-500 text-black font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Rápido (~cada 5.0s)
              </button>
              <button
                type="button"
                onClick={() => setScanSpeed('standard')}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                  scanSpeed === 'standard'
                    ? 'bg-amber-500 text-black font-bold shadow-md'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Estándar (~cada 3.5s • Recomendado)
              </button>
              <button
                type="button"
                onClick={() => setScanSpeed('detailed')}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                  scanSpeed === 'detailed'
                    ? 'bg-amber-500 text-black font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Detallado (~cada 2.2s)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Instant Demo Openings Selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>O prueba con sesiones demo interactivas:</span>
          </div>
          <span className="text-[11px] text-slate-500">Sin necesidad de subir archivos</span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {DEMO_SESSIONS.map((demo) => (
            <button
              key={demo.id}
              onClick={() => loadDemo(demo)}
              className="group relative flex items-center justify-between overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-left transition-all hover:border-amber-500/50 hover:bg-slate-800/80 hover:shadow-lg hover:shadow-amber-500/5"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 group-hover:bg-amber-500 group-hover:text-black transition-all">
                  <Play className="h-5 w-5 ml-0.5" />
                </div>
                <div className="min-w-0">
                  <h4 className="truncate text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                    {demo.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                    <span>{demo.cards.length} cartas</span>
                    <span>•</span>
                    <span className="font-bold text-emerald-400">
                      \${demo.totalValueUsd.toFixed(2)} USD
                    </span>
                  </div>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
