'use client';

import React, { useState } from 'react';
import { X, Key, CheckCircle2, AlertCircle, ExternalLink, Sparkles, Loader2, Cpu } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface GeminiApiKeyModalProps {
  apiKey: string;
  onSaveApiKey: (key: string) => void;
  onClose: () => void;
}

export const GeminiApiKeyModal: React.FC<GeminiApiKeyModalProps> = ({
  apiKey,
  onSaveApiKey,
  onClose
}) => {
  const [inputKey, setInputKey] = useState(apiKey);
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3.7-flash');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleTestKey = async () => {
    if (!inputKey.trim()) {
      setTestResult({ success: false, message: 'Por favor ingresa una clave de API.' });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      const ai = new GoogleGenAI({ apiKey: inputKey.trim() });
      const res = await ai.models.generateContent({
        model: selectedModel,
        contents: ['Reply with ONLY the word OK'],
        config: { maxOutputTokens: 10 }
      });

      if (res.text) {
        setTestResult({
          success: true,
          message: `¡Conexión Exitosa con ${selectedModel.toUpperCase()}! 🎉 Listo para OCR de cartas.`
        });
        onSaveApiKey(inputKey.trim());
      } else {
        setTestResult({ success: false, message: 'Error: El modelo no devolvió texto.' });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: `Error al conectar con ${selectedModel}: ${err?.message || 'Verifica tu API key o intenta con gemini-2.5-flash'}`
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveApiKey(inputKey.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
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

        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Key className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Conexión de Google Gemini AI</h3>
            <p className="text-xs text-slate-400">Selecciona tu modelo y prueba la conexión</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Model Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
              <Cpu className="h-3.5 w-3.5 text-amber-400" /> Modelo de Reconocimiento IA
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-xs font-bold text-white focus:border-amber-400 focus:outline-none"
            >
              <option value="gemini-3.7-flash">✨ Gemini 3.7 Flash (Ultra Rápido & Precisión OCR)</option>
              <option value="gemini-3.6-flash">⚡ Gemini 3.6 Flash</option>
              <option value="gemini-3.5-flash">⚡ Gemini 3.5 Flash</option>
              <option value="gemini-2.5-flash">⚡ Gemini 2.5 Flash</option>
              <option value="gemini-2.0-flash">⚡ Gemini 2.0 Flash</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Google Gemini API Key
            </label>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
            />
          </div>

          {testResult && (
            <div className={`rounded-xl p-3 text-xs font-medium flex items-center gap-2 ${
              testResult.success
                ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                : 'bg-rose-500/20 border border-rose-500/40 text-rose-300'
            }`}>
              {testResult.success ? <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" /> : <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />}
              <span>{testResult.message}</span>
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleTestKey}
              disabled={isTesting}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-700 transition-colors"
            >
              {isTesting ? <Loader2 className="h-4 w-4 animate-spin text-amber-400" /> : <Sparkles className="h-4 w-4 text-amber-400" />}
              <span>{isTesting ? 'Probando...' : '⚡ Probar Conexión'}</span>
            </button>

            <button
              type="submit"
              className="flex-1 rounded-xl bg-amber-500 py-2.5 text-xs font-bold text-black hover:bg-amber-400 shadow-lg shadow-amber-500/20 transition-colors"
            >
              Guardar y Usar
            </button>
          </div>

          <div className="rounded-xl bg-slate-900/60 border border-slate-800/80 p-3 text-[11px] text-slate-400 space-y-1">
            <p>
              ¿Aún no tienes tu clave gratuita? Puedes generar una gratis en 30 segundos en Google AI Studio:
            </p>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-amber-400 font-bold hover:underline"
            >
              Obtener Gemini API Key Gratis <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};
