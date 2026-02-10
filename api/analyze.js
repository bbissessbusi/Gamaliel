// Vercel Edge Function - proxies Claude API calls server-side
// Uses Edge Runtime to stream request body directly to Anthropic
// without hitting the 4.5MB body parser limit of regular serverless functions

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

  // Read API key from environment
  const apiKey = (process.env.ANTHROPIC_API_KEY || process.env.VITE_ANTHROPIC_API_KEY || '').trim();

  if (!apiKey) {
    return Response.json(
      {
        error: {
          message: 'Anthropic API key not configured. Add ANTHROPIC_API_KEY to Vercel environment variables (Settings > Environment Variables). Make sure it is available for Production and Preview environments.',
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
    // Stream request body directly to Anthropic — no buffering or parsing
    // This bypasses the 4.5MB body parser limit of regular serverless functions
    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: req.body,
    });

    // Stream Anthropic's response back to the client
    return new Response(anthropicResponse.body, {
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
