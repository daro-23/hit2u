'use client';

import React, { useState, useRef } from 'react';
import { X, ExternalLink, Award, Flame, Shield, TrendingUp, Sparkles, DollarSign, Camera, Image as ImageIcon, Plus, Check, Edit2, Save, Trash2, Search, Link2 } from 'lucide-react';
import { UniversalCard } from '@/types/pokemon';

interface CardDetailModalProps {
  card: UniversalCard | null;
  onUpdateCard?: (updatedCard: UniversalCard) => void;
  onClose: () => void;
}

export const CardDetailModal: React.FC<CardDetailModalProps> = ({ card, onUpdateCard, onClose }) => {
  const [currentCard, setCurrentCard] = useState<UniversalCard | null>(card);
  const [activeTab, setActiveTab] = useState<'valuation' | 'integrity' | 'edit'>('valuation');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customUrl, setCustomUrl] = useState('');

  // Editable fields
  const [editName, setEditName] = useState(card?.name || '');
  const [editSet, setEditSet] = useState(card?.setName || '');
  const [editSerial, setEditSerial] = useState(card?.serialNumberNumbered || '');
  const [editPrice, setEditPrice] = useState(card?.prices.raw || 25);
  const [editNotes, setEditNotes] = useState(card?.notes || '');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  if (!currentCard) return null;

  const rawPrice = currentCard.prices.raw;
  const psa9Price = currentCard.prices.psa9 || Number((rawPrice * 1.35).toFixed(2));
  const psa10Price = currentCard.prices.psa10 || Number((rawPrice * 2.85).toFixed(2));

  const handleSaveEdits = () => {
    const updated: UniversalCard = {
      ...currentCard,
      name: editName,
      playerOrCharacter: editName,
      setName: editSet,
      serialNumberNumbered: editSerial || undefined,
      notes: editNotes,
      prices: {
        ...currentCard.prices,
        raw: editPrice,
        psa9: Number((editPrice * 1.35).toFixed(2)),
        psa10: Number((editPrice * 2.85).toFixed(2)),
        ebaySoldUrl: `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(editName + ' ' + editSet + ' sold')}`,
        pricechartingUrl: `https://www.pricecharting.com/search-products?q=${encodeURIComponent(editName)}`
      }
    };
    setCurrentCard(updated);
    if (onUpdateCard) onUpdateCard(updated);
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          const newUrl = ev.target.result as string;
          const updated: UniversalCard = {
            ...currentCard,
            imageUrl: newUrl,
            hiresImageUrl: newUrl
          };
          setCurrentCard(updated);
          if (onUpdateCard) onUpdateCard(updated);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrl.trim()) {
      const updated: UniversalCard = {
        ...currentCard,
        imageUrl: customUrl.trim(),
        hiresImageUrl: customUrl.trim()
      };
      setCurrentCard(updated);
      setCustomUrl('');
      setShowUrlInput(false);
      if (onUpdateCard) onUpdateCard(updated);
    }
  };

  const handleAddGalleryPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          const newPhoto = ev.target.result as string;
          const updatedGallery = [...(currentCard.galleryImages || []), newPhoto];
          const updated: UniversalCard = {
            ...currentCard,
            galleryImages: updatedGallery
          };
          setCurrentCard(updated);
          if (onUpdateCard) onUpdateCard(updated);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSetAsCover = (imgUrl: string) => {
    const updated: UniversalCard = {
      ...currentCard,
      imageUrl: imgUrl
    };
    setCurrentCard(updated);
    if (onUpdateCard) onUpdateCard(updated);
  };

  const handleDeleteGalleryPhoto = (index: number) => {
    const updatedGallery = (currentCard.galleryImages || []).filter((_, i) => i !== index);
    const updated: UniversalCard = {
      ...currentCard,
      galleryImages: updatedGallery
    };
    setCurrentCard(updated);
    if (onUpdateCard) onUpdateCard(updated);
  };

  const googleImageSearchUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(currentCard.name + ' ' + currentCard.setName + ' card')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-700 bg-[#0d121c] p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Top Mode Tabs */}
        <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('valuation')}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
              activeTab === 'valuation'
                ? 'bg-amber-500 text-black shadow'
                : 'text-slate-400 hover:text-white bg-slate-900/60'
            }`}
          >
            <Award className="h-3.5 w-3.5" /> Ficha de Valuación PSA
          </button>
          <button
            onClick={() => setActiveTab('integrity')}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
              activeTab === 'integrity'
                ? 'bg-amber-500 text-black shadow'
                : 'text-slate-400 hover:text-white bg-slate-900/60'
            }`}
          >
            <Camera className="h-3.5 w-3.5" /> Galería de Integridad & Fotos ({currentCard.galleryImages?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('edit')}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
              activeTab === 'edit'
                ? 'bg-amber-500 text-black shadow'
                : 'text-slate-400 hover:text-white bg-slate-900/60'
            }`}
          >
            <Edit2 className="h-3.5 w-3.5" /> Editar Datos / Nombre
          </button>
        </div>

        {activeTab === 'valuation' && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* PSA Slab Preview */}
            <div className="flex flex-col items-center">
              <div className="psa-slab-frame relative flex flex-col items-center rounded-2xl p-3 shadow-2xl holo-shimmer w-full max-w-[280px]">
                {/* PSA Header Label */}
                <div className="mb-2 w-full rounded-lg border border-red-500/40 bg-red-950/40 px-2 py-1.5 text-center">
                  <div className="flex items-center justify-between text-[10px] font-black tracking-wider text-red-400 uppercase">
                    <span>PSA GRADING AUTH</span>
                    <span>GEM MT 10</span>
                  </div>
                  <div className="truncate text-xs font-bold text-white mt-0.5">
                    {currentCard.name}
                  </div>
                  {currentCard.serialNumberNumbered && (
                    <div className="text-[9px] font-bold text-amber-300">
                      ★ SERIAL #{currentCard.serialNumberNumbered}
                    </div>
                  )}
                </div>

                {/* Card Image Display */}
                <div className="relative group w-full overflow-hidden rounded-xl bg-slate-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentCard.imageUrl}
                    alt={currentCard.name}
                    className="w-full max-h-[340px] object-contain rounded-xl shadow-lg transition-transform group-hover:scale-105"
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-xs font-bold text-white cursor-pointer"
                  >
                    <Camera className="h-6 w-6 text-amber-400 mb-1" />
                    <span>Cambiar Foto Portada</span>
                  </div>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleCoverUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              {/* Photo Actions */}
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1 text-[11px] font-bold text-slate-300 hover:text-amber-400 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700"
                >
                  <Camera className="h-3 w-3 text-amber-400" /> Subir Foto Local
                </button>
                <a
                  href={googleImageSearchUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-[11px] font-bold text-blue-400 hover:underline bg-blue-950/40 px-2.5 py-1 rounded-lg border border-blue-800/60"
                >
                  <Search className="h-3 w-3" /> Buscar Arte Oficial en Google
                </a>
                <button
                  onClick={() => setShowUrlInput(!showUrlInput)}
                  className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:underline bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-800/60"
                >
                  <Link2 className="h-3 w-3" /> Pegar Link de Imagen
                </button>
              </div>

              {showUrlInput && (
                <form onSubmit={handleApplyCustomUrl} className="w-full mt-2 flex gap-1.5">
                  <input
                    type="url"
                    placeholder="https://... imagen de la carta"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-amber-500 px-3 py-1 text-xs font-bold text-black hover:bg-amber-400"
                  >
                    Aplicar
                  </button>
                </form>
              )}
            </div>

            {/* Market Prices & Details */}
            <div className="flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-bold text-amber-400 border border-amber-500/20">
                    {currentCard.setName}
                  </span>
                  <span className="font-mono text-xs text-slate-400">{currentCard.number}</span>
                </div>

                <div className="flex items-center justify-between mt-1">
                  <h2 className="text-2xl font-black text-white">{currentCard.name}</h2>
                  <button
                    onClick={() => setActiveTab('edit')}
                    className="flex items-center gap-1 text-xs text-amber-400 hover:underline font-semibold"
                  >
                    <Edit2 className="h-3 w-3" /> Editar
                  </button>
                </div>

                {currentCard.teamOrFranchise && (
                  <p className="text-xs text-slate-400">{currentCard.teamOrFranchise}</p>
                )}

                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="rounded-lg bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-300">
                    {currentCard.rarity}
                  </span>
                  <span className="rounded-lg bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-300">
                    {currentCard.finish}
                  </span>
                  {currentCard.serialNumberNumbered && (
                    <span className="rounded-lg bg-amber-500/20 border border-amber-400/40 px-2.5 py-1 text-xs font-extrabold text-amber-300">
                      ★ {currentCard.serialNumberNumbered}
                    </span>
                  )}
                  {currentCard.isRookie && (
                    <span className="rounded-lg bg-rose-500/20 border border-rose-500/40 px-2.5 py-1 text-xs font-bold text-rose-300">
                      ROOKIE (RC)
                    </span>
                  )}
                </div>
              </div>

              {/* Price Matrix */}
              <div className="space-y-2 rounded-2xl bg-slate-900/90 border border-slate-800 p-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Award className="h-4 w-4 text-amber-400" />
                  Matriz de Precios de Mercado
                </span>

                <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                  <div className="rounded-xl bg-slate-800/80 p-2.5 border border-slate-700">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Raw / Near Mint</span>
                    <div className="text-sm font-extrabold text-amber-400 mt-0.5">
                      \${rawPrice.toFixed(2)}
                    </div>
                  </div>
                  <div className="rounded-xl bg-slate-800/80 p-2.5 border border-slate-700">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">PSA 9 Mint</span>
                    <div className="text-sm font-extrabold text-blue-400 mt-0.5">
                      \${psa9Price.toFixed(2)}
                    </div>
                  </div>
                  <div className="rounded-xl bg-slate-800/80 p-2.5 border border-amber-500/30 bg-amber-500/5">
                    <span className="text-[10px] text-amber-300 uppercase font-bold">PSA 10 Gem Mint</span>
                    <div className="text-sm font-black text-emerald-400 mt-0.5">
                      \${psa10Price.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              {/* External Market Links */}
              <div className="flex flex-col gap-2 pt-1">
                <span className="text-[11px] font-semibold text-slate-400">
                  Verificar ventas y compras en vivo:
                </span>
                <div className="flex flex-wrap gap-2">
                  {currentCard.prices.ebaySoldUrl && (
                    <a
                      href={currentCard.prices.ebaySoldUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-amber-600/20 border border-amber-500/40 px-3 py-2 text-xs font-bold text-amber-300 hover:bg-amber-600/30 transition-colors"
                    >
                      eBay Sold Listings <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                  {currentCard.prices.pricechartingUrl && (
                    <a
                      href={currentCard.prices.pricechartingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-600/20 border border-emerald-500/40 px-3 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-600/30 transition-colors"
                    >
                      PriceCharting <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Integrity & Multi-Photo Gallery */}
        {activeTab === 'integrity' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Galería de Integridad Física</h3>
                <p className="text-xs text-slate-400">
                  Sube fotos del reverso, esquinas y superficie para demostrar la autenticidad y condición de tu carta
                </p>
              </div>

              <button
                onClick={() => galleryInputRef.current?.click()}
                className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-3.5 py-2 text-xs font-bold text-black hover:bg-amber-400 transition-colors"
              >
                <Plus className="h-4 w-4" /> Agregar Foto
              </button>
              <input
                type="file"
                ref={galleryInputRef}
                onChange={handleAddGalleryPhoto}
                accept="image/*"
                className="hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {/* Cover photo slot */}
              <div className="relative group rounded-2xl border-2 border-amber-400 overflow-hidden bg-slate-900 p-1 flex flex-col items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentCard.imageUrl}
                  alt="Cover"
                  className="h-36 w-full object-contain rounded-xl"
                />
                <span className="absolute top-2 left-2 rounded bg-amber-400 text-black px-1.5 py-0.5 text-[9px] font-black uppercase">
                  Portada
                </span>
              </div>

              {/* Gallery photos */}
              {(currentCard.galleryImages || []).map((img, idx) => (
                <div
                  key={idx}
                  className="relative group rounded-2xl border border-slate-700 overflow-hidden bg-slate-900 p-1 flex flex-col items-center"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt={`Integrity ${idx + 1}`}
                    className="h-36 w-full object-contain rounded-xl"
                  />

                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-2">
                    <button
                      onClick={() => handleSetAsCover(img)}
                      className="w-full rounded-lg bg-amber-500 py-1 text-[10px] font-bold text-black hover:bg-amber-400"
                    >
                      Poner como Portada
                    </button>
                    <button
                      onClick={() => handleDeleteGalleryPhoto(idx)}
                      className="w-full flex items-center justify-center gap-1 rounded-lg bg-rose-600/80 py-1 text-[10px] font-bold text-white hover:bg-rose-600"
                    >
                      <Trash2 className="h-3 w-3" /> Eliminar
                    </button>
                  </div>
                </div>
              ))}

              {/* Add slot */}
              <div
                onClick={() => galleryInputRef.current?.click()}
                className="flex flex-col items-center justify-center h-36 rounded-2xl border-2 border-dashed border-slate-700 bg-slate-900/50 hover:border-amber-400/60 hover:bg-slate-900 cursor-pointer text-slate-400 hover:text-amber-400 transition-all text-center p-3"
              >
                <Camera className="h-6 w-6 mb-1" />
                <span className="text-xs font-semibold">+ Reverso / Esquina</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Edit Card Data */}
        {activeTab === 'edit' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-white">Editar Información de la Carta</h3>
              <p className="text-xs text-slate-400">
                Ajusta el nombre del jugador, colección, número de serie o precio
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre / Jugador</label>
                <input
                  type="text"
                  value={editName}
                  placeholder="Ej. Cristiano Ronaldo, Chancel Mbemba, Folarin Balogun"
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Colección / Set</label>
                <input
                  type="text"
                  value={editSet}
                  placeholder="Ej. Panini Prizm Soccer, Topps Chrome UCL"
                  onChange={(e) => setEditSet(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Número de Serie (ej. 43/49, 1/1)</label>
                <input
                  type="text"
                  value={editSerial}
                  placeholder="Ej. 43/49"
                  onChange={(e) => setEditSerial(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Precio Raw Estimado (USD)</label>
                <input
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(parseFloat(e.target.value) || 0)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">Notas de Integridad / Condición</label>
                <textarea
                  value={editNotes}
                  placeholder="Ej. Centrado 55/45, esquinas nítidas sin blanqueamiento, lista para enviar a PSA."
                  onChange={(e) => setEditNotes(e.target.value)}
                  rows={2}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            <button
              onClick={handleSaveEdits}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 text-xs font-black text-black hover:bg-amber-400 shadow-lg shadow-amber-500/20 transition-all"
            >
              <Save className="h-4 w-4" /> Guardar Cambios en la Carta
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
