'use client';

import React, { useRef, useState } from 'react';
import { UploadCloud, Sparkles, Play, Loader2, ArrowRight, Sliders } from 'lucide-react';
import { DEMO_SESSIONS } from '@/data/demoSessions';
import { OpeningSession, UniversalCard } from '@/types/pokemon';

interface VideoUploaderProps {
  onSessionLoaded: (session: OpeningSession, videoUrl: string | null) => void;
  onCardDetected: (card: UniversalCard) => void;
}

// Extract true uncompressed RGB features from canvas image data
function extractCanvasFeatures(ctx: CanvasRenderingContext2D, width: number, height: number) {
  try {
    const imgData = ctx.getImageData(0, 0, width, height);
    const d = imgData.data;

    let centerR = 0, centerG = 0, centerB = 0, centerCount = 0;
    let borderR = 0, borderG = 0, borderB = 0, borderCount = 0;
    let whitePixelCount = 0, totalSampled = 0;

    const startY = Math.floor(height * 0.30);
    const endY = Math.floor(height * 0.70);
    const startX = Math.floor(width * 0.25);
    const endX = Math.floor(width * 0.75);

    // Center jersey scan
    for (let y = startY; y < endY; y += 4) {
      for (let x = startX; x < endX; x += 4) {
        const idx = (y * width + x) * 4;
        centerR += d[idx];
        centerG += d[idx + 1];
        centerB += d[idx + 2];
        centerCount++;

        if (d[idx] > 180 && d[idx + 1] > 180 && d[idx + 2] > 180) {
          whitePixelCount++;
        }
        totalSampled++;
      }
    }

    // Border parallel scan (left border region)
    const borderStartX = Math.floor(width * 0.08);
    const borderEndX = Math.floor(width * 0.22);
    for (let y = startY; y < endY; y += 4) {
      for (let x = borderStartX; x < borderEndX; x += 4) {
        const idx = (y * width + x) * 4;
        borderR += d[idx];
        borderG += d[idx + 1];
        borderB += d[idx + 2];
        borderCount++;
      }
    }

    const avgCenterR = centerCount > 0 ? Math.round(centerR / centerCount) : 128;
    const avgCenterG = centerCount > 0 ? Math.round(centerG / centerCount) : 128;
    const avgCenterB = centerCount > 0 ? Math.round(centerB / centerCount) : 128;

    const avgBorderR = borderCount > 0 ? Math.round(borderR / borderCount) : 128;
    const avgBorderG = borderCount > 0 ? Math.round(borderG / borderCount) : 128;
    const avgBorderB = borderCount > 0 ? Math.round(borderB / borderCount) : 128;

    const isBack = whitePixelCount / Math.max(1, totalSampled) > 0.65;

    return {
      avgCenterR,
      avgCenterG,
      avgCenterB,
      avgBorderR,
      avgBorderG,
      avgBorderB,
      isBack
    };
  } catch {
    return {
      avgCenterR: 128,
      avgCenterG: 128,
      avgCenterB: 128,
      avgBorderR: 128,
      avgBorderG: 128,
      avgBorderB: 128,
      isBack: false
    };
  }
}

// Compute frame clarity
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
    setProcessingStatus('Iniciando escaneo de video en alta definición...');

    const videoUrl = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.src = videoUrl;
    video.muted = true;
    video.playsInline = true;

    video.onloadedmetadata = async () => {
      const duration = video.duration || 30;

      // Smart sampling intervals to catch each card reveal
      let step = 3.5;
      if (scanSpeed === 'fast') step = 5.0;
      if (scanSpeed === 'detailed') step = 2.2;

      const sampleTimes: number[] = [];
      for (let t = 1.0; t < duration - 0.4; t += step) {
        sampleTimes.push(Number(t.toFixed(1)));
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const extractedCards: { base64: string; timestamp: number; features: any }[] = [];

      for (let i = 0; i < sampleTimes.length; i++) {
        const baseTime = sampleTimes[i];
        const pct = Math.round(((i + 1) / sampleTimes.length) * 50);
        setProgressPercent(pct);
        setProcessingStatus(`Capturando fotograma nítido en ${Math.floor(baseTime)}s (${i + 1}/${sampleTimes.length})...`);

        try {
          const microBurst = [0, 0.4, 0.8, 1.2];
          let bestBase64 = '';
          let bestClarity = -1;
          let bestTime = baseTime;
          let bestFeatures: any = null;

          for (const offset of microBurst) {
            const candidateTime = Math.min(baseTime + offset, duration - 0.2);
            video.currentTime = candidateTime;

            await new Promise((r) => {
              video.onseeked = r;
            });
            await new Promise(r => setTimeout(r, 130));

            const origW = video.videoWidth || 720;
            const origH = video.videoHeight || 1280;
            const targetW = 600;
            const targetH = Math.round((origH / origW) * targetW);

            canvas.width = targetW;
            canvas.height = targetH;
            ctx?.drawImage(video, 0, 0, targetW, targetH);

            if (ctx) {
              const clarity = getFrameClarity(ctx, targetW, targetH);
              if (clarity > bestClarity) {
                bestClarity = clarity;
                bestFeatures = extractCanvasFeatures(ctx, targetW, targetH);
                bestBase64 = canvas.toDataURL('image/jpeg', 0.90);
                bestTime = candidateTime;
              }
            }
          }

          if (bestBase64) {
            extractedCards.push({ base64: bestBase64, timestamp: bestTime, features: bestFeatures });
          }
        } catch (err) {
          console.error('Error extracting frame:', err);
        }
      }

      // Process and recognize each extracted card
      const foundCards: UniversalCard[] = [];
      let lastRecognizedName = '';

      for (let i = 0; i < extractedCards.length; i++) {
        const item = extractedCards[i];
        const pct = 50 + Math.round(((i + 1) / extractedCards.length) * 50);
        setProgressPercent(pct);
        setProcessingStatus(`Analizando Carta ${i + 1} de ${extractedCards.length} con agentes de visión...`);

        try {
          const response = await fetch('/api/analyze-frame', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              imageBase64: item.base64,
              timestamp: Number(item.timestamp.toFixed(1)),
              canvasFeatures: item.features
            })
          });

          if (response.ok) {
            const data = await response.json();
            if (data.card) {
              const card = data.card as UniversalCard;

              // Only drop if it's the exact same card in consecutive adjacent frames (less than 3.5s apart)
              if (card.name !== lastRecognizedName || foundCards.length === 0) {
                lastRecognizedName = card.name;
                foundCards.push(card);
                onCardDetected(card);
                setProcessingStatus(`✓ Carta ${foundCards.length}: ${card.name} — \${card.prices.raw.toFixed(2)}`);
              }
            }
          }
        } catch (err) {
          console.error('Error analyzing card:', err);
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
              {isProcessing ? 'Analizando Video & Reconociendo Cartas en Vivo...' : 'Sube tu video de apertura de cartas (Pack Opening / Box Break)'}
            </h3>
            <p className="text-sm text-slate-400 max-w-lg mx-auto">
              {isProcessing
                ? processingStatus
                : 'Arrastra y suelta tu video (MP4, MOV). Los agentes de visión reconocen cada carta con precisión de píxeles, sin duplicar y calculando precios reales en tiempo real.'}
            </p>
          </div>

          {/* Progress bar when processing */}
          {isProcessing && (
            <div className="w-full max-w-md space-y-2 pt-2">
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
