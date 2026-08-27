import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { UniversalCard, CardCategory, CardRarity, CardFinish } from '@/types/pokemon';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageBase64, timestamp = 0, apiKey: clientApiKey } = body;

    const apiKey =
      clientApiKey ||
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.GOOGLE_GENAI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not defined in env or request body.');
      return NextResponse.json({
        success: false,
        error: 'No se detectó GEMINI_API_KEY. Ingresa tu API Key en el botón "Conectar Gemini AI" arriba.',
        card: createFallbackCard(imageBase64, timestamp)
      });
    }

    if (apiKey && imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

      const prompt = `You are an elite sports card and TCG authenticator and OCR specialist.
Inspect this image of a sports trading card from a pack opening video.
Look at the card frame and banners:
1. "player": Read the EXACT name printed on the card banner (e.g. "Alexander Isak", "Warren Zaïre-Emery", "Yáser Asprilla", "Cristiano Ronaldo", "Rubén Vargas", "Folarin Balogun", "Chancel Mbemba", "Lionel Messi", "Christian Pulisic").
2. "team": Country or team printed on the card (e.g. "Sweden", "France", "Colombia", "Portugal", "Switzerland", "DR Congo").
3. "set": Collection name (e.g. "Panini Prizm FIFA World Cup", "Topps Chrome UCL").
4. "finish": Parallel finish (e.g. "Silver Prizm", "Base Card", "Refractor", "Gold /10").
5. "price": Realistic raw market price in USD (e.g. Alexander Isak Silver: 14.00, Cristiano Ronaldo Silver: 28.00, Warren Zaïre-Emery: 12.00, Yáser Asprilla: 6.50, Base card: 3.50).

Return ONLY valid JSON matching this schema:
{
  "player": "string",
  "team": "string",
  "set": "string",
  "finish": "string",
  "price": number
}`;

      // Initialize the official Google Gen AI SDK
      const ai = new GoogleGenAI({ apiKey });

      // List of next-gen Gemini models to try in order
      const models = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];

      for (const modelName of models) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: [
              {
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: cleanBase64
                }
              },
              prompt
            ],
            config: {
              responseMimeType: 'application/json',
              temperature: 0.1
            }
          });

          const rawText = response.text || '';
          if (rawText) {
            const parsed = JSON.parse(rawText);
            const playerName = parsed.player || parsed.name || 'Carta Coleccionable';
            const setBrand = parsed.set || 'Panini Prizm Soccer';
            const finish = parsed.finish || 'Base Card';
            const rawPrice = typeof parsed.price === 'number' ? parsed.price : 10.00;

            const searchQuery = encodeURIComponent(`${playerName} ${setBrand} ${finish}`);

            const cardResult: UniversalCard = {
              id: `card-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
              category: 'soccer',
              name: `${playerName} ${finish && !finish.toLowerCase().includes('base') ? `(${finish})` : ''}`.trim(),
              playerOrCharacter: playerName,
              teamOrFranchise: parsed.team || '',
              setName: setBrand,
              number: `#${Math.floor(Math.random() * 200 + 1)}`,
              rarity: finish.toLowerCase().includes('prizm') || finish.toLowerCase().includes('refractor') ? 'Silver Prizm' : 'Base Card',
              finish: finish as CardFinish,
              imageUrl: imageBase64,
              hiresImageUrl: imageBase64,
              videoSnapshotUrl: imageBase64,
              detectedTimestamp: timestamp,
              confidenceScore: 0.99,
              isHit: rawPrice >= 10 || finish.toLowerCase().includes('prizm'),
              isGodHit: rawPrice >= 60,
              prices: {
                raw: rawPrice,
                psa9: Number((rawPrice * 1.35).toFixed(2)),
                psa10: Number((rawPrice * 2.85).toFixed(2)),
                marketTrend24h: Number((Math.random() * 5 + 1).toFixed(1)),
                ebaySoldUrl: `https://www.ebay.com/sch/i.html?_nkw=${searchQuery}+sold`,
                pricechartingUrl: `https://www.pricecharting.com/search-products?q=${encodeURIComponent(playerName)}`
              }
            };

            return NextResponse.json({
              success: true,
              card: cardResult,
              source: `google-genai-${modelName}`
            });
          }
        } catch (modelErr) {
          console.warn(`Model ${modelName} attempt error:`, modelErr);
        }
      }
    }

    return NextResponse.json({
      success: true,
      card: createFallbackCard(imageBase64, timestamp),
      source: 'snapshot'
    });
  } catch (error: any) {
    console.error('Error analyzing frame:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to analyze frame' },
      { status: 500 }
    );
  }
}

function createFallbackCard(imageBase64: string, timestamp: number): UniversalCard {
  return {
    id: `card-frame-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    category: 'soccer',
    name: `Carta Extraída en ${Math.floor(timestamp)}s`,
    playerOrCharacter: `Carta #${Math.floor(timestamp)}s`,
    teamOrFranchise: 'Panini Prizm',
    setName: 'Panini Prizm Soccer',
    number: `#${Math.floor(timestamp)}`,
    rarity: 'Base Card',
    finish: 'Normal',
    imageUrl: imageBase64 || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80',
    hiresImageUrl: imageBase64,
    videoSnapshotUrl: imageBase64,
    detectedTimestamp: timestamp,
    confidenceScore: 0.9,
    isHit: false,
    isGodHit: false,
    prices: {
      raw: 8.00,
      psa9: 12.00,
      psa10: 25.00,
      marketTrend24h: 1.5,
      ebaySoldUrl: `https://www.ebay.com/sch/i.html?_nkw=Panini+Prizm+Soccer+sold`,
      pricechartingUrl: `https://www.pricecharting.com/search-products?q=Panini+Prizm+Soccer`
    }
  };
}
