'use client';

import React, { useState } from 'react';
import { X, Key, ShieldCheck, ExternalLink, Sparkles, Check } from 'lucide-react';

interface ApiKeyModalProps {
  apiKey: string;
  onSaveApiKey: (key: string) => void;
  onClose: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  apiKey,
  onSaveApiKey,
  onClose
}) => {
  const [inputKey, setInputKey] = useState(apiKey);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveApiKey(inputKey.trim());
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-700 bg-[#0d121c] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Key className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Configuración de Gemini AI Vision</h3>
            <p className="text-xs text-slate-400">Para escaneo de cartas en tiempo real</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Google Gemini API Key (Opcional)
            </label>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
            <p className="mt-1.5 text-[11px] text-slate-400">
              Tu clave se guarda únicamente de forma local en tu navegador. Si no ingresas una clave, el sistema utilizará el motor de catálogo inteligente y las sesiones demo.
            </p>
          </div>

          <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-3 text-xs text-slate-300 space-y-1.5">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <ShieldCheck className="h-4 w-4" /> ¿Cómo obtener una clave gratuita?
            </div>
            <p className="text-[11px] text-slate-400">
              Puedes generar una clave gratis en Google AI Studio con alta cuota de peticiones por minuto.
            </p>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:underline pt-0.5"
            >
              Obtener Gemini API Key en Google AI Studio <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-700 bg-slate-800 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-amber-500 py-2.5 text-xs font-bold text-black hover:bg-amber-400 shadow-lg shadow-amber-500/20 transition-colors"
            >
              {saved ? <Check className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
              {saved ? '¡Guardado!' : 'Guardar Clave'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
