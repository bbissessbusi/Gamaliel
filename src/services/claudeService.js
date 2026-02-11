// Claude AI Service for Gamaliel — Sermon Analysis
//
// Architecture: Upload to Supabase Storage → Transcribe (Deepgram) → Analyze (Claude)
//
// The Claude Messages API processes text and images — not raw audio/video.
// So we first transcribe the recording to text via Deepgram, then send
// the transcript to Claude for homiletics analysis.

import { supabase } from './supabaseService';

// ── Gamaliel system prompt ───────────────────────────────────────────

const GAMALIEL_SYSTEM_PROMPT = `You are Gamaliel, an expert homiletics (sermon) coach and analyzer. You are named after the respected Jewish teacher mentioned in the Bible (Acts 5:34). Your role is to provide thoughtful, constructive feedback on sermon delivery and content.

You will analyze sermon transcripts based on the Homiletics Scorecard framework. Your analysis should be encouraging yet honest, helping preachers grow in their craft.

## SCORING FRAMEWORK

### Section 1: Sacred Foundation (Pass/Fail Checkboxes)
Evaluate these as either met or not met:
- **Theological Fidelity**: Is the sermon doctrinally accurate? Does it align with sound biblical teaching?
- **Exegetical Soundness**: Does the preacher properly interpret the scripture in context? Are they drawing meaning FROM the text rather than reading INTO it?
- **Gospel Centrality**: Is Christ and the gospel message central to the sermon?

### Section 2: Structural Weight (Score 0-10 each)
- **Relevancy**: How well does the sermon connect to the listeners' real lives and current context?
- **Clarity**: How clear and understandable is the message? Can listeners easily follow the main points?
- **Connectivity**: How well do the sermon points connect to each other and flow logically?
- **Precision**: How precise is the language? Is every word intentional and impactful?
- **Call to Action**: How clear and compelling is the response the preacher is asking for?

### Section 3: Vocal Cadence (Score 0-10 each)
- **Relatability**: Does the preacher come across as authentic and relatable?
- **Pacing**: Is the delivery speed appropriate? Are there good pauses for emphasis?
- **Enthusiasm**: Does the preacher show genuine passion and energy for the message?
- **Charisma**: Does the preacher have engaging presence and delivery style?

## YOUR RESPONSE FORMAT

Please provide your analysis in this structure:

### Sacred Foundation Assessment
[For each of the three items, indicate PASS or NEEDS WORK with brief explanation]

### Structural Weight Scores
[For each of the five items, give a score 0-10 with 1-2 sentence explanation]

### Vocal Cadence Scores
[For each of the four items, give a score 0-10 with 1-2 sentence explanation]

### Anchoring Point (Strength)
[Describe the most impactful, memorable moment or strength of the sermon]

### Structural Drift (Area for Growth)
[Identify where focus was lost or where improvement is needed most]

### Measurable Step (Specific Action)
[Give ONE specific, actionable thing the preacher can practice before their next sermon]

### Overall Encouragement
[End with a brief word of encouragement - remember, preaching is hard work and courage]

Be warm but honest. Your goal is to help preachers become more effective communicators of truth.`;

// ── Helpers ───────────────────────────────────────────────────────────

function generateId() {
  // crypto.randomUUID() requires secure context (HTTPS)
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Fallback for older browsers or non-HTTPS dev
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

// ── Storage: upload file to Supabase, get public URL ─────────────────

async function uploadToStorage(file) {
  if (!supabase) {
    throw new Error(
      'Supabase not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env and to Vercel environment variables.'
    );
  }

  const ext = file.name?.split('.').pop() || 'mp3';
  const path = `uploads/${generateId()}.${ext}`;

  const { data, error } = await supabase.storage
    .from('sermon-uploads')
    .upload(path, file, {
      contentType: file.type || 'audio/mpeg',
      upsert: false,
    });

  if (error) {
    const msg = error.message || JSON.stringify(error);
    const code = error.statusCode || error.status;
    if (msg.includes('Bucket not found') || msg.includes('does not exist') || code === 404) {
      throw new Error(
        'Storage bucket "sermon-uploads" does not exist. '
        + 'Go to your Supabase dashboard → Storage → New Bucket → name it "sermon-uploads" → toggle Public ON → Create. '
        + 'Then go to SQL Editor and run the storage policy SQL from supabase/schema.sql.'
      );
    }
    if (msg.includes('Unauthorized') || msg.includes('security') || msg.includes('policy') ||
        msg.includes('row-level security') || msg.includes('violates') || code === 403) {
      throw new Error(
        'The "sermon-uploads" bucket exists but upload permission was denied. '
        + 'The storage policies need to be applied. Go to your Supabase dashboard → SQL Editor → '
        + 'paste and run ONLY the storage policy section from supabase/schema.sql (the 6 lines starting with "drop policy" and "create policy"). '
        + 'Raw error: ' + msg
      );
    }
    throw new Error(`File upload to storage failed: ${msg}`);
  }

  if (!data?.path) {
    throw new Error('File upload returned no path — the bucket may not be configured correctly.');
  }

  const { data: urlData } = supabase.storage
    .from('sermon-uploads')
    .getPublicUrl(data.path);

  if (!urlData?.publicUrl) {
    throw new Error('Could not generate a public URL for the uploaded file. Make sure the "sermon-uploads" bucket is set to Public.');
  }

  return { path: data.path, publicUrl: urlData.publicUrl };
}

async function deleteFromStorage(path) {
  if (!supabase) return;
  try {
    await supabase.storage.from('sermon-uploads').remove([path]);
  } catch (e) {
    console.warn('Storage cleanup failed (non-critical):', e.message);
  }
}

// ── Transcription: Deepgram via Edge Function ────────────────────────

async function transcribeAudio(fileUrl) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5 * 60 * 1000); // 5 min

  try {
    const response = await fetch('/api/transcribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileUrl }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    let data;
    try {
      data = await response.json();
    } catch {
      throw new Error(
        `Transcription server returned invalid response (status ${response.status}). The /api/transcribe endpoint may not be deployed — use "vercel dev" locally.`
      );
    }

    if (!response.ok) {
      const msg =
        data?.error?.message || `Transcription failed (HTTP ${response.status})`;
      if (response.status === 500 && msg.includes('not configured')) {
        throw new Error(
          'Deepgram API key is missing. Add DEEPGRAM_API_KEY to your Vercel Environment Variables and redeploy. Get a free key at https://console.deepgram.com'
        );
      }
      throw new Error(msg);
    }

    if (!data.transcript) {
      throw new Error(
        'Transcription returned empty. The file may be silent, corrupted, or in an unsupported audio format.'
      );
    }

    return data;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error(
        'Transcription timed out after 5 minutes. Try a shorter or smaller file.'
      );
    }
    if (
      err.message?.includes('Failed to fetch') ||
      err.message?.includes('NetworkError') ||
      err.message?.includes('Load failed')
    ) {
      throw new Error(
        'Could not reach the transcription API. Make sure you are running on Vercel (use "vercel dev" locally, not "vite dev").'
      );
    }
    throw err;
  }
}

// ── Claude analysis via Edge Function ────────────────────────────────

async function callClaudeAPI(requestBody) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5 * 60 * 1000); // 5 min

  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    let data;
    try {
      data = await response.json();
    } catch {
      throw new Error(
        `Server returned invalid response (status ${response.status}). The /api/analyze endpoint may not be deployed — use "vercel dev" locally.`
      );
    }

    if (!response.ok) {
      const errorMsg =
        data?.error?.message || `API error: ${response.status}`;
      if (response.status === 500 && errorMsg.includes('not configured')) {
        throw new Error(
          'Anthropic API key is missing in Vercel. Add ANTHROPIC_API_KEY to your Vercel Environment Variables and redeploy.'
        );
      }
      throw new Error(errorMsg);
    }

    return data;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error(
        'Claude analysis timed out after 5 minutes. Try again or use a shorter recording.'
      );
    }
    if (
      err.message?.includes('Failed to fetch') ||
      err.message?.includes('NetworkError') ||
      err.message?.includes('Load failed')
    ) {
      throw new Error(
        'Could not reach the Gamaliel API. Make sure you are running on Vercel (use "vercel dev" locally, not "vite dev").'
      );
    }
    throw err;
  }
}

// ── Main entry point ─────────────────────────────────────────────────

/**
 * Analyze a sermon recording using Deepgram (transcription) + Claude (analysis).
 *
 * Flow: Upload file to Supabase Storage → Deepgram transcribes from URL →
 *       Claude analyzes the transcript text → cleanup temp file.
 *
 * @param {File}     mediaFile - The audio or video file to analyze
 * @param {object}   context   - Optional { title, goal, date }
 * @param {function} onStatus  - Callback: (phase, message) => void
 * @returns {Promise<{fullAnalysis, scores, transcript, rawResponse}>}
 */
export async function analyzeSermon(mediaFile, context = {}, onStatus) {
  const status = typeof onStatus === 'function' ? onStatus : () => {};
  const fileSizeMB = mediaFile.size / (1024 * 1024);

  if (fileSizeMB > 500) {
    throw new Error(
      `File is ${fileSizeMB.toFixed(0)}MB — too large. Please use a recording under 500MB, or compress the file first.`
    );
  }

  if (fileSizeMB > 200) {
    console.warn(
      `Large file (${fileSizeMB.toFixed(0)}MB). Upload and transcription may take a while.`
    );
  }

  // ── Step 1: Upload to Supabase Storage ──
  status('upload', 'Uploading sermon to secure storage...');
  let storagePath = null;
  let publicUrl;

  try {
    const upload = await uploadToStorage(mediaFile);
    storagePath = upload.path;
    publicUrl = upload.publicUrl;
  } catch (err) {
    throw new Error(`Upload failed: ${err.message}`);
  }

  try {
    // ── Step 2: Transcribe with Deepgram ──
    status(
      'transcribe',
      'Transcribing your sermon — this may take a few minutes for long recordings...'
    );
    const transcription = await transcribeAudio(publicUrl);
    const transcript = transcription.transcript;
    const durationMin = transcription.duration
      ? (transcription.duration / 60).toFixed(1)
      : null;
    const wordCount = transcript.split(/\s+/).length;

    status(
      'transcribe-done',
      `Transcription complete${durationMin ? ` (${durationMin} min, ` : ' ('}${wordCount} words)`
    );

    // ── Step 3: Analyze with Claude ──
    status('analyze', 'Gamaliel is evaluating your sermon...');

    let contextMessage =
      'Please analyze this sermon based on the transcript below.\n\n';
    if (context.title)
      contextMessage += `Sermon Title/Scripture: ${context.title}\n`;
    if (context.goal)
      contextMessage += `Preacher's Primary Goal: ${context.goal}\n`;
    if (context.date) contextMessage += `Preach Date: ${context.date}\n`;
    if (durationMin)
      contextMessage += `Recording Duration: ${durationMin} minutes\n`;
    contextMessage += `\n--- SERMON TRANSCRIPT ---\n\n${transcript}`;

    const requestBody = {
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 8192,
      system: GAMALIEL_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: contextMessage,
        },
      ],
    };

    const data = await callClaudeAPI(requestBody);
    const analysisText = data.content?.[0]?.text || '';
    const scores = parseScoresFromResponse(analysisText);

    status('done', 'Analysis complete!');

    return {
      fullAnalysis: analysisText,
      scores,
      transcript,
      rawResponse: data,
    };
  } finally {
    // Always clean up the temp file from storage
    if (storagePath) {
      deleteFromStorage(storagePath);
    }
  }
}

// ── Score parsing ────────────────────────────────────────────────────

function parseScoresFromResponse(text) {
  const scores = {
    theologicalFidelity: null,
    exegeticalSoundness: null,
    gospelCentrality: null,
    relevancy: null,
    clarity: null,
    connectivity: null,
    precision: null,
    callToAction: null,
    relatability: null,
    pacing: null,
    enthusiasm: null,
    charisma: null,
  };

  scores.theologicalFidelity = /theological fidelity[:\s]*pass/i.test(text);
  scores.exegeticalSoundness = /exegetical soundness[:\s]*pass/i.test(text);
  scores.gospelCentrality = /gospel centrality[:\s]*pass/i.test(text);

  const scorePatterns = {
    relevancy: /relevancy[:\s-]*(\d+)/i,
    clarity: /clarity[:\s-]*(\d+)/i,
    connectivity: /connectivity[:\s-]*(\d+)/i,
    precision: /precision[:\s-]*(\d+)/i,
    callToAction: /call to action[:\s-]*(\d+)/i,
    relatability: /relatability[:\s-]*(\d+)/i,
    pacing: /pacing[:\s-]*(\d+)/i,
    enthusiasm: /enthusiasm[:\s-]*(\d+)/i,
    charisma: /charisma[:\s-]*(\d+)/i,
  };

  for (const [key, pattern] of Object.entries(scorePatterns)) {
    const match = text.match(pattern);
    if (match) {
      scores[key] = Math.min(10, Math.max(0, parseInt(match[1], 10)));
    }
  }

  return scores;
}

export default { analyzeSermon };
