'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Header } from '@/components/Header';
import { CategoryNav } from '@/components/CategoryNav';
import { TrendingSetsSection } from '@/components/TrendingSetsSection';
import { HallOfFameSection } from '@/components/HallOfFameSection';
import { VideoUploader } from '@/components/VideoUploader';
import { VideoPlayerWithTimeline } from '@/components/VideoPlayerWithTimeline';
import { CardFeed } from '@/components/CardFeed';
import { RoiSummary } from '@/components/RoiSummary';
import { CardDetailModal } from '@/components/CardDetailModal';
import { ShareSummaryModal } from '@/components/ShareSummaryModal';
import { ApiKeyModal } from '@/components/ApiKeyModal';
import { OpeningSession, UniversalCard, CardCategory, CollectionSet } from '@/types/pokemon';
import { DEMO_SESSIONS } from '@/data/demoSessions';
import { Sparkles, Flame, PlusCircle, Trophy, Zap } from 'lucide-react';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<CardCategory>('all');
  const [session, setSession] = useState<OpeningSession>(DEMO_SESSIONS[0]);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [activeCard, setActiveCard] = useState<UniversalCard | null>(DEMO_SESSIONS[0].cards[4] || null);
  const [inspectedCard, setInspectedCard] = useState<UniversalCard | null>(null);
  const [seekTime, setSeekTime] = useState<number | null>(null);

  // Modals
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [apiKey, setApiKey] = useState<string>('');

  useEffect(() => {
    const saved = localStorage.getItem('hit2u_gemini_key');
    if (saved) setApiKey(saved);
  }, []);

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('hit2u_gemini_key', key);
  };

  const handleCategorySelect = (cat: CardCategory) => {
    setActiveCategory(cat);
    // Switch to a relevant demo session if available
    const matchedDemo = DEMO_SESSIONS.find((s) => s.category === cat);
    if (matchedDemo) {
      handleSessionLoaded(matchedDemo, null);
    }
  };

  const handleSelectCollection = (collection: CollectionSet) => {
    // Switch to a matching demo or prepare a tailored session for that set
    const matched = DEMO_SESSIONS.find((s) => s.category === collection.category);
    if (matched) {
      handleSessionLoaded(matched, null);
    }
  };

  const handleSessionLoaded = (newSession: OpeningSession, newVideoUrl: string | null) => {
    setSession(newSession);
    setVideoUrl(newVideoUrl);
    const top = newSession.topHitCard || newSession.cards[0] || null;
    setActiveCard(top);

    if (newSession.totalValueUsd > 50 || top?.isGodHit) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleCardDetected = (card: UniversalCard) => {
    setSession((prev) => {
      const updatedCards = [...prev.cards, card];
      const totalVal = updatedCards.reduce((acc, c) => acc + c.prices.raw, 0);
      const top = [...updatedCards].sort((a, b) => b.prices.raw - a.prices.raw)[0];

      if (card.isGodHit || card.prices.raw > 50) {
        confetti({
          particleCount: 60,
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

  const handleSelectCard = (card: UniversalCard) => {
    setActiveCard(card);
    setSeekTime(card.detectedTimestamp);
  };

  const handleInspectCard = (card: UniversalCard) => {
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

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-10">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-slate-800 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-indigo-500/10 border border-amber-500/30 px-3.5 py-1 text-xs font-black text-amber-400 mb-3 shadow-lg shadow-amber-500/5">
              <Sparkles className="h-3.5 w-3.5 animate-spin" />
              <span>AI VISION FOR SPORTS CARDS & TRADING CARDS</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Apertura de Sobres con{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-rose-400 to-indigo-400">
                Reconocimiento y Valuación IA
              </span>
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-3xl">
              Sube tus videos o box breaks de <strong className="text-slate-200">Fútbol (Panini/Topps), NBA, MLB, Pokémon TCG y One Piece</strong>. La IA detecta cada carta, números de serie (1/1, /10, /25), autógrafos y calcula su valor de mercado en tiempo real.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                setVideoUrl(null);
                setSession({
                  id: `new-${Date.now()}`,
                  title: 'Nueva Apertura',
                  category: activeCategory,
                  packCostUsd: 15.00,
                  videoDurationSeconds: 30,
                  totalCardsFound: 0,
                  totalValueUsd: 0,
                  cards: [],
                  createdAt: new Date().toISOString()
                });
                setActiveCard(null);
              }}
              className="flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-800/90 px-4 py-3 text-xs font-bold text-slate-200 hover:bg-slate-700 hover:border-slate-600 transition-all shadow-lg"
            >
              <PlusCircle className="h-4 w-4 text-amber-400" />
              Nueva Apertura
            </button>
          </div>
        </div>

        {/* Category Filter Pills Bar */}
        <section>
          <CategoryNav
            activeCategory={activeCategory}
            onSelectCategory={handleCategorySelect}
          />
        </section>

        {/* Video Upload & Analysis Area */}
        <section className="space-y-6">
          <VideoUploader
            onSessionLoaded={handleSessionLoaded}
            onCardDetected={handleCardDetected}
            apiKey={apiKey}
          />
        </section>

        {/* Live Studio Layout */}
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

              {/* Video Player */}
              <VideoPlayerWithTimeline
                videoUrl={videoUrl}
                duration={session.videoDurationSeconds || 30}
                cards={session.cards}
                activeCard={activeCard}
                onSelectCard={handleSelectCard}
                seekTime={seekTime}
              />
            </div>

            {/* Financial ROI Dashboard */}
            <RoiSummary
              session={session}
              onOpenShareModal={() => setIsShareModalOpen(true)}
              onInspectTopHit={handleInspectCard}
            />
          </div>

          {/* Right Column: Detected Cards Stream (5 cols) */}
          <div className="space-y-6 lg:col-span-5">
            <CardFeed
              cards={session.cards}
              activeCard={activeCard}
              onSelectCard={handleSelectCard}
              onInspectCard={handleInspectCard}
            />
          </div>
        </section>

        {/* Trending Sets & Collections Section */}
        <section className="pt-6">
          <TrendingSetsSection
            activeCategory={activeCategory}
            onSelectCollection={handleSelectCollection}
          />
        </section>

        {/* Hall of Fame / Grails Showcase */}
        <section className="pt-6">
          <HallOfFameSection
            activeCategory={activeCategory}
            onInspectCard={handleInspectCard}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-800/80 bg-black/40 py-10 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 space-y-3">
          <p className="font-black text-slate-300 text-sm">
            hit2u<span className="text-amber-400">.store</span> — Sports Cards & TCG AI Pack Valuation Suite
          </p>
          <p className="text-[11px] text-slate-500 max-w-2xl mx-auto">
            Soporte para Fútbol (Panini Prizm, Topps Chrome UCL), NBA, MLB, NFL, Pokémon TCG y One Piece. Precios de mercado sincronizados con TCGPlayer, eBay Sold Listings y PriceCharting.
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
