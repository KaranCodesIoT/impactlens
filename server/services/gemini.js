import { GoogleGenAI } from '@google/genai';
import Media from '../models/Media.js';
import { getAnalysisUrl, getComparisonUrl } from './cloudinary.js';

const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL = 'gemini-2.0-flash';

// ─── Single Media Analysis ──────────────────────────────────────────────────

const ANALYSIS_PROMPT = `You are an expert sustainability and environmental impact analyst. Analyze this image and return a structured JSON assessment.

You MUST respond with valid JSON only — no markdown, no explanation, no code fences.

Use this exact schema:
{
  "scene": {
    "description": "string — detailed description of what's visible",
    "environment": "urban | rural | coastal | industrial | other",
    "setting": "string — specific setting description",
    "weather": "clear | cloudy | rainy | other | unknown",
    "timeOfDay": "morning | afternoon | evening | night | unknown",
    "season": "spring | summer | monsoon | autumn | winter | unknown"
  },
  "categories": [
    {
      "name": "string — category name (e.g., Reforestation, Water Management, Pollution)",
      "confidence": 0.0-1.0,
      "sdgGoals": [1-17]
    }
  ],
  "observations": [
    {
      "id": "obs_1",
      "label": "string — short label",
      "description": "string — detailed observation",
      "count": "string — estimated count or 'multiple'/'single'",
      "condition": "healthy | damaged | degraded | new | unknown",
      "significance": "high | medium | low"
    }
  ],
  "impactIndicators": [
    {
      "metric": "string — what's being measured",
      "value": "string — estimated value",
      "trend": "increasing | decreasing | stable | unknown",
      "evidence": "string — what visual evidence supports this"
    }
  ],
  "concerns": [
    {
      "issue": "string",
      "severity": "high | medium | low",
      "recommendation": "string"
    }
  ],
  "locationHints": {
    "terrain": "string",
    "vegetation": "string",
    "landmarks": ["string"],
    "estimatedRegion": "string"
  },
  "summary": "string — 2-3 sentence overall assessment"
}

Be thorough but realistic. Only report what you can actually observe. If uncertain, say so.`;

/**
 * Analyze a single media asset with Gemini.
 * Updates the media document in-place.
 */
export async function analyzeMedia(mediaId) {
  const media = await Media.findById(mediaId);
  if (!media) throw new Error('Media not found');

  // Mark as analyzing
  media.analysis.status = 'analyzing';
  await media.save();

  const startTime = Date.now();

  try {
    let imageParts = [];

    if (media.resourceType === 'video') {
      // For video, get frame URLs
      const frameUrls = getAnalysisUrl(media.cloudinaryId, 'video');
      imageParts = frameUrls.map(url => ({
        fileData: { fileUri: url, mimeType: 'image/jpeg' }
      }));
    } else {
      // For images, get optimized URL
      const imageUrl = getAnalysisUrl(media.cloudinaryId, 'image');
      imageParts = [{
        fileData: { fileUri: imageUrl, mimeType: 'image/jpeg' }
      }];
    }

    const response = await genai.models.generateContent({
      model: MODEL,
      contents: [{
        role: 'user',
        parts: [
          ...imageParts,
          { text: ANALYSIS_PROMPT }
        ]
      }],
      config: {
        responseMimeType: 'application/json',
        temperature: 0.3
      }
    });

    const text = response.text;
    let result;
    try {
      result = JSON.parse(text);
    } catch {
      // Try to extract JSON from potential markdown code fences
      const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (match) {
        result = JSON.parse(match[1].trim());
      } else {
        throw new Error('Failed to parse AI response as JSON');
      }
    }

    // Add processing metadata
    result._meta = {
      model: MODEL,
      promptVersion: '1.0',
      processingTimeMs: Date.now() - startTime,
    };

    media.analysis = {
      status: 'ready',
      completedAt: new Date(),
      result
    };
    await media.save();

    return media;
  } catch (err) {
    media.analysis = {
      status: 'failed',
      error: err.message
    };
    await media.save();
    throw err;
  }
}

// ─── Project Q&A ────────────────────────────────────────────────────────────

/**
 * Answer a natural language question about a project's media.
 */
export async function queryProject(projectId, question) {
  // Fetch all analyzed media for this project
  const mediaList = await Media.find({
    project: projectId,
    'analysis.status': 'ready'
  }).sort({ createdAt: 1 });

  if (mediaList.length === 0) {
    return {
      answer: 'No analyzed media found for this project yet. Please upload and wait for analysis to complete.',
      citations: []
    };
  }

  // Build context from all analyses
  const mediaContext = mediaList.map((m, i) => ({
    assetIndex: i + 1,
    id: m._id.toString(),
    filename: m.originalFilename || m.cloudinaryId,
    type: m.resourceType,
    uploadedAt: m.createdAt.toISOString(),
    cloudinaryUrl: m.cloudinaryUrl,
    analysis: m.analysis.result
  }));

  const systemPrompt = `You are an AI analyst for the ImpactLens sustainability platform. You have access to analyzed media assets from a project.

Here are all the analyzed media assets and their AI analysis results:

${JSON.stringify(mediaContext, null, 2)}

RULES:
1. Answer the user's question based ONLY on the evidence from the analyzed media above.
2. Always cite which specific asset(s) support your answer using [Asset #N] notation.
3. If the evidence is insufficient to answer, say so honestly.
4. Be specific and quantitative where possible.
5. Format your response in clear, readable markdown.

Respond with valid JSON:
{
  "answer": "string — your detailed answer in markdown format",
  "citations": [
    {
      "assetIndex": number,
      "mediaId": "string — the asset id",
      "relevance": "string — why this asset is cited"
    }
  ],
  "confidence": "high | medium | low"
}`;

  const response = await genai.models.generateContent({
    model: MODEL,
    contents: [
      { role: 'user', parts: [{ text: systemPrompt }] },
      { role: 'user', parts: [{ text: `Question: ${question}` }] }
    ],
    config: {
      responseMimeType: 'application/json',
      temperature: 0.4
    }
  });

  let result;
  const text = response.text;
  try {
    result = JSON.parse(text);
  } catch {
    const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (match) {
      result = JSON.parse(match[1].trim());
    } else {
      result = { answer: text, citations: [], confidence: 'low' };
    }
  }

  // Enrich citations with Cloudinary URLs
  if (result.citations) {
    result.citations = result.citations.map(cite => {
      const mediaItem = mediaList.find(m => m._id.toString() === cite.mediaId);
      return {
        ...cite,
        cloudinaryUrl: mediaItem?.cloudinaryUrl,
        thumbnailUrl: mediaItem?.cloudinaryUrl
      };
    });
  }

  return result;
}

// ─── Before/After Comparison ────────────────────────────────────────────────

/**
 * Compare two media assets and generate a change analysis.
 */
export async function compareMedia(beforeId, afterId) {
  const [before, after] = await Promise.all([
    Media.findById(beforeId),
    Media.findById(afterId)
  ]);

  if (!before || !after) {
    throw Object.assign(new Error('One or both media assets not found'), { status: 404 });
  }

  const beforeUrl = getComparisonUrl(before.cloudinaryId);
  const afterUrl = getComparisonUrl(after.cloudinaryId);

  const prompt = `You are an expert at analyzing before/after changes in sustainability and impact projects.

Compare these two images:
- Image 1 (BEFORE): The earlier state
- Image 2 (AFTER): The later state

Respond with valid JSON only:
{
  "before": {
    "mediaId": "${before._id}",
    "cloudinaryUrl": "${before.cloudinaryUrl}",
    "summary": "string — what the before image shows"
  },
  "after": {
    "mediaId": "${after._id}",
    "cloudinaryUrl": "${after.cloudinaryUrl}",
    "summary": "string — what the after image shows"
  },
  "changes": [
    {
      "aspect": "string — what changed",
      "before": "string — state before",
      "after": "string — state after",
      "changeType": "improvement | degradation | neutral",
      "magnitude": "significant | moderate | minor"
    }
  ],
  "overallAssessment": {
    "direction": "positive | negative | mixed | neutral",
    "summary": "string — overall change summary",
    "impactScore": 1-10
  }
}`;

  const response = await genai.models.generateContent({
    model: MODEL,
    contents: [{
      role: 'user',
      parts: [
        { fileData: { fileUri: beforeUrl, mimeType: 'image/jpeg' } },
        { fileData: { fileUri: afterUrl, mimeType: 'image/jpeg' } },
        { text: prompt }
      ]
    }],
    config: {
      responseMimeType: 'application/json',
      temperature: 0.3
    }
  });

  let result;
  const text = response.text;
  try {
    result = JSON.parse(text);
  } catch {
    const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (match) {
      result = JSON.parse(match[1].trim());
    } else {
      throw new Error('Failed to parse comparison response');
    }
  }

  // Ensure URLs are present
  result.before = { ...result.before, cloudinaryUrl: before.cloudinaryUrl, comparisonUrl: beforeUrl };
  result.after = { ...result.after, cloudinaryUrl: after.cloudinaryUrl, comparisonUrl: afterUrl };

  return result;
}
