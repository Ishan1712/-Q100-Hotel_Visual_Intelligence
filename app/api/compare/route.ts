import { NextRequest, NextResponse } from 'next/server';

/**
 * Server-side API route that proxies image comparison requests to OpenAI.
 * The API key is read from the environment variable and never exposed to the client.
 */
export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'OpenAI API key is not configured. Add OPENAI_API_KEY to .env.local' },
      { status: 500 }
    );
  }

  try {
    const { prompt, inspectionBase64, masterBase64 } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Missing field: prompt' }, { status: 400 });
    }
    if (!inspectionBase64) {
      return NextResponse.json({ error: 'Missing field: inspectionBase64' }, { status: 400 });
    }
    if (!masterBase64) {
      return NextResponse.json({ error: 'Missing field: masterBase64' }, { status: 400 });
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
      return NextResponse.json(
        { error: `OpenAI API returned ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Compare API error:', error);
    return NextResponse.json(
      { error: 'Internal server error during comparison' },
      { status: 500 }
    );
  }
}
