'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Header } from '@/components/Header';
import { VideoUploader } from '@/components/VideoUploader';
import { VideoPlayerWithTimeline } from '@/components/VideoPlayerWithTimeline';
import { CardFeed } from '@/components/CardFeed';
import { RoiSummary } from '@/components/RoiSummary';
import { CardDetailModal } from '@/components/CardDetailModal';
import { ShareSummaryModal } from '@/components/ShareSummaryModal';
import { ApiKeyModal } from '@/components/ApiKeyModal';
import { OpeningSession, PokemonCard } from '@/types/pokemon';
import { DEMO_SESSIONS } from '@/data/demoSessions';
import { Sparkles, Flame, PlusCircle, ArrowUpRight } from 'lucide-react';

export default function Home() {
  // Main session state (defaults to Demo 151 Pack for instant preview)
  const [session, setSession] = useState<OpeningSession>(DEMO_SESSIONS[0]);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [activeCard, setActiveCard] = useState<PokemonCard | null>(DEMO_SESSIONS[0].cards[4] || null);
  const [inspectedCard, setInspectedCard] = useState<PokemonCard | null>(null);
  const [seekTime, setSeekTime] = useState<number | null>(null);

  // Modals
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [apiKey, setApiKey] = useState<string>('');

  // Load API key from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('hit2u_gemini_key');
    if (saved) setApiKey(saved);
  }, []);

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('hit2u_gemini_key', key);
  };

  const handleSessionLoaded = (newSession: OpeningSession, newVideoUrl: string | null) => {
    setSession(newSession);
    setVideoUrl(newVideoUrl);
    const top = newSession.topHitCard || newSession.cards[0] || null;
    setActiveCard(top);

    // Trigger confetti if high value hit found
    if (newSession.totalValueUsd > 50 || top?.isGodHit) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleCardDetected = (card: PokemonCard) => {
    setSession((prev) => {
      const updatedCards = [...prev.cards, card];
      const totalVal = updatedCards.reduce((acc, c) => acc + c.prices.raw, 0);
      const top = [...updatedCards].sort((a, b) => b.prices.raw - a.prices.raw)[0];

      if (card.isGodHit || card.prices.raw > 50) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      }

      return {
        ...prev,
        cards: updatedCards,
        totalCardsFound: updatedCards.length,
        totalValueUsd: totalVal,
        topHitCard: top
      };
    });
  };

  const handleSelectCard = (card: PokemonCard) => {
    setActiveCard(card);
    setSeekTime(card.detectedTimestamp);
  };

  const handleInspectCard = (card: PokemonCard) => {
    setInspectedCard(card);
  };

  const totalPulledValue = session.cards.reduce((acc, c) => acc + c.prices.raw, 0);

  return (
    <div className="min-h-screen bg-[#070a0f] text-slate-100 selection:bg-amber-500 selection:text-black">
      {/* Header */}
      <Header
        onOpenSettings={() => setIsApiKeyModalOpen(true)}
        hasApiKey={Boolean(apiKey)}
        totalCardsDetected={session.cards.length}
        totalValue={totalPulledValue}
      />

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8">
        {/* Hero Tagline */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-xs font-bold text-amber-400 mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Escaneo Multimodal con Inteligencia Artificial</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Aperturas de Pokémon con <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-rose-400 to-indigo-400">Valuación en Vivo</span>
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-2xl">
              Sube tus videos o transmisiones de pack openings. La IA reconoce cada carta, su rareza, número de serie y consulta al instante sus precios en <span className="text-slate-200 font-medium">TCGPlayer, PriceCharting y eBay</span>.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setVideoUrl(null);
                setSession({
                  id: `new-${Date.now()}`,
                  title: 'Nueva Apertura',
                  packCostUsd: 5.99,
                  videoDurationSeconds: 30,
                  totalCardsFound: 0,
                  totalValueUsd: 0,
                  cards: [],
                  createdAt: new Date().toISOString()
                });
                setActiveCard(null);
              }}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-700 hover:border-slate-600 transition-all shadow-md"
            >
              <PlusCircle className="h-4 w-4 text-amber-400" />
              Nueva Apertura
            </button>
          </div>
        </div>

        {/* Video Upload & Analysis Section */}
        <section className="space-y-6">
          <VideoUploader
            onSessionLoaded={handleSessionLoaded}
            onCardDetected={handleCardDetected}
            apiKey={apiKey}
          />
        </section>

        {/* Live Opening Studio Layout */}
        <section className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
          {/* Left Column: Video Player + ROI Summary (7 cols) */}
          <div className="space-y-6 lg:col-span-7">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Flame className="h-5 w-5 text-amber-400" />
                  {session.title}
                </h2>
                <span className="text-xs text-slate-400">
                  {session.cards.length} cartas analizadas
                </span>
              </div>

              {/* Video Player synchronized with timeline */}
              <VideoPlayerWithTimeline
                videoUrl={videoUrl}
                duration={session.videoDurationSeconds || 30}
                cards={session.cards}
                activeCard={activeCard}
                onSelectCard={handleSelectCard}
                seekTime={seekTime}
              />
            </div>

            {/* Financial ROI Summary */}
            <RoiSummary
              session={session}
              onOpenShareModal={() => setIsShareModalOpen(true)}
              onInspectTopHit={handleInspectCard}
            />
          </div>

          {/* Right Column: Card Feed & Hits Stream (5 cols) */}
          <div className="space-y-6 lg:col-span-5">
            <CardFeed
              cards={session.cards}
              activeCard={activeCard}
              onSelectCard={handleSelectCard}
              onInspectCard={handleInspectCard}
            />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-800/80 bg-black/40 py-8 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 space-y-2">
          <p className="font-bold text-slate-400">
            hit2u<span className="text-amber-400">.store</span> — Pokémon TCG AI Valuation & Pack Opening Suite
          </p>
          <p className="text-[11px] text-slate-600">
            Los precios de mercado se sincronizan con TCGPlayer, PriceCharting y ventas de eBay. Pokémon es una marca registrada de Nintendo / Creatures Inc. / GAME FREAK inc.
          </p>
        </div>
      </footer>

      {/* Modals */}
      {inspectedCard && (
        <CardDetailModal
          card={inspectedCard}
          onClose={() => setInspectedCard(null)}
        />
      )}

      {isShareModalOpen && (
        <ShareSummaryModal
          session={session}
          onClose={() => setIsShareModalOpen(false)}
        />
      )}

      {isApiKeyModalOpen && (
        <ApiKeyModal
          apiKey={apiKey}
          onSaveApiKey={handleSaveApiKey}
          onClose={() => setIsApiKeyModalOpen(false)}
        />
      )}
    </div>
  );
}
