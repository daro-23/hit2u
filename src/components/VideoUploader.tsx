'use client';

import React, { useRef, useState } from 'react';
import { UploadCloud, Video, Sparkles, Play, Camera, Film, Loader2, ArrowRight } from 'lucide-react';
import { DEMO_SESSIONS } from '@/data/demoSessions';
import { OpeningSession, PokemonCard } from '@/types/pokemon';

interface VideoUploaderProps {
  onSessionLoaded: (session: OpeningSession, videoUrl: string | null) => void;
  onCardDetected: (card: PokemonCard) => void;
  apiKey: string;
}

export const VideoUploader: React.FC<VideoUploaderProps> = ({
  onSessionLoaded,
  onCardDetected,
  apiKey
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string>('');
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
    setProcessingStatus('Cargando y analizando video...');

    const videoUrl = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.src = videoUrl;
    video.muted = true;
    video.playsInline = true;

    video.onloadedmetadata = async () => {
      const duration = video.duration || 30;
      setProcessingStatus(`Extrayendo fotogramas (${Math.round(duration)}s de video)...`);

      // Mock or real processing session
      const newSession: OpeningSession = {
        id: `user-upload-${Date.now()}`,
        title: file.name.replace(/\.[^/.]+$/, ''),
        packCostUsd: 5.99,
        videoDurationSeconds: duration,
        totalCardsFound: 0,
        totalValueUsd: 0,
        cards: [],
        createdAt: new Date().toISOString()
      };

      // Extract sample frames across the video duration
      const sampleTimes = [duration * 0.15, duration * 0.4, duration * 0.65, duration * 0.85];
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const foundCards: PokemonCard[] = [];

      for (let i = 0; i < sampleTimes.length; i++) {
        const time = sampleTimes[i];
        setProcessingStatus(`Analizando carta ${i + 1} de ${sampleTimes.length} con IA...`);

        try {
          video.currentTime = time;
          await new Promise(r => {
            video.onseeked = r;
          });

          canvas.width = video.videoWidth || 640;
          canvas.height = video.videoHeight || 360;
          ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
          const base64 = canvas.toDataURL('image/jpeg', 0.8);

          const response = await fetch('/api/analyze-frame', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              imageBase64: base64,
              timestamp: Number(time.toFixed(1)),
              apiKey: apiKey
            })
          });

          if (response.ok) {
            const data = await response.json();
            if (data.card) {
              foundCards.push(data.card);
              onCardDetected(data.card);
            }
          }
        } catch (err) {
          console.error('Frame error:', err);
        }
      }

      newSession.cards = foundCards;
      newSession.totalCardsFound = foundCards.length;
      newSession.totalValueUsd = foundCards.reduce((acc, c) => acc + c.prices.raw, 0);
      newSession.topHitCard = [...foundCards].sort((a, b) => b.prices.raw - a.prices.raw)[0];

      setIsProcessing(false);
      onSessionLoaded(newSession, videoUrl);
    };
  };

  const loadDemo = (demo: OpeningSession) => {
    setIsProcessing(true);
    setProcessingStatus(`Cargando sesión demo: ${demo.title}...`);

    setTimeout(() => {
      setIsProcessing(false);
      onSessionLoaded(demo, null);
    }, 600);
  };

  return (
    <div className="w-full space-y-6">
      {/* Upload Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
        className={`relative group cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
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

          <div>
            <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
              {isProcessing ? processingStatus : 'Sube tu video de apertura de cartas (Pack Opening)'}
            </h3>
            <p className="mt-1 text-sm text-slate-400 max-w-md mx-auto">
              Arrastra y suelta tu archivo de video (MP4, MOV) o haz clic para seleccionarlo. La IA detectará automáticamente cada carta y consultará su valor en el mercado.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-800/80 px-3 py-1 text-xs text-slate-300 border border-slate-700">
              <Film className="h-3.5 w-3.5 text-blue-400" /> MP4 / MOV / WEBM
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-800/80 px-3 py-1 text-xs text-slate-300 border border-slate-700">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Detección Automática de HITS
            </span>
          </div>
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

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {DEMO_SESSIONS.map((demo) => (
            <button
              key={demo.id}
              onClick={() => loadDemo(demo)}
              className="group relative flex items-center justify-between overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-left transition-all hover:border-amber-500/50 hover:bg-slate-800/80 hover:shadow-lg hover:shadow-amber-500/5"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 group-hover:bg-amber-500 group-hover:text-black transition-all">
                  <Play className="h-5 w-5 ml-0.5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors">
                    {demo.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                    <span>{demo.cards.length} cartas detectadas</span>
                    <span>•</span>
                    <span className="font-medium text-emerald-400">
                      Valor: \${demo.totalValueUsd.toFixed(2)} USD
                    </span>
                  </div>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
