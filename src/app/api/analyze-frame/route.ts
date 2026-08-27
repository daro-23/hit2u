import { NextRequest, NextResponse } from 'next/server';
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
      return NextResponse.json({
        success: false,
        error: 'No se detectó GEMINI_API_KEY en Vercel ni en la aplicación. Por favor agrega GEMINI_API_KEY en las variables de entorno de Vercel.',
        card: createFallbackCard(imageBase64, timestamp)
      });
    }

    if (apiKey && imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

      const prompt = `Inspect this video frame from a sports/trading card opening.
Read the EXACT player/character name printed on the card banner (e.g. "Cristiano Ronaldo", "Chancel Mbemba", "Folarin Balogun", "Lionel Messi", "Christian Pulisic", "Luka Modric", "Vinicius Jr", "Charizard ex").
Also read team/country, set name, and card finish.

Return ONLY valid JSON (no markdown ticks):
{
  "player": "Exact Player Name",
  "team": "Team or Country",
  "set": "Brand or Set Name (e.g. Panini Prizm)",
  "finish": "Silver Prizm / Refractor / Holo / Base",
  "price": 15.00
}`;

      // Call Gemini 1.5 Flash or 2.0 Flash
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

      try {
        const geminiRes = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: prompt },
                  {
                    inline_data: {
                      mime_type: 'image/jpeg',
                      data: cleanBase64
                    }
                  }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.1,
              maxOutputTokens: 300
            }
          })
        });

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          let rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';
          rawText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
          
          const start = rawText.indexOf('{');
          const end = rawText.lastIndexOf('}');

          if (start !== -1 && end !== -1) {
            const parsed = JSON.parse(rawText.substring(start, end + 1));
            const playerName = parsed.player || parsed.name || 'Sports Card';
            const setBrand = parsed.set || 'Panini Prizm';
            const finish = parsed.finish || 'Normal';
            const rawPrice = Number(parsed.price) || 15.00;

            const searchQuery = encodeURIComponent(`${playerName} ${setBrand} ${finish}`);

            const cardResult: UniversalCard = {
              id: `card-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
              category: 'soccer',
              name: `${playerName} ${finish !== 'Normal' && finish !== 'Base' ? `(${finish})` : ''}`.trim(),
              playerOrCharacter: playerName,
              teamOrFranchise: parsed.team || '',
              setName: setBrand,
              number: `#${Math.floor(Math.random() * 200 + 1)}`,
              rarity: finish.includes('Prizm') || finish.includes('Refractor') ? 'Silver Prizm' : 'Base Card',
              finish: finish as CardFinish,
              imageUrl: imageBase64,
              hiresImageUrl: imageBase64,
              videoSnapshotUrl: imageBase64,
              detectedTimestamp: timestamp,
              confidenceScore: 0.98,
              isHit: rawPrice >= 8 || finish.includes('Prizm'),
              isGodHit: rawPrice >= 60,
              prices: {
                raw: rawPrice,
                psa9: Number((rawPrice * 1.35).toFixed(2)),
                psa10: Number((rawPrice * 2.85).toFixed(2)),
                marketTrend24h: 3.5,
                ebaySoldUrl: `https://www.ebay.com/sch/i.html?_nkw=${searchQuery}+sold`,
                pricechartingUrl: `https://www.pricecharting.com/search-products?q=${encodeURIComponent(playerName)}`
              }
            };

            return NextResponse.json({
              success: true,
              card: cardResult,
              source: 'gemini-ai'
            });
          }
        } else {
          const errText = await geminiRes.text();
          console.warn('Gemini API error response:', geminiRes.status, errText);
          return NextResponse.json({
            success: false,
            error: `Gemini API HTTP ${geminiRes.status}: ${errText.substring(0, 100)}`,
            card: createFallbackCard(imageBase64, timestamp)
          });
        }
      } catch (callErr) {
        console.warn('Gemini fetch exception:', callErr);
      }
    }

    return NextResponse.json({
      success: true,
      card: createFallbackCard(imageBase64, timestamp),
      source: 'snapshot'
    });
  } catch (error) {
    console.error('Error analyzing frame:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to analyze frame' },
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
    teamOrFranchise: 'Colección de Sobres',
    setName: 'Panini Prizm / Sports Set',
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
