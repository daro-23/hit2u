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
  marketTrend24h?: number; // percentage change e.g. +4.5%
  tcgplayerUrl?: string;
  pricechartingUrl?: string;
  ebaySoldUrl?: string;
  goldinUrl?: string;
}

export interface UniversalCard {
  id: string;
  category: CardCategory;
  name: string; // e.g. "Lionel Messi", "Victor Wembanyama", "Charizard ex", "Monkey D. Luffy"
  titleExtra?: string; // e.g. "Rookie Card", "Special Illustration Rare", "1/1 Gold Vinyl"
  playerOrCharacter: string;
  teamOrFranchise?: string; // e.g. "Inter Miami CF / Argentina", "San Antonio Spurs", "Los Angeles Dodgers"
  setName: string;
  setSeries?: string;
  year?: string;
  number: string; // e.g. "#199/165", "#136", "RC-01"
  rarity: CardRarity;
  finish: CardFinish;
  isRookie?: boolean;
  isAutographed?: boolean;
  isMemorabiliaPatch?: boolean;
  serialNumberNumbered?: string; // e.g. "01/10", "1/1"
  imageUrl: string;
  hiresImageUrl?: string;
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
  publisher: string; // "Panini", "Topps", "The Pokémon Company", "Bandai"
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

// Backward compatibility alias
export type PokemonCard = UniversalCard;
