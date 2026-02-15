// Vercel Edge Function — proxies Deepgram transcription calls server-side.
// Accepts a public file URL, sends it to Deepgram for speech-to-text,
// and returns the transcript. API key stays on the server.

export const config = {
  runtime: 'edge',
  // maxDuration defaults to 30s on Hobby, 300s on Pro.
  // Deepgram is fast (faster than real-time), so 30s is enough for most files.
  // Upgrade to Vercel Pro for sermons over ~30 minutes.
};

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: CORS_HEADERS });
  }

  if (req.method !== 'POST') {
    return Response.json(
      { error: { message: 'Method not allowed' } },
      { status: 405, headers: CORS_HEADERS }
    );
  }

  const deepgramKey = (process.env.DEEPGRAM_API_KEY || '').trim();

  if (!deepgramKey) {
    return Response.json(
      {
        error: {
          message:
            'Deepgram API key not configured. Add DEEPGRAM_API_KEY to your Vercel environment variables. Get a free key at https://console.deepgram.com',
        },
      },
      { status: 500, headers: CORS_HEADERS }
    );
  }

  try {
    const body = await req.json();
    const { fileUrl } = body;

    if (!fileUrl) {
      return Response.json(
        { error: { message: 'Missing fileUrl in request body.' } },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // Deepgram Nova-2 pre-recorded transcription
    const dgParams = new URLSearchParams({
      model: 'nova-2',
      smart_format: 'true',
      paragraphs: 'true',
      punctuate: 'true',
      diarize: 'true',
      utterances: 'true',
    });

    const dgResponse = await fetch(
      `https://api.deepgram.com/v1/listen?${dgParams}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Token ${deepgramKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: fileUrl }),
      }
    );

    if (!dgResponse.ok) {
      let errMsg;
      try {
        const errData = await dgResponse.json();
        errMsg = errData.err_msg || errData.message || JSON.stringify(errData);
      } catch {
        errMsg = await dgResponse.text();
      }
      return Response.json(
        {
          error: {
            message: `Deepgram transcription failed (${dgResponse.status}): ${errMsg}`,
          },
        },
        { status: dgResponse.status, headers: CORS_HEADERS }
      );
    }

    const dgData = await dgResponse.json();
    const transcript =
      dgData.results?.channels?.[0]?.alternatives?.[0]?.transcript || '';

    if (!transcript) {
      return Response.json(
        {
          error: {
            message:
              'Transcription returned empty. The audio may be silent, corrupted, or in an unsupported format.',
          },
        },
        { status: 422, headers: CORS_HEADERS }
      );
    }

    // Extract speaker-labeled utterances for richer analysis
    const utterances =
      dgData.results?.utterances?.map((u) => ({
        speaker: u.speaker,
        text: u.transcript,
        start: u.start,
        end: u.end,
      })) || [];

    return Response.json(
      {
        transcript,
        utterances,
        duration: dgData.metadata?.duration || null,
        confidence:
          dgData.results?.channels?.[0]?.alternatives?.[0]?.confidence || null,
      },
      { headers: CORS_HEADERS }
    );
  } catch (error) {
    return Response.json(
      { error: { message: error.message || 'Internal server error' } },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
