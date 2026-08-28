export type CardCategory =
  | 'all'
  | 'pokemon'
  | 'soccer'
  | 'nba'
  | 'mlb'
  | 'nfl'
  | 'onepiece'
  | 'magic';

export type CardRarity =
  | 'Common'
  | 'Uncommon'
  | 'Rare'
  | 'Base Card'
  | 'Ultra Rare'
  | 'Illustration Rare'
  | 'Special Illustration Rare'
  | 'Manga Rare'
  | 'Rookie Card (RC)'
  | '1/1 Superfractor'
  | 'Numbered Parallel'
  | 'Autograph Patch (RPA)'
  | 'Silver Prizm'
  | 'Gold Prizm /10'
  | 'Scorers Club'
  | 'Kaboom!'
  | 'Downtown'
  | 'Vintage Holo';

export type CardFinish =
  | 'Normal'
  | 'Holo'
  | 'Reverse Holo'
  | 'Refractor'
  | 'Silver Prizm'
  | 'Gold /10'
  | 'Numbered /49'
  | '1-of-1'
  | 'On-Card Auto'
  | 'Relic Patch'
  | 'Secret Art'
  | 'Full Art'
  | 'Base Card'
  | 'Red Prizm Parallel'
  | 'Green Wave Prizm';

export interface CardPrices {
  raw: number;
  psa9: number;
  psa10: number;
  marketTrend24h: number;
  tcgplayerUrl?: string;
  ebaySoldUrl?: string;
  pricechartingUrl?: string;
}

export interface UniversalCard {
  id: string;
  name: string;
  category: CardCategory;
  setName: string;
  setSeries?: string;
  number: string;
  rarity: CardRarity;
  finish: CardFinish;
  playerOrCharacter?: string;
  teamOrFranchise?: string;
  imageUrl: string;
  hiresImageUrl?: string;
  studioStockImageUrl?: string;
  videoSnapshotUrl?: string;
  detectedTimestamp: number;
  confidenceScore: number;
  isHit: boolean;
  isGodHit?: boolean;
  isRookie?: boolean;
  isAutographed?: boolean;
  serialNumberNumbered?: string;
  galleryImages?: string[];
  notes?: string;
  prices: CardPrices;
  extraPhotos?: string[];
}

export type PokemonCard = UniversalCard;

export interface OpeningSession {
  id: string;
  title: string;
  category: CardCategory;
  packCostUsd: number;
  videoDurationSeconds: number;
  totalCardsFound: number;
  totalValueUsd: number;
  topHitCard?: UniversalCard;
  cards: UniversalCard[];
  createdAt: string;
}

export interface CollectionSet {
  id: string;
  name: string;
  category: CardCategory;
  publisher?: string;
  year?: number | string;
  releaseYear?: number;
  totalCards: number;
  coverImageUrl?: string;
  topCardName?: string;
  topCardValueUsd?: number;
  topChaseCard?: string;
  topChaseValueUsd?: number;
  chaseCardImage?: string;
  avgPackPriceUsd?: number;
  estimatedSetRoi?: string;
  tags?: string[];
  bannerGradient?: string;
  isTrending?: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  plan?: 'free' | 'pro' | 'vip';
  tier?: 'Free Tier' | 'PRO Collector' | 'VIP Vault' | 'free' | 'pro' | 'vip';
  savedSessions: OpeningSession[];
  favoriteCards: UniversalCard[];
  portfolioCards?: UniversalCard[];
  createdAt: string;
}
