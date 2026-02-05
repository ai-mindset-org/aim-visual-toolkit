/**
 * Netlify Function: Generate Visual Metaphor
 *
 * POST /.netlify/functions/generate-metaphor
 * Body: {
 *   text: string,
 *   style?: 'light' | 'dark',
 *   model?: string,
 *   apiKey?: string,
 *   complexity?: 'minimal' | 'standard' | 'detailed',
 *   animation?: 'none' | 'subtle' | 'active'
 * }
 */

import type { Handler, HandlerEvent } from '@netlify/functions';

type ComplexityLevel = 'minimal' | 'standard' | 'detailed';
type AnimationLevel = 'none' | 'subtle' | 'active';

const CONFIG = {
  apiUrl: 'https://openrouter.ai/api/v1/chat/completions',
  defaultModel: 'google/gemini-2.0-flash-001',
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

const getComplexityInstructions = (complexity: ComplexityLevel): string => {
  switch (complexity) {
    case 'minimal':
      return `COMPLEXITY: MINIMAL
- Use only 3-5 basic shapes (circles, rectangles, lines)
- Maximum 50 lines of SVG code
- Single focal point, no decorative elements
- Clean negative space, very sparse composition
- Prefer solid fills over gradients`;
    case 'detailed':
      return `COMPLEXITY: DETAILED
- Use 10-20 shapes with varied types
- Maximum 150 lines of SVG code
- Multiple visual layers and depth
- Include decorative elements and patterns
- Use gradients, shadows, and visual effects
- Add secondary accents and supporting elements`;
    default: // standard
      return `COMPLEXITY: STANDARD
- Use 5-10 shapes
- Maximum 100 lines of SVG code
- Balanced composition with clear hierarchy
- Some decorative elements allowed`;
  }
};

const getAnimationInstructions = (animation: AnimationLevel): string => {
  switch (animation) {
    case 'none':
      return `ANIMATION: NONE
- Do NOT include any CSS animations or keyframes
- Do NOT use <animate> or <animateTransform> elements
- Create a completely static SVG
- No transitions, no movement`;
    case 'active':
      return `ANIMATION: ACTIVE
- Include 3-5 different animations
- Use faster durations (1-3 seconds)
- Apply animations to multiple elements
- Combine different animation types (scale, opacity, position, rotation)
- Create energetic, dynamic movement
- Example keyframes:
  @keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.2); } }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
  @keyframes flash { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }`;
    default: // subtle
      return `ANIMATION: SUBTLE
- Include 1-2 gentle animations
- Use slow durations (3-6 seconds)
- Apply to 1-2 key elements only
- Prefer opacity and small scale changes
- Create calm, ambient movement
- Example keyframes:
  @keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.05); } }
  @keyframes glow { 0%,100% { opacity: 0.6; } 50% { opacity: 1; } }`;
  }
};

const getSystemPrompt = (
  style: 'light' | 'dark' = 'light',
  complexity: ComplexityLevel = 'standard',
  animation: AnimationLevel = 'subtle'
) => {
  const colors = CONFIG.colors[style];
  const complexityInstructions = getComplexityInstructions(complexity);
  const animationInstructions = getAnimationInstructions(animation);

  return `You are a visual metaphor designer specializing in Swiss Design style SVG graphics.

DESIGN SYSTEM:
- Canvas: ${CONFIG.svgSize}x${CONFIG.svgSize}px, viewBox="0 0 ${CONFIG.svgSize} ${CONFIG.svgSize}"
- Background: ${colors.bg}
- Primary accent: Swiss Red (${colors.accent})
- Text color: ${colors.text}
- Typography: IBM Plex Mono, font-size 24px for labels
- Style: Minimal, geometric, clean lines

${complexityInstructions}

${animationInstructions}

SVG REQUIREMENTS:
1. Output ONLY valid SVG code, no markdown, no explanation
2. Start with <svg width="${CONFIG.svgSize}" height="${CONFIG.svgSize}" viewBox="0 0 ${CONFIG.svgSize} ${CONFIG.svgSize}" xmlns="http://www.w3.org/2000/svg">
3. Include <defs> with <style> for CSS (even if no animations)
4. Use geometric shapes (circles, lines, polygons, rects, paths)
5. NO title text in the SVG - keep it clean

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
- radar: scanning arc with detection points
- orbit: planetary/electron orbits
- fractal: recursive patterns
- wave: sinusoidal interference patterns

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
    const {
      text,
      style = 'light',
      model = CONFIG.defaultModel,
      complexity = 'standard',
      animation = 'subtle',
    } = body as {
      text: string;
      style?: 'light' | 'dark';
      model?: string;
      complexity?: ComplexityLevel;
      animation?: AnimationLevel;
    };

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

    // Validate complexity and animation
    const validComplexity: ComplexityLevel = ['minimal', 'standard', 'detailed'].includes(complexity)
      ? complexity
      : 'standard';
    const validAnimation: AnimationLevel = ['none', 'subtle', 'active'].includes(animation)
      ? animation
      : 'subtle';

    console.log(`[generate-metaphor] Model: ${model}, Complexity: ${validComplexity}, Animation: ${validAnimation}, Text: "${text.slice(0, 50)}..."`);

    const userPrompt = `Create a visual metaphor SVG for:

"${text}"

Generate a single SVG that visually represents this concept. Choose the most fitting metaphor type.
The visual should be immediately understandable and memorable.
Do NOT include any title text in the SVG.
Remember: ${validComplexity} complexity, ${validAnimation} animation.`;

    const startTime = Date.now();

    const systemPrompt = getSystemPrompt(
      style as 'light' | 'dark',
      validComplexity,
      validAnimation
    );

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
          { role: 'system', content: systemPrompt },
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
            { role: 'system', content: systemPrompt },
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
