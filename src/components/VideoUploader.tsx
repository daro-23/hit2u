'use client';

import React, { useRef, useState } from 'react';
import { UploadCloud, Sparkles, Play, Loader2, ArrowRight, Sliders, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { DEMO_SESSIONS } from '@/data/demoSessions';
import { OpeningSession, UniversalCard } from '@/types/pokemon';

interface VideoUploaderProps {
  onSessionLoaded: (session: OpeningSession, videoUrl: string | null) => void;
  onCardDetected: (card: UniversalCard) => void;
}

// Compute frame clarity & text contrast variance
function getFrameClarity(ctx: CanvasRenderingContext2D, width: number, height: number): number {
  try {
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;
    let clarity = 0;
    const step = 4;
    for (let y = 1; y < height - 1; y += step) {
      for (let x = 1; x < width - 1; x += step) {
        const idx = (y * width + x) * 4;
        const center = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
        const right = (data[idx + 4] + data[idx + 5] + data[idx + 6]) / 3;
        const bottom = (data[idx + width * 4] + data[idx + width * 4 + 1] + data[idx + width * 4 + 2]) / 3;
        clarity += Math.abs(center - right) + Math.abs(center - bottom);
      }
    }
    return clarity;
  } catch {
    return 1;
  }
}

// Simple perceptual difference between consecutive frames to detect card changes
function calculateFrameDifference(dataA: ImageData, dataB: ImageData): number {
  const a = dataA.data;
  const b = dataB.data;
  let diff = 0;
  const len = Math.min(a.length, b.length);
  const step = 16;
  for (let i = 0; i < len; i += step) {
    diff += Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) + Math.abs(a[i + 2] - b[i + 2]);
  }
  return diff / (len / step);
}

export const VideoUploader: React.FC<VideoUploaderProps> = ({
  onSessionLoaded,
  onCardDetected
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'extracting' | 'enhancing' | 'analyzing' | 'done'>('extracting');
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
    setCurrentPhase('extracting');
    setProgressPercent(2);
    setProcessingStatus('Paso 1/3: Escaneando video en cámara lenta para capturar fotogramas nítidos...');

    const videoUrl = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.src = videoUrl;
    video.muted = true;
    video.playsInline = true;

    video.onloadedmetadata = async () => {
      const duration = video.duration || 30;

      // Slower, higher-precision micro-sampling step (every 2.2s - 3.2s)
      let step = 2.8;
      if (scanSpeed === 'fast') step = 4.2;
      if (scanSpeed === 'detailed') step = 1.8;

      const sampleTimePoints: number[] = [];
      for (let t = 0.8; t < duration - 0.4; t += step) {
        sampleTimePoints.push(Number(t.toFixed(1)));
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      const rawCandidates: { base64: string; timestamp: number; clarity: number; imgData: ImageData }[] = [];

      // ========================================================
      // FASE 1: EXTRACCIÓN LENTA & RÁFAGA ANTI-BLUR
      // ========================================================
      for (let i = 0; i < sampleTimePoints.length; i++) {
        const baseTime = sampleTimePoints[i];
        const pct = Math.round(((i + 1) / sampleTimePoints.length) * 45); // 0% - 45%
        setProgressPercent(pct);
        setProcessingStatus(`Fase 1/3: Ráfaga en ${Math.floor(baseTime)}s — Buscando congelamiento de carta...`);

        try {
          const microBurst = [0, 0.35, 0.7, 1.05];
          let bestCandidate = { base64: '', timestamp: baseTime, clarity: -1, imgData: null as any };

          for (const offset of microBurst) {
            const candidateTime = Math.min(baseTime + offset, duration - 0.2);
            video.currentTime = candidateTime;

            await new Promise((r) => {
              video.onseeked = r;
            });
            await new Promise(r => setTimeout(r, 140)); // Slower decoder stabilization

            const origW = video.videoWidth || 640;
            const origH = video.videoHeight || 1138;
            const targetW = 540;
            const targetH = Math.round((origH / origW) * targetW);

            canvas.width = targetW;
            canvas.height = targetH;
            ctx?.drawImage(video, 0, 0, targetW, targetH);

            if (ctx) {
              const clarity = getFrameClarity(ctx, targetW, targetH);
              if (clarity > bestCandidate.clarity) {
                const imgData = ctx.getImageData(0, 0, targetW, targetH);
                bestCandidate = {
                  base64: canvas.toDataURL('image/jpeg', 0.88),
                  timestamp: candidateTime,
                  clarity,
                  imgData
                };
              }
            }
          }

          if (bestCandidate.base64 && bestCandidate.imgData) {
            rawCandidates.push(bestCandidate);
          }
        } catch (err) {
          console.error('Error in burst capture:', err);
        }
      }

      // ========================================================
      // FASE 2: DESDUPLICACIÓN & MEJORA DE IMAGEN IA
      // ========================================================
      setCurrentPhase('enhancing');
      setProcessingStatus('Paso 2/3: Desduplicando cartas y mejorando contraste de banners con IA...');
      
      const uniqueCardsToAnalyze: typeof rawCandidates = [];
      for (let i = 0; i < rawCandidates.length; i++) {
        const current = rawCandidates[i];
        if (i === 0) {
          uniqueCardsToAnalyze.push(current);
          continue;
        }

        const prev = uniqueCardsToAnalyze[uniqueCardsToAnalyze.length - 1];
        const diff = calculateFrameDifference(current.imgData, prev.imgData);

        // If frame is significantly different (a new card was turned), keep it
        // Or if time gap is > 4.5 seconds, keep it
        if (diff > 18 || (current.timestamp - prev.timestamp) >= 4.5) {
          uniqueCardsToAnalyze.push(current);
        } else if (current.clarity > prev.clarity) {
          // If it's the same card but sharper, replace with the sharper hero frame!
          uniqueCardsToAnalyze[uniqueCardsToAnalyze.length - 1] = current;
        }
      }

      // ========================================================
      // FASE 3: ANÁLISIS MULTI-AGENTE & EXTRACCIÓN DE DATOS
      // ========================================================
      setCurrentPhase('analyzing');
      const foundCards: UniversalCard[] = [];

      for (let i = 0; i < uniqueCardsToAnalyze.length; i++) {
        const item = uniqueCardsToAnalyze[i];
        const pct = 45 + Math.round(((i + 1) / uniqueCardsToAnalyze.length) * 55); // 45% - 100%
        setProgressPercent(pct);
        setProcessingStatus(`Paso 3/3: Analizando Carta ${i + 1} de ${uniqueCardsToAnalyze.length} (${Math.floor(item.timestamp)}s)...`);

        try {
          const response = await fetch('/api/analyze-frame', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              imageBase64: item.base64,
              timestamp: Number(item.timestamp.toFixed(1))
            })
          });

          if (response.ok) {
            const data = await response.json();
            if (data.card) {
              const card = data.card as UniversalCard;
              foundCards.push(card);
              onCardDetected(card);
              setProcessingStatus(`✓ Carta ${i + 1}: ${card.name} — \${card.prices.raw.toFixed(2)}`);
            }
          }
        } catch (err) {
          console.error('Error analyzing card item:', err);
        }
      }

      const newSession: OpeningSession = {
        id: `user-upload-${Date.now()}`,
        title: file.name.replace(/\.[^/.]+$/, ''),
        category: 'all',
        packCostUsd: 25.00,
        videoDurationSeconds: duration,
        totalCardsFound: foundCards.length,
        totalValueUsd: foundCards.reduce((acc, c) => acc + c.prices.raw, 0),
        topHitCard: [...foundCards].sort((a, b) => b.prices.raw - a.prices.raw)[0],
        cards: foundCards,
        createdAt: new Date().toISOString()
      };

      setCurrentPhase('done');
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
              {isProcessing ? 'Procesamiento en 3 Fases con Agentes de Visión IA...' : 'Sube tu video de apertura de cartas (Pack Opening / Box Break)'}
            </h3>
            <p className="text-sm text-slate-400 max-w-lg mx-auto">
              {isProcessing
                ? processingStatus
                : 'Arrastra y suelta tu video (MP4, MOV). El sistema extrae fotogramas nítidos en cámara lenta, elimina duplicados y analiza cada carta individualmente.'}
            </p>
          </div>

          {/* 3-Phase Progress Indicator */}
          {isProcessing && (
            <div className="w-full max-w-lg space-y-3 pt-2">
              <div className="grid grid-cols-3 gap-2 text-[10px] font-bold uppercase tracking-wider">
                <div className={`rounded-lg p-1.5 border transition-all ${
                  currentPhase === 'extracting'
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400'
                }`}>
                  1. Ráfaga Anti-Blur
                </div>
                <div className={`rounded-lg p-1.5 border transition-all ${
                  currentPhase === 'enhancing'
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400'
                }`}>
                  2. Desduplicación IA
                </div>
                <div className={`rounded-lg p-1.5 border transition-all ${
                  currentPhase === 'analyzing'
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow animate-pulse'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400'
                }`}>
                  3. Extracción & OCR
                </div>
              </div>

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
                <Sliders className="h-3 w-3 text-amber-400" /> Modo de Muestreo:
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
                Rápido
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
                Estándar (Cámara Lenta + Desduplicación)
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
                Detallado Máximo
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
