import { UniversalCard, CardCategory } from '@/types/pokemon';

export const UNIVERSAL_CATALOG: Omit<UniversalCard, 'detectedTimestamp' | 'confidenceScore' | 'isHit' | 'isGodHit'>[] = [
  // --- SOCCER / FÚTBOL ---
  {
    id: 'soccer-yamal-rc-1',
    category: 'soccer',
    name: 'Lamine Yamal (Rookie Card Refractor)',
    playerOrCharacter: 'Lamine Yamal',
    teamOrFranchise: 'FC Barcelona / España',
    setName: '2023-24 Topps Chrome UEFA Champions League',
    number: '#98',
    rarity: 'Rookie Card (RC)',
    finish: 'Refractor',
    isRookie: true,
    imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80',
    hiresImageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=90',
    prices: {
      raw: 280.00,
      psa9: 390.00,
      psa10: 1150.00,
      marketTrend24h: 14.2,
      ebaySoldUrl: 'https://www.ebay.com/sch/i.html?_nkw=Lamine+Yamal+topps+chrome+rookie+psa+10+sold',
      pricechartingUrl: 'https://www.pricecharting.com/search-products?q=Lamine+Yamal'
    }
  },
  {
    id: 'soccer-messi-goldin',
    category: 'soccer',
    name: 'Lionel Messi (World Cup Golden Ball Gold /10)',
    playerOrCharacter: 'Lionel Messi',
    teamOrFranchise: 'Inter Miami CF / Argentina',
    setName: '2022 Panini Prizm World Cup Qatar',
    number: '#1',
    rarity: 'Gold Prizm /10',
    finish: 'Gold /10',
    serialNumberNumbered: '07/10',
    imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&auto=format&fit=crop&q=80',
    hiresImageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&auto=format&fit=crop&q=90',
    prices: {
      raw: 3400.00,
      psa9: 4800.00,
      psa10: 12500.00,
      marketTrend24h: 5.8,
      ebaySoldUrl: 'https://www.ebay.com/sch/i.html?_nkw=Lionel+Messi+prizm+world+cup+gold+sold'
    }
  },

  // --- BASKETBALL / NBA ---
  {
    id: 'nba-wemby-prizm-rc',
    category: 'nba',
    name: 'Victor Wembanyama (Silver Prizm RC #136)',
    playerOrCharacter: 'Victor Wembanyama',
    teamOrFranchise: 'San Antonio Spurs',
    setName: '2023-24 Panini Prizm Basketball',
    number: '#136',
    rarity: 'Silver Prizm',
    finish: 'Silver Prizm',
    isRookie: true,
    imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&auto=format&fit=crop&q=80',
    hiresImageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&auto=format&fit=crop&q=90',
    prices: {
      raw: 420.00,
      psa9: 550.00,
      psa10: 1450.00,
      marketTrend24h: 8.7,
      ebaySoldUrl: 'https://www.ebay.com/sch/i.html?_nkw=Victor+Wembanyama+prizm+silver+136+psa+10+sold'
    }
  },
  {
    id: 'nba-lebron-kaboom',
    category: 'nba',
    name: 'LeBron James (Kaboom! Case Hit)',
    playerOrCharacter: 'LeBron James',
    teamOrFranchise: 'Los Angeles Lakers',
    setName: '2023-24 Panini Crown Royale',
    number: '#K-LBJ',
    rarity: 'Kaboom!',
    finish: 'Holo',
    imageUrl: 'https://images.unsplash.com/photo-1519766304817-4f37bda74a29?w=600&auto=format&fit=crop&q=80',
    hiresImageUrl: 'https://images.unsplash.com/photo-1519766304817-4f37bda74a29?w=800&auto=format&fit=crop&q=90',
    prices: {
      raw: 1850.00,
      psa9: 2400.00,
      psa10: 6200.00,
      marketTrend24h: 3.4,
      ebaySoldUrl: 'https://www.ebay.com/sch/i.html?_nkw=LeBron+James+kaboom+psa+10+sold'
    }
  },

  // --- BASEBALL / MLB ---
  {
    id: 'mlb-ohtani-auto',
    category: 'mlb',
    name: 'Shohei Ohtani (50/50 Historic Auto 03/25)',
    playerOrCharacter: 'Shohei Ohtani',
    teamOrFranchise: 'Los Angeles Dodgers',
    setName: '2024 Topps Chrome Baseball',
    number: '#TCA-SO',
    rarity: 'Autograph Patch (RPA)',
    finish: 'On-Card Auto',
    isAutographed: true,
    serialNumberNumbered: '03/25',
    imageUrl: 'https://images.unsplash.com/photo-1508344928928-7165b67de128?w=600&auto=format&fit=crop&q=80',
    hiresImageUrl: 'https://images.unsplash.com/photo-1508344928928-7165b67de128?w=800&auto=format&fit=crop&q=90',
    prices: {
      raw: 2900.00,
      psa9: 3800.00,
      psa10: 9500.00,
      marketTrend24h: 18.9,
      ebaySoldUrl: 'https://www.ebay.com/sch/i.html?_nkw=Shohei+Ohtani+topps+chrome+auto+psa+10+sold'
    }
  },

  // --- POKÉMON TCG ---
  {
    id: 'sv3pt5-199',
    category: 'pokemon',
    name: 'Charizard ex SIR',
    playerOrCharacter: 'Charizard',
    teamOrFranchise: 'Kanto / Pokémon 151',
    setName: 'Scarlet & Violet: 151',
    setSeries: 'Scarlet & Violet',
    number: '199/165',
    rarity: 'Special Illustration Rare',
    finish: 'Secret Art',
    imageUrl: 'https://images.pokemontcg.io/sv3pt5/199.png',
    hiresImageUrl: 'https://images.pokemontcg.io/sv3pt5/199_hires.png',
    prices: {
      raw: 124.50,
      psa9: 145.00,
      psa10: 340.00,
      marketTrend24h: 3.2,
      tcgplayerUrl: 'https://www.tcgplayer.com/search/pokemon/scarlet-and-violet-151?q=Charizard+ex+199',
      pricechartingUrl: 'https://www.pricecharting.com/game/pokemon-scarlet-&-violet-151/charizard-ex-199',
      ebaySoldUrl: 'https://www.ebay.com/sch/i.html?_nkw=Charizard+ex+199+165+151+pokemon+sold'
    }
  },
  {
    id: 'sv4pt5-234',
    category: 'pokemon',
    name: 'Charizard ex Shiny Dark',
    playerOrCharacter: 'Charizard',
    teamOrFranchise: 'Paldea / Paldean Fates',
    setName: 'Paldean Fates',
    setSeries: 'Scarlet & Violet',
    number: '234/091',
    rarity: 'Special Illustration Rare',
    finish: 'Secret Art',
    imageUrl: 'https://images.pokemontcg.io/sv4pt5/234.png',
    hiresImageUrl: 'https://images.pokemontcg.io/sv4pt5/234_hires.png',
    prices: {
      raw: 135.00,
      psa9: 160.00,
      psa10: 390.00,
      marketTrend24h: 6.8,
      tcgplayerUrl: 'https://www.tcgplayer.com/search/pokemon/paldean-fates?q=Charizard+ex+234',
      pricechartingUrl: 'https://www.pricecharting.com/game/pokemon-paldean-fates/charizard-ex-234',
      ebaySoldUrl: 'https://www.ebay.com/sch/i.html?_nkw=Charizard+ex+234+091+paldean+fates+sold'
    }
  },
  {
    id: 'swsh7-215',
    category: 'pokemon',
    name: 'Umbreon VMAX (Moonbreon)',
    playerOrCharacter: 'Umbreon',
    teamOrFranchise: 'Evolving Skies',
    setName: 'Evolving Skies',
    setSeries: 'Sword & Shield',
    number: '215/203',
    rarity: 'Ultra Rare',
    finish: 'Secret Art',
    imageUrl: 'https://images.pokemontcg.io/swsh7/215.png',
    hiresImageUrl: 'https://images.pokemontcg.io/swsh7/215_hires.png',
    prices: {
      raw: 890.00,
      psa9: 980.00,
      psa10: 1650.00,
      marketTrend24h: 12.5,
      tcgplayerUrl: 'https://www.tcgplayer.com/search/pokemon/evolving-skies?q=Umbreon+VMAX+215',
      pricechartingUrl: 'https://www.pricecharting.com/game/pokemon-evolving-skies/umbreon-vmax-215',
      ebaySoldUrl: 'https://www.ebay.com/sch/i.html?_nkw=Umbreon+VMAX+215+203+evolving+skies+sold'
    }
  },

  // --- ONE PIECE TCG ---
  {
    id: 'op05-luffy-manga',
    category: 'onepiece',
    name: 'Monkey D. Luffy (Gear 5 Manga Rare)',
    playerOrCharacter: 'Monkey D. Luffy',
    teamOrFranchise: 'Straw Hat Pirates',
    setName: 'Awakening of the New Era (OP-05)',
    number: 'OP05-119',
    rarity: 'Manga Rare',
    finish: 'Secret Art',
    imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
    hiresImageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=90',
    prices: {
      raw: 3400.00,
      psa9: 4100.00,
      psa10: 7900.00,
      marketTrend24h: 21.0,
      ebaySoldUrl: 'https://www.ebay.com/sch/i.html?_nkw=Luffy+Manga+Rare+OP05+psa+10+sold'
    }
  }
];

export const POKEMON_CATALOG = UNIVERSAL_CATALOG;

export function findCardInCatalog(query: {
  name?: string;
  number?: string;
  set?: string;
  category?: string;
}): (typeof UNIVERSAL_CATALOG)[0] | undefined {
  const norm = (s?: string) => s?.toLowerCase().replace(/[^a-z0-9]/g, '') || '';
  const queryName = norm(query.name);
  const queryNumber = norm(query.number);

  if (queryNumber) {
    const match = UNIVERSAL_CATALOG.find(c => norm(c.number).includes(queryNumber));
    if (match) return match;
  }

  if (queryName) {
    const match = UNIVERSAL_CATALOG.find(
      c => norm(c.name).includes(queryName) || norm(c.playerOrCharacter).includes(queryName)
    );
    if (match) return match;
  }

  return undefined;
}
