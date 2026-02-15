// Vercel Edge Function — proxies Claude API calls server-side.
// Now handles text-only payloads (sermon transcript + analysis prompt).
// API key stays on the server — never exposed to the browser.

export const config = {
  runtime: 'edge',
};

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default async function handler(req) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: CORS_HEADERS });
  }

  if (req.method !== 'POST') {
    return Response.json(
      { error: { message: 'Method not allowed' } },
      { status: 405, headers: CORS_HEADERS }
    );
  }

  // Read API key — strip quotes, zero-width chars, and whitespace that
  // users accidentally paste into Vercel environment variable values.
  const apiKey = (process.env.ANTHROPIC_API_KEY || '')
    .replace(/^["'\s\u200B\uFEFF]+|["'\s\u200B\uFEFF]+$/g, '')
    .trim();

  if (!apiKey) {
    return Response.json(
      {
        error: {
          message:
            'Anthropic API key not configured. Add ANTHROPIC_API_KEY to Vercel environment variables (Settings > Environment Variables). Make sure it is available for Production and Preview environments.',
        },
      },
      { status: 500, headers: CORS_HEADERS }
    );
  }

  if (!apiKey.startsWith('sk-ant-')) {
    return Response.json(
      {
        error: {
          message: `Invalid API key format. Anthropic keys start with "sk-ant-". Your key starts with "${apiKey.substring(0, 7)}...". Check ANTHROPIC_API_KEY in Vercel — no extra quotes or spaces.`,
        },
      },
      { status: 500, headers: CORS_HEADERS }
    );
  }

  try {
    // Read the full request body as text — safer than streaming for text payloads
    const bodyText = await req.text();

    const anthropicResponse = await fetch(
      'https://api.anthropic.com/v1/messages',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: bodyText,
      }
    );

    // Read Anthropic's full response, then return it
    const responseText = await anthropicResponse.text();

    return new Response(responseText, {
      status: anthropicResponse.status,
      headers: {
        ...CORS_HEADERS,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return Response.json(
      { error: { message: error.message || 'Internal server error' } },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
