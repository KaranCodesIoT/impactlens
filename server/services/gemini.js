import { GoogleGenAI } from '@google/genai';
import Media from '../models/Media.js';
import Project from '../models/Project.js';
import { getAnalysisUrl, getComparisonUrl, getThumbnailUrl } from './cloudinary.js';
import cloudinary from '../config/cloudinary.js';

const getGenAI = () => new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const CANDIDATE_MODELS = [
  'gemini-3.5-flash',
  'gemini-3.5-flash-lite',
  'gemini-2.5-flash',
  'gemini-3.8-flash'
];
const DEFAULT_MODEL = CANDIDATE_MODELS[0];
const MODEL = DEFAULT_MODEL;
const MAX_RETRIES = 2;
const BASE_DELAY_MS = 1500;

/**
 * Call Gemini with automatic model failover and exponential backoff retry.
 * If one model reaches its daily quota (e.g. 20 req/day on 3.8-flash),
 * seamlessly switches to the next candidate model in CANDIDATE_MODELS.
 */
async function callGeminiWithRetry(requestConfig, retries = MAX_RETRIES) {
  const modelsToTry = [
    requestConfig.model,
    ...CANDIDATE_MODELS.filter(m => m !== requestConfig.model)
  ].filter(Boolean);

  let lastError = null;

  for (const model of modelsToTry) {
    const isLite = model.includes('flash-lite') || model.includes('lite');
    const safeConfig = { ...(requestConfig.config || {}) };
    if (isLite) {
      delete safeConfig.temperature;
      delete safeConfig.topK;
      delete safeConfig.topP;
    }

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`[Gemini] Requesting ${model} (attempt ${attempt})...`);
        const response = await getGenAI().models.generateContent({
          ...requestConfig,
          model,
          config: safeConfig
        });
        return { response, modelUsed: model };
      } catch (err) {
        lastError = err;
        const msg = err?.message || String(err);
        const status = err?.status || err?.code || (msg.match(/(\d{3})/)?.[1]);
        const isQuota = msg.includes('RESOURCE_EXHAUSTED') ||
          msg.includes('Quota exceeded') ||
          msg.includes('rate-limit') ||
          status === 429 ||
          status === '429';

        // If daily limit reached for this specific model, switch immediately to next candidate model
        if (isQuota) {
          console.warn(`[Gemini] Daily quota reached for ${model} (${msg.slice(0, 120)}), automatically failing over to next model...`);
          break; // break retry loop to try next model in outer loop
        }

        const isRetryable = ['503', 503].includes(status) ||
          msg.includes('UNAVAILABLE') ||
          msg.includes('high demand');

        if (isRetryable && attempt < retries) {
          const delay = BASE_DELAY_MS * Math.pow(1.8, attempt - 1);
          console.log(`⏳ Gemini demand spike on ${model}, retrying in ${Math.round(delay)}ms...`);
          await new Promise(r => setTimeout(r, delay));
        } else {
          break; // try next candidate model
        }
      }
    }
  }

  // If all models failed due to free-tier quota limits
  const isAllQuota = lastError?.message?.includes('RESOURCE_EXHAUSTED') ||
    lastError?.message?.includes('Quota exceeded');
  if (isAllQuota) {
    const friendlyError = new Error(
      'Gemini free-tier quota limit reached on available models. Please wait 30 seconds before retrying or use a Gemini API key with billing enabled.'
    );
    friendlyError.status = 429;
    throw friendlyError;
  }

  throw lastError;
}

// ─── Single Media Analysis ──────────────────────────────────────────────────

function buildAnalysisPrompt(projectContext = {}) {
  const { name, description, location, category } = projectContext;

  const projectContextSection = name
    ? `PROJECT CONTEXT (provided by user for reference):
- Project Name: "${name}"
- Project Description: "${description || 'None provided'}"
- Stated Location: "${location || 'None provided'}"
- Project Category / Tag: "${category || 'Auto-detect'}"
Use this project context ONLY as reference context to better interpret what you see. Do NOT assume facts or hallucinate objects/actions that are not visually substantiated in the media.`
    : `PROJECT CONTEXT: General visual evidence analysis.`;

  return `You are an expert AI Visual Evidence Intelligence analyst for ImpactLens.
Your mission is to perform an objective, structured visual inspection of the provided media asset.

${projectContextSection}

CORE PRINCIPLE:
Answer:
- "What does this uploaded media show?"
- "What happened or is happening?"
- "Where and when does the evidence appear to come from?"
- "What visual signals or conditions are present?"
- "What specific evidence supports each conclusion?"

ANTI-HALLUCINATION RULES:
1. Report ONLY what is clearly visible or reasonably inferable from visual cues in the image/video.
2. If a detail (like exact date, exact location, or specific brand/person) cannot be determined, use null or explicit "unknown" and document it in the "uncertainties" list.
3. Do NOT force any single domain (environmental, sustainability, NGO, construction, tourism, etc.) unless the visual evidence genuinely demonstrates it.

You MUST respond with valid JSON only — no markdown formatting around the JSON, no explanation, no code fences.

Use this exact JSON schema:
{
  "description": "string — detailed objective description of what is depicted in the media",
  "scene": {
    "environment": "indoor | outdoor | urban | rural | wilderness | industrial | coastal | commercial | residential | unknown",
    "setting": "string — specific setting description (e.g. mountain pass, temple courtyard, highway, office, forest)",
    "weather": "clear | cloudy | rainy | foggy | snowy | sunny | unknown",
    "timeOfDay": "morning | midday | afternoon | golden hour | evening | night | unknown",
    "lighting": "natural bright | dim | harsh shadows | artificial lighting | overcast | unknown"
  },
  "visibleObjects": [
    {
      "name": "string — name of object/structure/item",
      "category": "string — e.g. architecture, vehicle, nature, tool, clothing, animal, signage",
      "count": "string — estimated count or 'single' | 'multiple'",
      "condition": "string — e.g. intact, damaged, ancient, modern, active, weathered, new, unknown"
    }
  ],
  "activities": [
    {
      "name": "string — name of activity/event",
      "description": "string — description of what is occurring",
      "participants": "string — who or what is performing the activity"
    }
  ],
  "locationClues": {
    "terrain": "string or null",
    "architectureStyle": "string or null",
    "signsOrLanguage": "string or null (any visible scripts, text, license plates)",
    "landmarks": ["string"],
    "estimatedRegion": "string or null (e.g. Northern India, Western Ghats, Mediterranean, or null if uncertain)",
    "notes": "string or null"
  },
  "dateTimeClues": {
    "periodOrEra": "string or null (e.g. modern day, historic)",
    "seasonalIndicators": "string or null (e.g. monsoon foliage, winter clothing)",
    "shadowsOrSunlight": "string or null",
    "visibleClocksOrText": "string or null",
    "notes": "string or null"
  },
  "detectedEntities": {
    "people": {
      "present": true,
      "estimatedCount": "string (e.g. 'none', '1', 'group of 4-6', 'crowd of 50+')",
      "demographicsOrAttire": "string or null"
    },
    "vehicles": ["string"],
    "landmarks": ["string"],
    "floraFauna": ["string"]
  },
  "visualSignals": [
    {
      "signal": "string — key visual clue or state",
      "observation": "string — what is observed",
      "significance": "high | medium | low"
    }
  ],
  "evidenceReferences": [
    {
      "observation": "string — direct visual observation",
      "conclusion": "string — what this visual fact indicates",
      "visualProof": "string — where/how this is seen in the image"
    }
  ],
  "uncertainties": [
    "string — explicit list of details that cannot be verified or remain unknown from this media alone"
  ],
  "tags": ["string — 5-10 relevant descriptive tags"],
  "confidence": "high | medium | low",
  "summary": "string — 2-3 sentence visual evidence synthesis"
}`;
}

/**
 * Convert an image URL to a Gemini inlineData base64 part.
 */
async function fetchUrlAsInlinePart(url, mimeType = 'image/jpeg') {
  const resp = await fetch(url);
  if (!resp.ok) {
    throw new Error(`Failed to fetch media from Cloudinary (${resp.status} ${resp.statusText})`);
  }
  const buffer = await resp.arrayBuffer();
  return {
    inlineData: {
      data: Buffer.from(buffer).toString('base64'),
      mimeType
    }
  };
}

/**
 * Analyze a single media asset with Gemini.
 * Updates the media document in-place.
 */
export async function analyzeMedia(mediaId) {
  const media = await Media.findById(mediaId).populate('project');
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
      const settled = await Promise.allSettled(
        frameUrls.map(url => fetchUrlAsInlinePart(url, 'image/jpeg'))
      );
      imageParts = settled
        .filter(s => s.status === 'fulfilled' && s.value)
        .map(s => s.value);

      // If keyframe extraction returned empty or timed out, fallback to default video poster frame
      if (imageParts.length === 0) {
        console.warn(`[Gemini] Keyframe fetch failed for video ${media.cloudinaryId}, falling back to poster frame...`);
        const fallbackUrl = getThumbnailUrl(media.cloudinaryId, 'video') || cloudinary.url(media.cloudinaryId + '.jpg', { resource_type: 'video', secure: true });
        const fallbackPart = await fetchUrlAsInlinePart(fallbackUrl, 'image/jpeg');
        imageParts = [fallbackPart];
      }
    } else {
      // For images, get optimized URL
      const imageUrl = getAnalysisUrl(media.cloudinaryId, 'image');
      const inlinePart = await fetchUrlAsInlinePart(imageUrl, 'image/jpeg');
      imageParts = [inlinePart];
    }

    const projectContext = media.project ? {
      name: media.project.name,
      description: media.project.description,
      location: media.project.location,
      category: media.project.category
    } : {};

    const promptText = buildAnalysisPrompt(projectContext);

    const { response, modelUsed } = await callGeminiWithRetry({
      model: MODEL,
      contents: [{
        role: 'user',
        parts: [
          ...imageParts,
          { text: promptText }
        ]
      }],
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2
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
      model: modelUsed || MODEL,
      promptVersion: '2.0-evidence',
      processingTimeMs: Date.now() - startTime,
    };

    // Update media tags if tags were generated and media has none
    if (Array.isArray(result.tags) && result.tags.length > 0) {
      const existingTags = new Set(media.tags || []);
      result.tags.slice(0, 8).forEach(t => existingTags.add(t.toLowerCase()));
      media.tags = Array.from(existingTags);
    }

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
  const project = await Project.findById(projectId);

  // Fetch all analyzed media for this project
  const mediaList = await Media.find({
    project: projectId,
    'analysis.status': 'ready'
  }).sort({ createdAt: 1 });

  if (mediaList.length === 0) {
    return {
      answer: 'No analyzed media found for this project yet. Please upload media assets and wait for AI analysis to complete.',
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

  const systemPrompt = `You are an AI Visual Evidence Intelligence assistant for ImpactLens.
You are assisting a user with their project:
- Project Name: "${project?.name || 'Unnamed Project'}"
- Description: "${project?.description || 'None'}"
- Location: "${project?.location || 'None'}"

You have access to structured evidence extracted from the analyzed media assets for this specific project:

${JSON.stringify(mediaContext, null, 2)}

RULES:
1. Answer the user's question based strictly on the evidence extracted from the analyzed media above.
2. Always cite which specific asset(s) support your answer using [Asset #N] notation.
3. If the evidence is insufficient to answer or verify a claim, state that honestly. Do NOT hallucinate unobserved details.
4. Highlight concrete visual proofs, timestamps, location clues, and detected activities.
5. Format your response in clear, concise markdown.

Respond with valid JSON:
{
  "answer": "string — your detailed answer in markdown format with [Asset #N] citations",
  "citations": [
    {
      "assetIndex": number,
      "mediaId": "string — the asset id",
      "relevance": "string — what specific visual evidence in this asset supports the answer"
    }
  ],
  "confidence": "high | medium | low"
}`;

  const { response } = await callGeminiWithRetry({
    model: MODEL,
    contents: [
      { role: 'user', parts: [{ text: systemPrompt }] },
      { role: 'user', parts: [{ text: `Question: ${question}` }] }
    ],
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
 * Compare two media assets and generate an evidence change analysis.
 */
export async function compareMedia(beforeId, afterId) {
  const [before, after] = await Promise.all([
    Media.findById(beforeId).populate('project'),
    Media.findById(afterId).populate('project')
  ]);

  if (!before || !after) {
    throw Object.assign(new Error('One or both media assets not found'), { status: 404 });
  }

  const beforeUrl = getComparisonUrl(before.cloudinaryId);
  const afterUrl = getComparisonUrl(after.cloudinaryId);

  const prompt = `You are an expert AI Visual Evidence Intelligence analyst.
Compare these two images to assess what visual evidence and changes are documented across them:
- Image 1 (BEFORE / REFERENCE STATE): First asset
- Image 2 (AFTER / COMPARISON STATE): Second asset

Project Context: "${before.project?.name || 'Evidence Project'}" - "${before.project?.description || ''}"

Respond with valid JSON only:
{
  "before": {
    "mediaId": "${before._id}",
    "cloudinaryUrl": "${before.cloudinaryUrl}",
    "summary": "string — concise description of what the before image shows"
  },
  "after": {
    "mediaId": "${after._id}",
    "cloudinaryUrl": "${after.cloudinaryUrl}",
    "summary": "string — concise description of what the after image shows"
  },
  "changes": [
    {
      "aspect": "string — feature or area that changed",
      "before": "string — visual state in before image",
      "after": "string — visual state in after image",
      "changeType": "addition | removal | modification | condition change | progression | neutral",
      "significance": "high | medium | low"
    }
  ],
  "overallAssessment": {
    "summary": "string — comprehensive synthesis of what changed between the two captures",
    "evidenceConfidence": "high | medium | low"
  }
}`;

  const [beforePart, afterPart] = await Promise.all([
    fetchUrlAsInlinePart(beforeUrl, 'image/jpeg'),
    fetchUrlAsInlinePart(afterUrl, 'image/jpeg')
  ]);

  const { response } = await callGeminiWithRetry({
    model: MODEL,
    contents: [{
      role: 'user',
      parts: [
        beforePart,
        afterPart,
        { text: prompt }
      ]
    }],
    config: {
      responseMimeType: 'application/json',
      temperature: 0.2
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

