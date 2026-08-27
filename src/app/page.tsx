'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Header } from '@/components/Header';
import { ThemeBackground } from '@/components/ThemeBackground';
import { CategoryNav } from '@/components/CategoryNav';
import { TrendingSetsSection } from '@/components/TrendingSetsSection';
import { HallOfFameSection } from '@/components/HallOfFameSection';
import { SubscriptionSection } from '@/components/SubscriptionSection';
import { VideoUploader } from '@/components/VideoUploader';
import { VideoPlayerWithTimeline } from '@/components/VideoPlayerWithTimeline';
import { CardFeed } from '@/components/CardFeed';
import { RoiSummary } from '@/components/RoiSummary';
import { CardDetailModal } from '@/components/CardDetailModal';
import { ShareSummaryModal } from '@/components/ShareSummaryModal';
import { AuthModal } from '@/components/AuthModal';
import { GeminiApiKeyModal } from '@/components/GeminiApiKeyModal';
import { OpeningSession, UniversalCard, CardCategory, CollectionSet, UserProfile } from '@/types/pokemon';
import { DEMO_SESSIONS } from '@/data/demoSessions';
import { UserAuthService } from '@/lib/userAuthService';
import { Sparkles, Flame, PlusCircle, CheckCircle2 } from 'lucide-react';

export default function Home() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [activeCategory, setActiveCategory] = useState<CardCategory>('all');
  const [session, setSession] = useState<OpeningSession>(DEMO_SESSIONS[0]);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [activeCard, setActiveCard] = useState<UniversalCard | null>(DEMO_SESSIONS[0].cards[4] || null);
  const [inspectedCard, setInspectedCard] = useState<UniversalCard | null>(null);
  const [seekTime, setSeekTime] = useState<number | null>(null);

  // User Auth & Key Management
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [geminiApiKey, setGeminiApiKey] = useState<string>('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  useEffect(() => {
    const user = UserAuthService.getCurrentUser();
    if (user) setCurrentUser(user);

    const savedTheme = localStorage.getItem('hit2u_theme_mode') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }

    const savedKey = localStorage.getItem('hit2u_gemini_api_key');
    if (savedKey) {
      setGeminiApiKey(savedKey);
    }
  }, []);

  const handleSaveApiKey = (key: string) => {
    setGeminiApiKey(key);
    localStorage.setItem('hit2u_gemini_api_key', key);
    setSaveToast('¡Clave de Google Gemini AI guardada y conectada!');
    setTimeout(() => setSaveToast(null), 3500);
  };

  const handleToggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('hit2u_theme_mode', nextTheme);
  };

  const handleCategorySelect = (cat: CardCategory) => {
    setActiveCategory(cat);
    const matchedDemo = DEMO_SESSIONS.find((s) => s.category === cat);
    if (matchedDemo) {
      handleSessionLoaded(matchedDemo, null);
    }
  };

  const handleSelectCollection = (collection: CollectionSet) => {
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

    if (currentUser && newSession.cards.length > 0) {
      UserAuthService.saveSession(newSession);
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

      const updatedSession = {
        ...prev,
        cards: updatedCards,
        totalCardsFound: updatedCards.length,
        totalValueUsd: totalVal,
        topHitCard: top
      };

      if (currentUser) {
        UserAuthService.saveSession(updatedSession);
      }

      return updatedSession;
    });
  };

  const handleSelectCard = (card: UniversalCard) => {
    setActiveCard(card);
    setSeekTime(card.detectedTimestamp);
  };

  const handleInspectCard = (card: UniversalCard) => {
    setInspectedCard(card);
  };

  const handleUpdateCard = (updatedCard: UniversalCard) => {
    setSession((prev) => {
      const newCards = prev.cards.map((c) => (c.id === updatedCard.id ? updatedCard : c));
      const newTop = prev.topHitCard?.id === updatedCard.id ? updatedCard : prev.topHitCard;
      const newTotal = newCards.reduce((acc, c) => acc + c.prices.raw, 0);

      const updatedSession = {
        ...prev,
        cards: newCards,
        topHitCard: newTop,
        totalValueUsd: newTotal
      };

      if (currentUser) {
        UserAuthService.updateCard(updatedCard.id, updatedCard);
      }

      return updatedSession;
    });

    if (activeCard?.id === updatedCard.id) {
      setActiveCard(updatedCard);
    }
    setInspectedCard(updatedCard);
  };

  const handleSaveCurrentSession = () => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    const updatedUser = UserAuthService.saveSession(session);
    if (updatedUser) {
      setCurrentUser(updatedUser);
      setSaveToast('¡Apertura y fotos guardadas con éxito en tu cuenta!');
      setTimeout(() => setSaveToast(null), 3500);
    }
  };

  const handleLoadSavedSession = (savedSession: OpeningSession) => {
    setSession(savedSession);
    setVideoUrl(null);
    setActiveCard(savedSession.topHitCard || savedSession.cards[0] || null);
  };

  const totalPulledValue = session.cards.reduce((acc, c) => acc + c.prices.raw, 0);
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen relative transition-colors duration-400 ${
      isDark
        ? 'theme-dark bg-[#070a0f] text-slate-100 selection:bg-amber-500 selection:text-black'
        : 'theme-light bg-[#f8fafc] text-slate-900 selection:bg-amber-400 selection:text-black'
    }`}>
      {/* Subtle SVG Relief Watermark Background */}
      <ThemeBackground theme={theme} />

      {/* Header */}
      <Header
        user={currentUser}
        theme={theme}
        hasApiKey={Boolean(geminiApiKey)}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onToggleTheme={handleToggleTheme}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onSaveCurrentSession={handleSaveCurrentSession}
        hasUnsavedSession={session.cards.length > 0}
        totalCardsDetected={session.cards.length}
        totalValue={totalPulledValue}
      />

      {/* Main Content */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-10">
        {/* Save Toast Notification */}
        {saveToast && (
          <div className="flex items-center justify-between rounded-2xl border border-emerald-500/40 bg-emerald-950/85 px-4 py-3 text-xs font-bold text-emerald-300 shadow-xl backdrop-blur-md animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>{saveToast}</span>
            </div>
            <button onClick={() => setSaveToast(null)} className="text-emerald-400 hover:text-white">
              Cerrar
            </button>
          </div>
        )}

        {/* Hero Section */}
        <div className={`flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b pb-8 transition-colors ${
          isDark ? 'border-slate-800' : 'border-slate-200'
        }`}>
          <div>
            <div className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-black mb-3 shadow-sm ${
              isDark
                ? 'bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-indigo-500/10 border-amber-500/30 text-amber-400'
                : 'bg-amber-50 border-amber-300 text-amber-800'
            }`}>
              <Sparkles className="h-3.5 w-3.5 animate-spin" />
              <span>AI VISION FOR SPORTS CARDS & TRADING CARDS</span>
            </div>
            <h1 className={`text-3xl sm:text-5xl font-black tracking-tight leading-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Apertura de Sobres con{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500">
                Reconocimiento y Valuación IA
              </span>
            </h1>
            <p className={`mt-3 text-sm sm:text-base max-w-3xl font-medium ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Sube tus videos o box breaks de <strong className={isDark ? 'text-slate-200' : 'text-slate-900'}>Fútbol (Panini/Topps), NBA, MLB, Pokémon TCG y One Piece</strong>. La IA detecta cada carta, números de serie (1/1, /49, /10), autógrafos y calcula su valor de mercado en tiempo real.
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
              className={`flex items-center gap-2 rounded-2xl border px-4 py-3 text-xs font-bold transition-all shadow-md ${
                isDark
                  ? 'border-slate-700 bg-slate-800/90 text-slate-200 hover:bg-slate-700 hover:border-slate-600'
                  : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50 hover:border-slate-400'
              }`}
            >
              <PlusCircle className="h-4 w-4 text-amber-500" />
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
            apiKey={geminiApiKey}
            onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
            onSessionLoaded={handleSessionLoaded}
            onCardDetected={handleCardDetected}
          />
        </section>

        {/* Live Studio Layout */}
        <section className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
          {/* Left Column: Video Player + ROI Summary (7 cols) */}
          <div className="space-y-6 lg:col-span-7">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <Flame className="h-5 w-5 text-amber-500" />
                  {session.title}
                </h2>
                <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
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

        {/* Subscription & VIP Club Section */}
        <section className="pt-6">
          <SubscriptionSection />
        </section>
      </main>

      {/* Footer */}
      <footer className={`mt-20 border-t py-10 text-center text-xs transition-colors ${
        isDark
          ? 'border-slate-800/80 bg-black/50 text-slate-500'
          : 'border-slate-200 bg-slate-100 text-slate-600'
      }`}>
        <div className="mx-auto max-w-7xl px-4 space-y-3">
          <p className={`font-black text-sm ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
            hit2u<span className="text-amber-500">.store</span> — Sports Cards & TCG AI Pack Valuation Suite
          </p>
          <p className={`text-[11px] max-w-2xl mx-auto ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
            Soporte para Fútbol (Panini Prizm, Topps Chrome UCL), NBA, MLB, NFL, Pokémon TCG y One Piece. Precios de mercado sincronizados con TCGPlayer, eBay Sold Listings y PriceCharting.
          </p>
        </div>
      </footer>

      {/* Modals */}
      {inspectedCard && (
        <CardDetailModal
          card={inspectedCard}
          onUpdateCard={handleUpdateCard}
          onClose={() => setInspectedCard(null)}
        />
      )}

      {isShareModalOpen && (
        <ShareSummaryModal
          session={session}
          onClose={() => setIsShareModalOpen(false)}
        />
      )}

      {isAuthModalOpen && (
        <AuthModal
          user={currentUser}
          onUserChanged={setCurrentUser}
          onLoadSavedSession={handleLoadSavedSession}
          onClose={() => setIsAuthModalOpen(false)}
        />
      )}

      {isApiKeyModalOpen && (
        <GeminiApiKeyModal
          apiKey={geminiApiKey}
          onSaveApiKey={handleSaveApiKey}
          onClose={() => setIsApiKeyModalOpen(false)}
        />
      )}
    </div>
  );
}
