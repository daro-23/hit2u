import { NextResponse } from 'next/server';

export async function GET() {
  const keyName = process.env.GEMINI_API_KEY
    ? 'GEMINI_API_KEY'
    : process.env.GOOGLE_API_KEY
    ? 'GOOGLE_API_KEY'
    : process.env.GOOGLE_GENAI_API_KEY
    ? 'GOOGLE_GENAI_API_KEY'
    : process.env.NEXT_PUBLIC_GEMINI_API_KEY
    ? 'NEXT_PUBLIC_GEMINI_API_KEY'
    : null;

  const keyVal = keyName ? process.env[keyName] : null;

  return NextResponse.json({
    status: 'ok',
    hasApiKey: Boolean(keyVal),
    detectedKeyEnvName: keyName,
    keyLength: keyVal ? keyVal.length : 0,
    keyPrefix: keyVal ? `${keyVal.substring(0, 5)}...` : null
  });
}
