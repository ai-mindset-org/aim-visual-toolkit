/**
 * Netlify Function: Generate Visual Metaphor
 *
 * API endpoint to generate SVG visual metaphors using AI
 *
 * POST /.netlify/functions/generate-metaphor
 * Body: { text: string, style?: 'light' | 'dark' }
 *
 * Returns: { svg: string, title?: string, titleEn?: string, elapsed?: number }
 */

import type { Handler, HandlerEvent } from '@netlify/functions';

// Configuration
const CONFIG = {
  apiUrl: 'https://openrouter.ai/api/v1/chat/completions',
  model: 'google/gemini-3-flash-preview',
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

// System prompt for visual metaphor generation
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
7. NO title text in the SVG

ANIMATION PATTERNS (use 1-2 per metaphor):
- Pulse: @keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.1); } }
- Glow: @keyframes glow { 0%,100% { opacity: 0.5; } 50% { opacity: 1; } }
- Expand: use <animate> for radius or size changes

METAPHOR TYPES TO CHOOSE FROM:
- signal_noise: concentric circles + scattered noise dots, central bright core
- exoskeleton: hexagonal frame around pulsing human-like core
- network: nodes connected with lines, some nodes highlighted
- flow: directional arrows or wave patterns
- layers: horizontal stacked rectangles
- growth: ascending bars or branching tree
- portal: nested shapes creating depth illusion
- balance: symmetrical scales or mirrored elements
- compass: directional indicator, navigation metaphor
- dna: double helix pattern for transformation

Choose the most fitting metaphor based on the input concept.

OUTPUT:
Return ONLY the complete SVG code. No explanation, no markdown.`;
};

// Rate limiting (simple in-memory, resets on cold start)
const rateLimits = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimits.get(ip);

  if (!limit || limit.resetAt < now) {
    rateLimits.set(ip, { count: 1, resetAt: now + 60000 }); // 1 minute window
    return true;
  }

  if (limit.count >= 5) {
    // 5 requests per minute
    return false;
  }

  limit.count++;
  return true;
}

function deriveTitleFromText(text: string): string {
  const words = text
    .replace(/["'`]/g, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (words.length === 0) return 'Metaphor';
  return words.slice(0, 2).join(' ');
}

function normalizeTitle(title: string, fallback: string): string {
  const words = title
    .replace(/["'`]/g, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (words.length === 0) return fallback;
  return words.slice(0, 2).join(' ');
}

async function generateTitles(
  text: string,
  apiKey: string
): Promise<{ title: string; titleEn: string } | null> {
  const fallback = deriveTitleFromText(text);
  const systemPrompt = `You are naming visual metaphors.
Return ONLY valid JSON with keys "title" and "titleEn".
Rules:
- "title": Russian, 1-2 words, no punctuation
- "titleEn": English, 1-2 words, no punctuation
- Use Title Case when possible
Example output: {"title":"Экзоскелет","titleEn":"Exoskeleton"}`;

  const response = await fetch(CONFIG.apiUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://aim-visual-toolkit.netlify.app',
      'X-Title': 'AIM Visual Toolkit',
    },
    body: JSON.stringify({
      model: CONFIG.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Concept: "${text}"` },
      ],
      max_tokens: 200,
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    return null;
  }

  const match = content.match(/\{[\s\S]*\}/);
  if (!match) {
    return null;
  }

  try {
    const parsed = JSON.parse(match[0]) as { title?: string; titleEn?: string };
    const title = normalizeTitle(parsed.title || '', fallback);
    const titleEn = normalizeTitle(parsed.titleEn || '', fallback);
    return { title, titleEn };
  } catch {
    return null;
  }
}

// Main handler
const handler: Handler = async (event: HandlerEvent) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  // Only POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  // Check API key
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Server configuration error' }),
    };
  }

  // Rate limiting
  const clientIp = event.headers['x-forwarded-for'] || event.headers['client-ip'] || 'unknown';
  if (!checkRateLimit(clientIp)) {
    return {
      statusCode: 429,
      headers,
      body: JSON.stringify({ error: 'Too many requests. Please wait a minute.' }),
    };
  }

  try {
    // Parse request body
    const body = JSON.parse(event.body || '{}');
    const { text, style = 'light' } = body;

    if (!text || typeof text !== 'string' || text.length < 3) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Text is required (min 3 characters)' }),
      };
    }

    if (text.length > 1000) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Text too long (max 1000 characters)' }),
      };
    }

    console.log(`[generate-metaphor] Generating for: "${text.slice(0, 50)}..."`);

    // Build prompt
    const userPrompt = `Create a visual metaphor SVG for this concept:

"${text}"

Generate a single SVG that visually represents this idea. Choose the most fitting metaphor type based on the content.
The visual should be immediately understandable and memorable.
Do NOT include any title text in the SVG.`;

    // Call OpenRouter API
    const startTime = Date.now();

    const response = await fetch(CONFIG.apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://aim-visual-toolkit.netlify.app',
        'X-Title': 'AIM Visual Toolkit',
      },
      body: JSON.stringify({
        model: CONFIG.model,
        messages: [
          { role: 'system', content: getSystemPrompt(style as 'light' | 'dark') },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 4096,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[generate-metaphor] API error: ${response.status}`, errorText);

      // Try fallback model
      if (response.status === 400 || response.status === 404) {
        console.log(`[generate-metaphor] Trying fallback model: ${CONFIG.fallbackModel}`);
        const fallbackResponse = await fetch(CONFIG.apiUrl, {
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

        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          const content = fallbackData.choices?.[0]?.message?.content;

          if (content) {
            const svgMatch = content.match(/<svg[\s\S]*<\/svg>/);
            if (svgMatch) {
              const elapsed = Date.now() - startTime;
              console.log(`[generate-metaphor] Generated (fallback) in ${elapsed}ms`);

              const titles = await generateTitles(text, apiKey);

              return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                  svg: svgMatch[0],
                  model: CONFIG.fallbackModel,
                  elapsed,
                  title: titles?.title,
                  titleEn: titles?.titleEn,
                }),
              };
            }
          }
        }
      }

      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({ error: 'AI service temporarily unavailable' }),
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

    // Extract SVG from response
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
    console.log(`[generate-metaphor] Generated in ${elapsed}ms`);

    const titles = await generateTitles(text, apiKey);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        svg: svgMatch[0],
        model: CONFIG.model,
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
