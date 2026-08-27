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
  | 'Full Art';

export interface CardPrices {
  raw: number;
  psa9?: number;
  psa10?: number;
  bgs95?: number;
  marketTrend24h?: number;
  tcgplayerUrl?: string;
  pricechartingUrl?: string;
  ebaySoldUrl?: string;
  goldinUrl?: string;
}

export interface UniversalCard {
  id: string;
  category: CardCategory;
  name: string;
  titleExtra?: string;
  playerOrCharacter: string;
  teamOrFranchise?: string;
  setName: string;
  setSeries?: string;
  year?: string;
  number: string;
  rarity: CardRarity;
  finish: CardFinish;
  isRookie?: boolean;
  isAutographed?: boolean;
  isMemorabiliaPatch?: boolean;
  serialNumberNumbered?: string; // e.g. "43/49", "01/10", "1/1"
  imageUrl: string; // Active cover photo (stock art or custom)
  hiresImageUrl?: string;
  videoSnapshotUrl?: string; // Original frame snapshot captured from video
  studioStockImageUrl?: string; // High-res internet promotional image
  galleryImages?: string[]; // Multiple photos for card integrity (Front, Back, Corners, Surface)
  notes?: string;
  prices: CardPrices;
  detectedTimestamp: number;
  confidenceScore: number;
  isHit: boolean;
  isGodHit?: boolean;
  artist?: string;
  hp?: string;
  types?: string[];
}

export interface CollectionSet {
  id: string;
  category: CardCategory;
  name: string;
  publisher: string;
  year: string;
  iconName?: string;
  bannerGradient: string;
  totalCards: number;
  avgPackPriceUsd: number;
  estimatedSetRoi: string;
  topChaseCard: string;
  topChaseValueUsd: number;
  chaseCardImage: string;
  tags: string[];
}

export interface OpeningSession {
  id: string;
  userId?: string;
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

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  tier: 'free' | 'pro' | 'vip';
  avatarUrl?: string;
  createdAt: string;
  savedSessions: OpeningSession[];
  portfolioCards: UniversalCard[];
}

export type PokemonCard = UniversalCard;
