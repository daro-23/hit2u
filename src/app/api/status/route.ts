import { NextResponse } from 'next/server';

export async function GET() {
  const hasKey = Boolean(
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.GOOGLE_GENAI_API_KEY ||
    process.env.NEXT_PUBLIC_GEMINI_API_KEY
  );

  return NextResponse.json({
    status: 'ok',
    hasApiKey: hasKey,
    defaultModel: 'gemini-3.7-flash'
  });
}
