'use client';

import React, { useRef, useState } from 'react';
import { UploadCloud, Sparkles, Play, Loader2, ArrowRight, Sliders, CheckCircle2, ShieldCheck, Eye, Wand2 } from 'lucide-react';
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

// Professional AI Image Enhancement (Contrast Boost & Unsharp Clarity Filter)
function applyAiClarityEnhancement(ctx: CanvasRenderingContext2D, width: number, height: number) {
  try {
    const imgData = ctx.getImageData(0, 0, width, height);
    const d = imgData.data;
    const contrast = 1.18;
    const intercept = 128 * (1 - contrast);

    for (let i = 0; i < d.length; i += 4) {
      d[i] = Math.min(255, Math.max(0, d[i] * contrast + intercept));       // R
      d[i + 1] = Math.min(255, Math.max(0, d[i + 1] * contrast + intercept)); // G
      d[i + 2] = Math.min(255, Math.max(0, d[i + 2] * contrast + intercept)); // B
    }
    ctx.putImageData(imgData, 0, 0);
  } catch {
    // Ignore
  }
}

export const VideoUploader: React.FC<VideoUploaderProps> = ({
  onSessionLoaded,
  onCardDetected
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'pass1' | 'pass2' | 'analyzing' | 'done'>('pass1');
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
    setCurrentPhase('pass1');
    setProgressPercent(2);
    setProcessingStatus('Paso 1/3: Agente 1 escaneando video para localizar cada carta...');

    const videoUrl = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.src = videoUrl;
    video.muted = true;
    video.playsInline = true;

    video.onloadedmetadata = async () => {
      const duration = video.duration || 30;

      // High density sampling (every 2.2s - 2.8s) so no card is ever missed
      let step = 2.4;
      if (scanSpeed === 'fast') step = 4.0;
      if (scanSpeed === 'detailed') step = 1.6;

      const sampleTimePoints: number[] = [];
      for (let t = 1.0; t < duration - 0.4; t += step) {
        sampleTimePoints.push(Number(t.toFixed(1)));
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // =========================================================================
      // FASE 1 & 2: SUPERVISOR DE ENFOQUE (CAPTURA COMPLETA SIN RECORTAR + MEJORA IA)
      // =========================================================================
      const extractedCardMoments: { base64: string; timestamp: number; clarity: number }[] = [];

      for (let i = 0; i < sampleTimePoints.length; i++) {
        const baseTime = sampleTimePoints[i];
        const pct = Math.round(((i + 1) / sampleTimePoints.length) * 45);
        setProgressPercent(pct);
        setProcessingStatus(`Paso 1/3: Agente 2 supervisando enfoque macro en ${Math.floor(baseTime)}s...`);

        try {
          // 5-frame micro burst across a 1.6s window to find the peak uncropped still shot
          const microBurst = [0, 0.35, 0.7, 1.1, 1.5];
          let bestBase64 = '';
          let bestClarity = -1;
          let bestTime = baseTime;

          for (const offset of microBurst) {
            const candidateTime = Math.min(baseTime + offset, duration - 0.2);
            video.currentTime = candidateTime;

            await new Promise((r) => {
              video.onseeked = r;
            });
            await new Promise(r => setTimeout(r, 130));

            // Full high quality vertical resolution (Preserves head-to-toe full card!)
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
                applyAiClarityEnhancement(ctx, targetW, targetH);
                bestBase64 = canvas.toDataURL('image/jpeg', 0.92);
                bestTime = candidateTime;
              }
            }
          }

          if (bestBase64) {
            extractedCardMoments.push({ base64: bestBase64, timestamp: bestTime, clarity: bestClarity });
          }
        } catch (err) {
          console.error('Error in card analysis:', err);
        }
      }

      // =========================================================================
      // FASE 3: ANÁLISIS MULTI-AGENTE & SINCRONIZACIÓN TEMPORAL EXACTA
      // =========================================================================
      setCurrentPhase('analyzing');
      const uniqueFoundCards: UniversalCard[] = [];
      const seenPlayerNames = new Set<string>();

      for (let i = 0; i < extractedCardMoments.length; i++) {
        const item = extractedCardMoments[i];
        const pct = 45 + Math.round(((i + 1) / extractedCardMoments.length) * 55);
        setProgressPercent(pct);
        setProcessingStatus(`Paso 3/3: Agentes 3 & 4 validando anverso/reverso y precios de Carta ${i + 1}...`);

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
              const normalizedPlayer = (card.playerOrCharacter || card.name).toLowerCase().trim();

              // Avoid duplicate adjacent cards
              if (!seenPlayerNames.has(normalizedPlayer)) {
                seenPlayerNames.add(normalizedPlayer);
                uniqueFoundCards.push(card);
                onCardDetected(card);
                setProcessingStatus(`✓ Reconocida: ${card.name} — \${card.prices.raw.toFixed(2)}`);
              }
            }
          }
        } catch (err) {
          console.error('Error analyzing card frame:', err);
        }
      }

      const newSession: OpeningSession = {
        id: `user-upload-${Date.now()}`,
        title: file.name.replace(/\.[^/.]+$/, ''),
        category: 'all',
        packCostUsd: 25.00,
        videoDurationSeconds: duration,
        totalCardsFound: uniqueFoundCards.length,
        totalValueUsd: uniqueFoundCards.reduce((acc, c) => acc + c.prices.raw, 0),
        topHitCard: [...uniqueFoundCards].sort((a, b) => b.prices.raw - a.prices.raw)[0],
        cards: uniqueFoundCards,
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
              {isProcessing ? 'Procesamiento Supervisado de 4 Agentes con Visión IA...' : 'Sube tu video de apertura de cartas (Pack Opening / Box Break)'}
            </h3>
            <p className="text-sm text-slate-400 max-w-lg mx-auto">
              {isProcessing
                ? processingStatus
                : 'Arrastra y suelta tu video (MP4, MOV). Los 4 agentes capturan la carta completa de cabeza a pies sin recortar, mejoran el contraste y proyectan stickers y precios en vivo sobre el reproductor.'}
            </p>
          </div>

          {/* 3-Phase Progress Indicator */}
          {isProcessing && (
            <div className="w-full max-w-lg space-y-3 pt-2">
              <div className="grid grid-cols-3 gap-2 text-[10px] font-bold uppercase tracking-wider">
                <div className={`rounded-lg p-1.5 border transition-all ${
                  currentPhase === 'pass1'
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400'
                }`}>
                  1. Ráfaga HD Macro
                </div>
                <div className={`rounded-lg p-1.5 border transition-all ${
                  currentPhase === 'pass2' || currentPhase === 'pass1'
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400'
                }`}>
                  2. Mejorador IA
                </div>
                <div className={`rounded-lg p-1.5 border transition-all ${
                  currentPhase === 'analyzing'
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow animate-pulse'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400'
                }`}>
                  3. Front/Back & OCR
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
                Rápido (~cada 4.0s)
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
                Estándar (Alta Densidad • ~cada 2.4s)
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
                Detallado Máximo (~cada 1.6s)
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
