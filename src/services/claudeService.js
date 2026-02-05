// Claude AI Service for Gamaliel - Sermon Analysis

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

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
      // Remove the data URL prefix (e.g., "data:audio/mp3;base64,")
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
  const type = file.type;

  // Audio types
  if (type.startsWith('audio/')) {
    return type; // e.g., "audio/mp3", "audio/wav", "audio/m4a"
  }

  // Video types
  if (type.startsWith('video/')) {
    return type; // e.g., "video/mp4", "video/webm"
  }

  // Default fallback
  return type;
}

/**
 * Analyze a sermon recording using Claude
 * @param {File} mediaFile - The audio or video file to analyze
 * @param {Object} context - Additional context about the sermon
 * @param {string} context.title - Sermon title or scripture reference
 * @param {string} context.goal - The preacher's primary goal for this sermon
 * @param {string} context.date - When the sermon was/will be preached
 * @returns {Promise<Object>} - Claude's analysis response
 */
export async function analyzeSermon(mediaFile, context = {}) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

  if (!apiKey || apiKey === 'your-api-key-here') {
    throw new Error('Please add your Anthropic API key to the .env file');
  }

  // Convert media file to base64
  const base64Data = await fileToBase64(mediaFile);
  const mediaType = getMediaType(mediaFile);

  // Determine if it's audio or video
  const isVideo = mediaType.startsWith('video/');

  // Build the context message
  let contextMessage = 'Please analyze this sermon recording.';
  if (context.title) {
    contextMessage += `\n\nSermon Title/Scripture: ${context.title}`;
  }
  if (context.goal) {
    contextMessage += `\nPreacher's Primary Goal: ${context.goal}`;
  }
  if (context.date) {
    contextMessage += `\nPreach Date: ${context.date}`;
  }

  // Build the request body
  const requestBody = {
    model: 'claude-sonnet-4-20250514',
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

  // Make the API request
  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `API request failed: ${response.status}`);
  }

  const data = await response.json();

  // Extract the text response
  const analysisText = data.content?.[0]?.text || '';

  // Parse the scores from the response (basic parsing)
  const scores = parseScoresFromResponse(analysisText);

  return {
    fullAnalysis: analysisText,
    scores,
    rawResponse: data,
  };
}

/**
 * Parse scores from Claude's response text
 * This is a simple parser - you might want to make it more robust
 */
function parseScoresFromResponse(text) {
  const scores = {
    // Sacred Foundation (true = pass, false = needs work)
    theologicalFidelity: null,
    exegeticalSoundness: null,
    gospelCentrality: null,

    // Structural Weight (0-10)
    relevancy: null,
    clarity: null,
    connectivity: null,
    precision: null,
    callToAction: null,

    // Vocal Cadence (0-10)
    relatability: null,
    pacing: null,
    enthusiasm: null,
    charisma: null,
  };

  // Try to extract pass/fail for Sacred Foundation
  scores.theologicalFidelity = /theological fidelity[:\s]*pass/i.test(text);
  scores.exegeticalSoundness = /exegetical soundness[:\s]*pass/i.test(text);
  scores.gospelCentrality = /gospel centrality[:\s]*pass/i.test(text);

  // Try to extract numeric scores (look for patterns like "Relevancy: 8" or "Relevancy - 8/10")
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

export default {
  analyzeSermon,
};
