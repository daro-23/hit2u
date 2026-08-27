export type CardRarity =
  | 'Common'
  | 'Uncommon'
  | 'Rare'
  | 'Rare Holo'
  | 'Double Rare'
  | 'Ultra Rare'
  | 'Illustration Rare'
  | 'Special Illustration Rare'
  | 'Hyper Rare'
  | 'Secret Rare'
  | 'Promo'
  | 'Vintage Holo';

export type CardFinish = 'Normal' | 'Holo' | 'Reverse Holo' | 'Full Art' | 'Rainbow' | 'Gold' | 'Secret Art';

export interface CardPrices {
  raw: number;
  psa9?: number;
  psa10?: number;
  marketTrend24h?: number; // percentage change e.g. +4.5%
  tcgplayerUrl?: string;
  pricechartingUrl?: string;
  ebaySoldUrl?: string;
}

export interface PokemonCard {
  id: string;
  name: string;
  supertype: 'Pokémon' | 'Trainer' | 'Energy';
  subtypes?: string[];
  setName: string;
  setSeries: string;
  setLogoUrl?: string;
  setSymbolUrl?: string;
  number: string;
  rarity: CardRarity;
  finish: CardFinish;
  imageUrl: string;
  hiresImageUrl?: string;
  prices: CardPrices;
  detectedTimestamp: number; // in seconds
  confidenceScore: number; // 0 to 1
  isHit: boolean; // if value >= threshold or high rarity
  isGodHit?: boolean; // if value >= $80 or SIR chase
  artist?: string;
  hp?: string;
  types?: string[];
}

export interface OpeningSession {
  id: string;
  title: string;
  packCostUsd: number;
  videoDurationSeconds: number;
  totalCardsFound: number;
  totalValueUsd: number;
  topHitCard?: PokemonCard;
  cards: PokemonCard[];
  createdAt: string;
}
