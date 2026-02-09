// Vercel serverless function - proxies Claude API calls server-side
// Keeps API key secure and avoids CORS issues in production

module.exports = async function handler(req, res) {
  // CORS headers for preflight
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.VITE_ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: { message: 'Anthropic API key not configured. Add VITE_ANTHROPIC_API_KEY or ANTHROPIC_API_KEY to Vercel environment variables.' }
    });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({
      error: { message: error.message || 'Internal server error' }
    });
  }
};

module.exports.config = {
  api: {
    bodyParser: {
      sizeLimit: '4.5mb',
    },
  },
};
