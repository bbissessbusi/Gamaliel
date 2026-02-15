// Vercel Edge Function — diagnostic health check for Gamaliel AI.
// Tests Supabase Storage, Deepgram, and Anthropic connections individually
// and returns specific, actionable results for each service.

export const config = { runtime: 'edge' };

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

/** Strip surrounding quotes and invisible characters from env values */
function cleanKey(raw) {
  if (!raw) return '';
  return raw.replace(/^["'\s\u200B\uFEFF]+|["'\s\u200B\uFEFF]+$/g, '').trim();
}

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: CORS_HEADERS });
  }

  const results = {
    supabase: { ok: false, message: '' },
    deepgram: { ok: false, message: '' },
    anthropic: { ok: false, message: '' },
  };

  // ── 1. Check Supabase ────────────────────────────────────────────
  const supabaseUrl = cleanKey(process.env.VITE_SUPABASE_URL);
  const supabaseKey = cleanKey(process.env.VITE_SUPABASE_ANON_KEY);

  if (!supabaseUrl || !supabaseKey) {
    results.supabase.message =
      'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in Vercel environment variables.';
  } else {
    try {
      // Try to list objects in the sermon-uploads bucket (even if empty, a 200 means it works)
      const res = await fetch(
        `${supabaseUrl}/storage/v1/object/list/sermon-uploads`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prefix: '', limit: 1 }),
        }
      );
      if (res.ok) {
        results.supabase.ok = true;
        results.supabase.message = 'Connected. Bucket "sermon-uploads" is accessible.';
      } else if (res.status === 404 || res.status === 400) {
        const text = await res.text();
        if (text.includes('not found') || text.includes('does not exist')) {
          results.supabase.message =
            'Supabase is reachable but the "sermon-uploads" bucket does not exist. '
            + 'Go to Supabase Dashboard → Storage → New Bucket → name it "sermon-uploads" → toggle Public ON → Create. '
            + 'Then run the SQL in supabase/schema.sql in the SQL Editor.';
        } else {
          results.supabase.message = `Supabase returned ${res.status}: ${text.slice(0, 200)}`;
        }
      } else {
        const text = await res.text();
        results.supabase.message = `Supabase returned ${res.status}: ${text.slice(0, 200)}`;
      }
    } catch (e) {
      results.supabase.message = `Cannot reach Supabase at ${supabaseUrl}: ${e.message}`;
    }
  }

  // ── 2. Check Deepgram ────────────────────────────────────────────
  const deepgramKey = cleanKey(process.env.DEEPGRAM_API_KEY);

  if (!deepgramKey) {
    results.deepgram.message =
      'Missing DEEPGRAM_API_KEY in Vercel environment variables. Get a free key at https://console.deepgram.com';
  } else {
    try {
      // Hit Deepgram's projects endpoint to validate the key (lightweight, no transcription)
      const res = await fetch('https://api.deepgram.com/v1/projects', {
        headers: { Authorization: `Token ${deepgramKey}` },
      });
      if (res.ok) {
        results.deepgram.ok = true;
        results.deepgram.message = 'Connected. Deepgram API key is valid.';
      } else if (res.status === 401 || res.status === 403) {
        results.deepgram.message =
          'Deepgram API key is invalid or expired. Go to https://console.deepgram.com → API Keys and create a new key.';
      } else {
        results.deepgram.message = `Deepgram returned ${res.status}. The key may be invalid.`;
      }
    } catch (e) {
      results.deepgram.message = `Cannot reach Deepgram: ${e.message}`;
    }
  }

  // ── 3. Check Anthropic ───────────────────────────────────────────
  const anthropicKey = cleanKey(process.env.ANTHROPIC_API_KEY);

  if (!anthropicKey) {
    results.anthropic.message =
      'Missing ANTHROPIC_API_KEY in Vercel environment variables. Get your key at https://console.anthropic.com/api-keys';
  } else if (!anthropicKey.startsWith('sk-ant-')) {
    results.anthropic.message =
      `Invalid API key format. Anthropic keys start with "sk-ant-". Your key starts with "${anthropicKey.substring(0, 8)}...". `
      + 'Check ANTHROPIC_API_KEY in Vercel — remove any extra quotes or spaces.';
  } else {
    try {
      // Send a minimal request to validate the key — small, cheap, fast
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': anthropicKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-5-20250929',
          max_tokens: 1,
          messages: [{ role: 'user', content: 'Hi' }],
        }),
      });

      if (res.ok) {
        results.anthropic.ok = true;
        results.anthropic.message = 'Connected. Anthropic API key is valid.';
      } else {
        const data = await res.json().catch(() => ({}));
        const errMsg = data?.error?.message || `HTTP ${res.status}`;

        if (res.status === 401) {
          results.anthropic.message =
            `Anthropic rejected the API key: "${errMsg}". `
            + 'Go to https://console.anthropic.com/api-keys, make sure the key is active, '
            + 'and re-paste it into Vercel Environment Variables (remove any surrounding quotes or spaces). '
            + 'After updating, click "Redeploy" in Vercel.';
        } else if (res.status === 400 && errMsg.includes('credit')) {
          results.anthropic.message =
            'Anthropic API key is valid but your account has no credits. '
            + 'Add billing at https://console.anthropic.com/settings/billing';
        } else {
          // Any other response (even 400 "invalid request") means the KEY itself is valid
          // because Anthropic returns 401 for bad keys, not 400
          results.anthropic.ok = true;
          results.anthropic.message = `Connected. API key is valid (test response: ${res.status}).`;
        }
      }
    } catch (e) {
      results.anthropic.message = `Cannot reach Anthropic API: ${e.message}`;
    }
  }

  const allOk = results.supabase.ok && results.deepgram.ok && results.anthropic.ok;

  return Response.json(
    { ok: allOk, services: results },
    { status: allOk ? 200 : 503, headers: CORS_HEADERS }
  );
}
