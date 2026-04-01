import { NextRequest, NextResponse } from 'next/server';

/**
 * Server-side API route that proxies image comparison requests to either
 * Google Gemini or OpenAI, based on the AI_PROVIDER env var or client override.
 */

type Provider = 'google' | 'openai';

function getProvider(clientOverride?: string): Provider {
  const provider = clientOverride || process.env.AI_PROVIDER || 'google';
  return provider === 'openai' ? 'openai' : 'google';
}

async function callGemini(prompt: string, inspectionBase64: string, masterBase64: string) {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw { status: 500, message: 'Google API key is not configured. Add GOOGLE_API_KEY to .env' };
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },
              { inline_data: { mime_type: 'image/jpeg', data: inspectionBase64 } },
              { inline_data: { mime_type: 'image/jpeg', data: masterBase64 } },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.1,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('Gemini API error:', response.status, errorBody);
    throw { status: response.status, message: `Gemini API returned ${response.status}` };
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw { status: 500, message: 'Gemini returned empty response' };
  }
  return JSON.parse(text);
}

async function callOpenAI(prompt: string, inspectionBase64: string, masterBase64: string) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw { status: 500, message: 'OpenAI API key is not configured. Add OPENAI_API_KEY to .env' };
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: `data:image/png;base64,${inspectionBase64}` } },
            { type: 'image_url', image_url: { url: `data:image/png;base64,${masterBase64}` } },
          ],
        },
      ],
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('OpenAI API error:', response.status, errorBody);
    throw { status: response.status, message: `OpenAI API returned ${response.status}` };
  }

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, inspectionBase64, masterBase64, provider: clientProvider } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Missing field: prompt' }, { status: 400 });
    }
    if (!inspectionBase64) {
      return NextResponse.json({ error: 'Missing field: inspectionBase64' }, { status: 400 });
    }
    if (!masterBase64) {
      return NextResponse.json({ error: 'Missing field: masterBase64' }, { status: 400 });
    }

    const provider = getProvider(clientProvider);
    const result = provider === 'google'
      ? await callGemini(prompt, inspectionBase64, masterBase64)
      : await callOpenAI(prompt, inspectionBase64, masterBase64);

    return NextResponse.json({ ...result, provider });
  } catch (error: any) {
    console.error('Compare API error:', error);
    const status = error?.status || 500;
    const message = error?.message || 'Internal server error during comparison';
    return NextResponse.json({ error: message }, { status });
  }
}
