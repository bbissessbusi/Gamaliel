// Claude AI Service for Gamaliel - Sermon Analysis
// All API calls go through the Vercel serverless proxy at /api/analyze

// The system prompt that tells Claude how to be "Gamaliel" and analyze sermons
const GAMALIEL_SYSTEM_PROMPT = `You are Gamaliel, an expert homiletics (sermon) coach and analyzer. You are named after the respected Jewish teacher mentioned in the Bible (Acts 5:34). Your role is to provide thoughtful, constructive feedback on sermon delivery and content.

You will analyze sermon recordings (audio or video) based on the Homiletics Scorecard framework. Your analysis should be encouraging yet honest, helping preachers grow in their craft.

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

/**
 * Convert a file (audio/video) to base64 format
 */
async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
}

/**
 * Get the media type string for Claude API
 */
function getMediaType(file) {
  return file.type || 'audio/mpeg';
}

/**
 * Send request to Claude API via the Vercel Edge Function proxy ONLY.
 * Never calls Anthropic directly from the browser (avoids CORS and API key exposure).
 */
async function callClaudeAPI(requestBody) {
  const bodyStr = JSON.stringify(requestBody);

  let response;
  try {
    response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: bodyStr,
    });
  } catch (err) {
    // Network error — proxy not reachable
    const msg = err.message || '';
    if (msg.includes('Failed to fetch') || msg.includes('NetworkError') || msg.includes('pattern') || msg.includes('Load failed')) {
      throw new Error('Could not reach the Gamaliel API proxy. Please ensure you are running on Vercel or have the local proxy server running.');
    }
    throw err;
  }

  // Handle 413 specifically — payload too large
  if (response.status === 413) {
    throw new Error('Your sermon file is too large. Please try a shorter recording or compress the audio file before uploading (under 20MB recommended).');
  }

  // Parse response
  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error(`Server returned invalid response (status ${response.status}). The /api/analyze proxy may not be deployed correctly.`);
  }

  if (!response.ok) {
    const errorMsg = data.error?.message || `API error: ${response.status}`;
    if (response.status === 500 && errorMsg.includes('not configured')) {
      throw new Error('API Key is missing in Vercel. Please add ANTHROPIC_API_KEY to your Vercel Environment Variables and redeploy.');
    }
    throw new Error(errorMsg);
  }

  return data;
}

/**
 * Analyze a sermon recording using Claude
 */
export async function analyzeSermon(mediaFile, context = {}) {
  const fileSizeMB = mediaFile.size / (1024 * 1024);

  // Hard limit: files over 25MB will almost certainly fail
  if (fileSizeMB > 25) {
    throw new Error(`File is ${fileSizeMB.toFixed(0)}MB — too large for analysis. Please use a recording under 20MB (roughly 20 minutes of audio). Try compressing the file or using a lower quality recording.`);
  }

  if (fileSizeMB > 15) {
    console.warn(`File is ${fileSizeMB.toFixed(1)}MB. Large files may take longer to upload and process.`);
  }

  const base64Data = await fileToBase64(mediaFile);
  const mediaType = getMediaType(mediaFile);
  const isVideo = mediaType.startsWith('video/');

  let contextMessage = 'Please analyze this sermon recording.';
  if (context.title) contextMessage += `\n\nSermon Title/Scripture: ${context.title}`;
  if (context.goal) contextMessage += `\nPreacher's Primary Goal: ${context.goal}`;
  if (context.date) contextMessage += `\nPreach Date: ${context.date}`;

  const requestBody = {
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 4096,
    system: GAMALIEL_SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: isVideo ? 'video' : 'audio',
            source: {
              type: 'base64',
              media_type: mediaType,
              data: base64Data,
            },
          },
          {
            type: 'text',
            text: contextMessage,
          },
        ],
      },
    ],
  };

  const data = await callClaudeAPI(requestBody);
  const analysisText = data.content?.[0]?.text || '';
  const scores = parseScoresFromResponse(analysisText);

  return {
    fullAnalysis: analysisText,
    scores,
    rawResponse: data,
  };
}

/**
 * Parse scores from Claude's response text
 */
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
