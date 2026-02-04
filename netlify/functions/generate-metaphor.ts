/**
 * Netlify Function: Generate Visual Metaphor
 *
 * POST /.netlify/functions/generate-metaphor
 * Body: { text: string, style?: 'light' | 'dark', model?: string, apiKey?: string }
 */

import type { Handler, HandlerEvent } from '@netlify/functions';

const CONFIG = {
  apiUrl: 'https://openrouter.ai/api/v1/chat/completions',
  defaultModel: 'google/gemini-3-flash-preview',
  fallbackModel: 'google/gemini-2.5-flash',
  svgSize: 800,
  colors: {
    light: {
      bg: '#FFFFFF',
      accent: '#DC2626',
      text: '#171717',
      muted: '#737373',
    },
    dark: {
      bg: '#0a0a0a',
      accent: '#DC2626',
      text: '#e8e8e8',
      muted: '#666666',
    },
  },
};

const getSystemPrompt = (style: 'light' | 'dark' = 'light') => {
  const colors = CONFIG.colors[style];

  return `You are a visual metaphor designer specializing in Swiss Design style SVG graphics.

DESIGN SYSTEM:
- Canvas: ${CONFIG.svgSize}x${CONFIG.svgSize}px, viewBox="0 0 ${CONFIG.svgSize} ${CONFIG.svgSize}"
- Background: ${colors.bg}
- Primary accent: Swiss Red (${colors.accent})
- Text color: ${colors.text}
- Typography: IBM Plex Mono, font-size 24px for labels
- Style: Minimal, geometric, clean lines

SVG REQUIREMENTS:
1. Output ONLY valid SVG code, no markdown, no explanation
2. Start with <svg width="${CONFIG.svgSize}" height="${CONFIG.svgSize}" viewBox="0 0 ${CONFIG.svgSize} ${CONFIG.svgSize}" xmlns="http://www.w3.org/2000/svg">
3. Include <defs> with <style> for CSS animations
4. Use simple geometric shapes (circles, lines, polygons, rects)
5. Maximum 100 lines of SVG code
6. Include subtle CSS animations (keyframes for pulse, glow, expand)
7. NO title text in the SVG - keep it clean

ANIMATION PATTERNS (use 1-2 per metaphor):
- Pulse: @keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.1); } }
- Glow: @keyframes glow { 0%,100% { opacity: 0.5; } 50% { opacity: 1; } }
- Expand: use <animate> for radius or size changes

METAPHOR TYPES:
- signal_noise: concentric circles + scattered noise dots
- exoskeleton: hexagonal frame around pulsing core
- network: nodes connected with lines
- flow: directional arrows or wave patterns
- layers: horizontal stacked rectangles
- growth: ascending bars or branching tree
- portal: nested shapes creating depth
- balance: symmetrical scales
- compass: directional indicator
- dna: double helix pattern

Choose the most fitting metaphor based on the input concept.

OUTPUT: Return ONLY the complete SVG code. No explanation, no markdown.`;
};

const rateLimits = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimits.get(ip);

  if (!limit || limit.resetAt < now) {
    rateLimits.set(ip, { count: 1, resetAt: now + 60000 });
    return true;
  }

  if (limit.count >= 10) {
    return false;
  }

  limit.count++;
  return true;
}

function normalizeTitle(title: string, fallback: string): string {
  const words = title.replace(/["'`]/g, '').trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return fallback;
  return words.slice(0, 2).join(' ');
}

async function generateTitles(
  text: string,
  apiKey: string,
  model: string
): Promise<{ title: string; titleEn: string } | null> {
  const fallback = text.split(/\s+/).slice(0, 2).join(' ') || 'Metaphor';

  const systemPrompt = `You are naming visual metaphors.
Return ONLY valid JSON with keys "title" and "titleEn".
Rules:
- "title": Russian, 1-2 words, no punctuation
- "titleEn": English, 1-2 words, no punctuation, UPPERCASE
Example: {"title":"Экзоскелет","titleEn":"EXOSKELETON"}`;

  try {
    const response = await fetch(CONFIG.apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://aim-visual-toolkit.netlify.app',
        'X-Title': 'AIM Visual Toolkit',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Concept: "${text}"` },
        ],
        max_tokens: 200,
        temperature: 0.3,
      }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) return null;

    const match = content.match(/\{[\s\S]*\}/);
    if (!match) return null;

    const parsed = JSON.parse(match[0]) as { title?: string; titleEn?: string };
    return {
      title: normalizeTitle(parsed.title || '', fallback),
      titleEn: normalizeTitle(parsed.titleEn || '', fallback).toUpperCase(),
    };
  } catch {
    return null;
  }
}

const handler: Handler = async (event: HandlerEvent) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  // Get API key - prefer user-provided, fallback to env
  const body = JSON.parse(event.body || '{}');
  const apiKey = body.apiKey || process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'No API key configured' }),
    };
  }

  // Rate limiting (skip if user has own key)
  if (!body.apiKey) {
    const clientIp = event.headers['x-forwarded-for'] || event.headers['client-ip'] || 'unknown';
    if (!checkRateLimit(clientIp)) {
      return {
        statusCode: 429,
        headers,
        body: JSON.stringify({ error: 'Too many requests. Wait a minute or use your own API key.' }),
      };
    }
  }

  try {
    const { text, style = 'light', model = CONFIG.defaultModel } = body;

    if (!text || typeof text !== 'string' || text.length < 3) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Text required (min 3 characters)' }),
      };
    }

    if (text.length > 1000) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Text too long (max 1000 characters)' }),
      };
    }

    console.log(`[generate-metaphor] Model: ${model}, Text: "${text.slice(0, 50)}..."`);

    const userPrompt = `Create a visual metaphor SVG for:

"${text}"

Generate a single SVG that visually represents this concept. Choose the most fitting metaphor type.
The visual should be immediately understandable and memorable.
Do NOT include any title text in the SVG.`;

    const startTime = Date.now();

    let response = await fetch(CONFIG.apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://aim-visual-toolkit.netlify.app',
        'X-Title': 'AIM Visual Toolkit',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: getSystemPrompt(style as 'light' | 'dark') },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 4096,
        temperature: 0.7,
      }),
    });

    let usedModel = model;

    // Fallback to default model if selected model fails
    if (!response.ok && model !== CONFIG.fallbackModel) {
      console.log(`[generate-metaphor] Trying fallback: ${CONFIG.fallbackModel}`);
      response = await fetch(CONFIG.apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://aim-visual-toolkit.netlify.app',
          'X-Title': 'AIM Visual Toolkit',
        },
        body: JSON.stringify({
          model: CONFIG.fallbackModel,
          messages: [
            { role: 'system', content: getSystemPrompt(style as 'light' | 'dark') },
            { role: 'user', content: userPrompt },
          ],
          max_tokens: 4096,
          temperature: 0.7,
        }),
      });
      usedModel = CONFIG.fallbackModel;
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[generate-metaphor] API error: ${response.status}`, errorText);
      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({ error: 'AI service error. Check your API key.' }),
      };
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'No content in AI response' }),
      };
    }

    const svgMatch = content.match(/<svg[\s\S]*<\/svg>/);
    if (!svgMatch) {
      console.error('[generate-metaphor] No SVG in response:', content.slice(0, 200));
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'AI did not return valid SVG' }),
      };
    }

    const elapsed = Date.now() - startTime;
    console.log(`[generate-metaphor] Generated in ${elapsed}ms with ${usedModel}`);

    const titles = await generateTitles(text, apiKey, usedModel);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        svg: svgMatch[0],
        model: usedModel,
        elapsed,
        title: titles?.title,
        titleEn: titles?.titleEn,
      }),
    };
  } catch (error) {
    console.error('[generate-metaphor] Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

export { handler };
