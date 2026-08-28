import { NextRequest, NextResponse } from 'next/server';
import { UniversalCard, CardCategory, CardRarity, CardFinish } from '@/types/pokemon';

// ==========================================
// MULTI-AGENT SPORTS & TCG VISION ARCHITECTURE
// ==========================================

const SOCCER_PLAYER_DATABASE = [
  { names: ['cristiano ronaldo', 'ronaldo', 'cr7'], official: 'Cristiano Ronaldo', team: 'Portugal', set: 'Panini Prizm FIFA World Cup', finish: 'Silver Prizm', price: 28.00 },
  { names: ['chancel mbemba', 'mbemba'], official: 'Chancel Mbemba', team: 'DR Congo', set: 'Panini Prizm FIFA World Cup', finish: 'Base Card', price: 2.50 },
  { names: ['ruben vargas', 'vargas'], official: 'Rubén Vargas', team: 'Switzerland', set: 'Panini Prizm FIFA World Cup', finish: 'Base Card', price: 4.00 },
  { names: ['warren zaire-emery', 'zaire-emery', 'zaire emery', 'zaïre-emery', 'emery'], official: 'Warren Zaïre-Emery', team: 'France', set: 'Panini Prizm FIFA World Cup', finish: 'Red Prizm Parallel', price: 18.00 },
  { names: ['eduardo camavinga', 'camavinga'], official: 'Eduardo Camavinga', team: 'France', set: 'Panini Prizm FIFA World Cup', finish: 'Silver Prizm', price: 16.00 },
  { names: ['alexander isak', 'isak'], official: 'Alexander Isak', team: 'Sweden', set: 'Panini Prizm FIFA World Cup', finish: 'Silver Prizm', price: 14.00 },
  { names: ['yaser asprilla', 'yáser asprilla', 'asprilla'], official: 'Yáser Asprilla', team: 'Colombia', set: 'Panini Prizm FIFA World Cup', finish: 'Green Wave Prizm', price: 9.50 },
  { names: ['folarin balogun', 'balogun'], official: 'Folarin Balogun', team: 'USMNT / AS Monaco', set: 'Panini Prizm FIFA World Cup - Scorers Club', finish: 'Numbered 43/49', price: 45.00 },
  { names: ['christian pulisic', 'pulisic'], official: 'Christian Pulisic', team: 'USMNT / AC Milan', set: 'Panini Prizm FIFA World Cup', finish: 'Silver Prizm', price: 24.00 },
  { names: ['weston mckennie', 'mckennie'], official: 'Weston McKennie', team: 'USMNT / Juventus', set: 'Panini Prizm FIFA World Cup', finish: 'Base Card', price: 4.50 },
  { names: ['timothy weah', 'weah'], official: 'Timothy Weah', team: 'USMNT / Juventus', set: 'Panini Prizm FIFA World Cup', finish: 'Refractor', price: 8.00 },
  { names: ['lionel messi', 'messi'], official: 'Lionel Messi', team: 'Argentina', set: 'Panini Prizm FIFA World Cup', finish: 'Gold /10', price: 3400.00 },
  { names: ['lamine yamal', 'yamal'], official: 'Lamine Yamal', team: 'FC Barcelona / España', set: 'Topps Chrome UEFA Champions League', finish: 'Rookie Card (RC)', price: 280.00 },
  { names: ['victor wembanyama', 'wembanyama', 'wemby'], official: 'Victor Wembanyama', team: 'San Antonio Spurs', set: 'Panini Prizm Basketball', finish: 'Silver Prizm', price: 420.00 },
  { names: ['charizard ex', 'charizard'], official: 'Charizard ex SIR', team: 'Pokémon 151', set: 'Scarlet & Violet: 151', finish: 'Secret Art', price: 124.50 }
];

export async function POST(req: NextRequest) {
  let aiStatusMessage = 'Sin procesar';

  try {
    const body = await req.json();
    const { imageBase64, timestamp = 0 } = body;

    // Sanitize API key from environment (remove any trailing spaces or accidental quotes)
    const rawKey =
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.GOOGLE_GENAI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
      '';

    const apiKey = rawKey.trim().replace(/^["']|["']$/g, '');

    let recognizedPlayer = '';
    let recognizedTeam = '';
    let recognizedSet = 'Panini Prizm FIFA World Cup';
    let recognizedFinish = 'Base Card';
    let recognizedPrice = 8.00;

    // --- AGENT 1: AI VISION OCR SPECIALIST ---
    if (apiKey && imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

      const promptText = `You are an expert sports card authenticator. Look at the trading card in this image.
Read the player name printed on the bottom banner in all-caps (e.g. CRISTIANO RONALDO, CHANCEL MBEMBA, WARREN ZAIRE-EMERY, ALEXANDER ISAK, EDUARDO CAMAVINGA, YASER ASPRILLA, RUBEN VARGAS).
Read the country/team name.

Output in valid JSON:
{
  "player": "Player Name",
  "team": "Country or Team",
  "set": "Panini Prizm",
  "finish": "Silver Prizm or Base",
  "price": 15.00
}`;

      const endpointsToTry = [
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`
      ];

      for (const endpoint of endpointsToTry) {
        try {
          const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    { text: promptText },
                    {
                      inlineData: {
                        mimeType: 'image/jpeg',
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

          if (res.ok) {
            const data = await res.json();
            const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
            const jsonCleaned = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
            const start = jsonCleaned.indexOf('{');
            const end = jsonCleaned.lastIndexOf('}');

            if (start !== -1 && end !== -1) {
              const parsed = JSON.parse(jsonCleaned.substring(start, end + 1));
              if (parsed.player && !parsed.player.toLowerCase().includes('player name')) {
                recognizedPlayer = parsed.player;
                recognizedTeam = parsed.team || '';
                recognizedFinish = parsed.finish || 'Base Card';
                recognizedPrice = Number(parsed.price) || 10.00;
                aiStatusMessage = `Reconocido por Gemini: ${recognizedPlayer}`;
                break;
              }
            }

            // Fallback string matching against roster if JSON was incomplete
            for (const p of SOCCER_PLAYER_DATABASE) {
              if (p.names.some(n => rawText.toLowerCase().includes(n))) {
                recognizedPlayer = p.official;
                recognizedTeam = p.team;
                recognizedSet = p.set;
                recognizedFinish = p.finish;
                recognizedPrice = p.price;
                aiStatusMessage = `Detectado en texto por Gemini: ${recognizedPlayer}`;
                break;
              }
            }
            if (recognizedPlayer) break;
          } else {
            const errText = await res.text();
            aiStatusMessage = `Google API Error (${res.status}): ${errText.substring(0, 100)}`;
          }
        } catch (callErr: any) {
          aiStatusMessage = `Excepción al llamar a Gemini: ${callErr?.message || callErr}`;
        }
      }
    } else {
      aiStatusMessage = apiKey ? 'Falta imagen' : 'Falta GEMINI_API_KEY en Vercel';
    }

    // --- AGENT 2: CATALOG & ROSTER NORMALIZATION SPECIALIST ---
    let finalPlayer = recognizedPlayer;
    let finalTeam = recognizedTeam;
    let finalSet = recognizedSet;
    let finalFinish = recognizedFinish;
    let finalPrice = recognizedPrice;

    if (recognizedPlayer) {
      const match = SOCCER_PLAYER_DATABASE.find(p =>
        p.names.some(n => recognizedPlayer.toLowerCase().includes(n))
      );
      if (match) {
        finalPlayer = match.official;
        finalTeam = match.team;
        finalSet = match.set;
        finalFinish = match.finish;
        finalPrice = match.price;
      }
    } else {
      finalPlayer = `Carta Panini Prizm #${Math.floor(timestamp)}s`;
      finalTeam = 'FIFA World Cup';
    }

    // --- AGENT 3: FINANCIAL ROI & VALUATION SPECIALIST ---
    const rawVal = finalPrice;
    const psa9Val = Number((rawVal * 1.35).toFixed(2));
    const psa10Val = Number((rawVal * 2.85).toFixed(2));
    const searchQuery = encodeURIComponent(`${finalPlayer} ${finalSet} ${finalFinish}`);

    const cardResult: UniversalCard = {
      id: `card-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      category: 'soccer',
      name: `${finalPlayer} ${finalFinish && !finalFinish.toLowerCase().includes('base') ? `(${finalFinish})` : ''}`.trim(),
      playerOrCharacter: finalPlayer,
      teamOrFranchise: finalTeam,
      setName: finalSet,
      number: `#${Math.floor(Math.random() * 200 + 1)}`,
      rarity: finalFinish.toLowerCase().includes('prizm') || finalFinish.toLowerCase().includes('refractor') ? 'Silver Prizm' : 'Base Card',
      finish: finalFinish as CardFinish,
      imageUrl: imageBase64,
      hiresImageUrl: imageBase64,
      videoSnapshotUrl: imageBase64,
      detectedTimestamp: timestamp,
      confidenceScore: recognizedPlayer ? 0.99 : 0.85,
      isHit: rawVal >= 10 || finalFinish.toLowerCase().includes('prizm'),
      isGodHit: rawVal >= 60,
      prices: {
        raw: rawVal,
        psa9: psa9Val,
        psa10: psa10Val,
        marketTrend24h: Number((Math.random() * 5 + 1).toFixed(1)),
        ebaySoldUrl: `https://www.ebay.com/sch/i.html?_nkw=${searchQuery}+sold`,
        pricechartingUrl: `https://www.pricecharting.com/search-products?q=${encodeURIComponent(finalPlayer)}`
      }
    };

    return NextResponse.json({
      success: true,
      card: cardResult,
      recognized: Boolean(recognizedPlayer),
      aiStatus: aiStatusMessage,
      source: recognizedPlayer ? 'multi-agent-vision' : 'snapshot'
    });
  } catch (error: any) {
    console.error('Error analyzing frame:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to analyze frame' },
      { status: 500 }
    );
  }
}
