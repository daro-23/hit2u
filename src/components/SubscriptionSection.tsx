'use client';

import React, { useState } from 'react';
import { Sparkles, Check, Flame, Zap, Trophy, ShieldCheck, Video, Award, Gift, ArrowRight, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

export const SubscriptionSection: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [selectedPlan, setSelectedPlan] = useState<string>('pro');
  const [subscribedMessage, setSubscribedMessage] = useState<string | null>(null);

  const handleSubscribe = (planName: string) => {
    setSelectedPlan(planName);
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.8 }
    });
    setSubscribedMessage(`¡Bienvenido al plan ${planName}! Conectando con Stripe / Supabase Checkout...`);
    setTimeout(() => setSubscribedMessage(null), 4000);
  };

  return (
    <div id="subscription-plans" className="space-y-8 rounded-3xl border border-slate-800 bg-gradient-to-b from-[#0e1422] via-[#090d15] to-[#06080e] p-6 sm:p-10 shadow-2xl relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-64 w-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 relative z-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-500/20 px-3.5 py-1 text-xs font-black text-amber-400">
          <Trophy className="h-3.5 w-3.5" />
          <span>HIT2U VIP CLUB & STREAMER SUITE</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Lleva tus Aperturas y Colección al <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-rose-400 to-indigo-400">Siguiente Nivel</span>
        </h2>
        <p className="text-sm sm:text-base text-slate-400">
          Escaneos ilimitados con IA, widgets para streaming en vivo en OBS/TikTok, estimador de notas PSA 10 y participación en cacerías de recompensas (*Bounties*).
        </p>

        {/* Billing toggle */}
        <div className="flex items-center justify-center pt-2">
          <div className="flex items-center rounded-2xl bg-slate-900/90 p-1.5 border border-slate-800 text-xs">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`rounded-xl px-4 py-1.5 font-bold transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-amber-500 text-black shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Facturación Mensual
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`flex items-center gap-1.5 rounded-xl px-4 py-1.5 font-bold transition-all ${
                billingCycle === 'annual'
                  ? 'bg-amber-500 text-black shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Facturación Anual
              <span className="rounded-md bg-emerald-400/20 px-1.5 py-0.2 text-[9px] font-black text-emerald-400 border border-emerald-400/30">
                2 MESES GRATIS
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 relative z-10">
        {/* Tier 1: Collector Free */}
        <div className="rounded-3xl border border-slate-800 bg-[#0d121c]/80 p-6 flex flex-col justify-between transition-all hover:border-slate-700">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Principiante</span>
              <h3 className="text-xl font-bold text-white mt-1">Collector Rookie</h3>
              <p className="text-xs text-slate-400 mt-1">Ideal para probar la IA y escanear tus primeros sobres.</p>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-white">Gratis</span>
              <span className="text-xs text-slate-500">/ para siempre</span>
            </div>

            <div className="space-y-2.5 pt-2 border-t border-slate-800/80 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>10 escaneos de video/foto por mes</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Precios Raw y PSA 10 básicos</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Generador de tarjeta para redes sociales</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Acceso a catálogo de Fútbol, NBA y Pokémon</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleSubscribe('Collector Rookie')}
            className="mt-6 w-full rounded-2xl border border-slate-700 bg-slate-800/80 py-3 text-xs font-bold text-slate-300 hover:bg-slate-700 hover:text-white transition-all"
          >
            Plan Actual (Gratis)
          </button>
        </div>

        {/* Tier 2: Hit PRO (Highlighted) */}
        <div className="rounded-3xl border-2 border-amber-500/80 bg-gradient-to-b from-[#141b2b] to-[#0c121e] p-6 flex flex-col justify-between relative shadow-2xl shadow-amber-500/10 scale-105">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-black shadow-lg">
            MÁS POPULAR PARA COLECCIONISTAS
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400">Coleccionista Activo</span>
              <h3 className="text-xl font-black text-white mt-1">Hit PRO ✨</h3>
              <p className="text-xs text-slate-300 mt-1">Para quienes abren sobres frecuentemente y buscan maximizar su ROI.</p>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-white">
                \${billingCycle === 'annual' ? '7.99' : '9.99'}
              </span>
              <span className="text-xs text-slate-400">USD / mes</span>
            </div>

            <div className="space-y-2.5 pt-2 border-t border-slate-700/80 text-xs text-slate-200">
              <div className="flex items-center gap-2.5 font-medium">
                <Check className="h-4 w-4 text-amber-400 shrink-0" />
                <span><strong>Escaneos ilimitados</strong> con Gemini AI Vision</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-amber-400 shrink-0" />
                <span><strong>PSA Pre-Grade AI Estimator:</strong> Predicción de notas PSA 10 (Centrado 50/50 y Esquinas)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-amber-400 shrink-0" />
                <span>Historial ilimitado de aperturas en la nube</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-amber-400 shrink-0" />
                <span>Alertas en vivo de subida de precio (+20% Spikes)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-amber-400 shrink-0" />
                <span>Exportación de portafolio a Excel / CSV</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleSubscribe('Hit PRO')}
            className="mt-6 w-full rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 py-3.5 text-xs font-black text-black shadow-lg shadow-amber-500/25 hover:opacity-95 transition-opacity"
          >
            Obtener Hit PRO ⚡
          </button>
        </div>

        {/* Tier 3: Breaker VIP & Syndicate */}
        <div className="rounded-3xl border border-indigo-500/40 bg-gradient-to-b from-[#13132b] to-[#0b0c1c] p-6 flex flex-col justify-between transition-all hover:border-indigo-400/80">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-400">Streamers & Box Breakers</span>
              <h3 className="text-xl font-bold text-white mt-1">Breaker VIP Syndicate 👑</h3>
              <p className="text-xs text-slate-400 mt-1">Para streamers de Twitch/TikTok y tiendas de Box Breaks.</p>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-white">
                \${billingCycle === 'annual' ? '24.99' : '29.99'}
              </span>
              <span className="text-xs text-slate-400">USD / mes</span>
            </div>

            <div className="space-y-2.5 pt-2 border-t border-slate-800/80 text-xs text-slate-200">
              <div className="flex items-center gap-2.5 font-medium text-indigo-300">
                <Video className="h-4 w-4 text-indigo-400 shrink-0" />
                <span><strong>Live Stream OBS Overlay:</strong> Detección de cartas en vivo en Twitch/TikTok</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Award className="h-4 w-4 text-indigo-400 shrink-0" />
                <span><strong>Bounty Hunter Club:</strong> Participa por hasta \$5,000 USD mensuales en premios</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Gift className="h-4 w-4 text-indigo-400 shrink-0" />
                <span><strong>Mystery Box Drop VIP:</strong> Descuentos exclusivos en aperturas comunitarias</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="h-4 w-4 text-indigo-400 shrink-0" />
                <span>Envíos masivos a graduación PSA con 20% descuento</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-indigo-400 shrink-0" />
                <span>Soporte prioritario 24/7 y marca personalizada</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleSubscribe('Breaker VIP Syndicate')}
            className="mt-6 w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-500/20 hover:opacity-95 transition-opacity"
          >
            Unirse a Breaker VIP 🚀
          </button>
        </div>
      </div>

      {/* Active Monthly Bounty Event Banner (Gamified Innovation) */}
      <div className="relative overflow-hidden rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-indigo-500/10 p-5 sm:p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 text-black font-black shadow-xl shadow-amber-500/20">
              <Flame className="h-7 w-7 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-amber-400 px-2 py-0.5 text-[9px] font-black text-black uppercase">
                  EVENTO ACTIVO ESTE MES
                </span>
                <span className="text-xs text-slate-400">Finaliza en 14 días</span>
              </div>
              <h4 className="text-lg font-bold text-white mt-1">
                Bounty Hunt: ¡\$2,500 USD en Premios por sacar el 1/1 de Lamine Yamal o Charizard SIR!
              </h4>
              <p className="text-xs text-slate-300">
                Sube tu video de apertura a hit2u.store. Si la IA verifica que sacaste la carta elegida, ¡entras al sorteo del Bounty y caja sellada!
              </p>
            </div>
          </div>

          <button
            onClick={() => handleSubscribe('Hit PRO')}
            className="shrink-0 flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-xs font-black text-black hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
          >
            Participar en el Bounty <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {subscribedMessage && (
        <div className="rounded-xl bg-emerald-500/20 border border-emerald-500/40 p-3 text-center text-xs font-bold text-emerald-300 animate-fadeIn">
          {subscribedMessage}
        </div>
      )}
    </div>
  );
};
