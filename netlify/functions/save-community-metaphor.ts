/**
 * Netlify Function: Save Metaphor to Community
 *
 * POST /.netlify/functions/save-community-metaphor
 * Body: { svg: string, title: string, titleEn: string, prompt: string, author?: string }
 *
 * Saves the metaphor to ai-mindset-org/aim-lms repo via GitHub API
 *
 * Environment variables:
 * - GITHUB_TOKEN: Personal access token with repo write access
 * - GITHUB_REPO: Repository in format "owner/repo" (default: ai-mindset-org/aim-lms)
 */

import type { Handler, HandlerEvent } from '@netlify/functions';

const GITHUB_API = 'https://api.github.com';
const FILE_PATH = 'public/metaphors/community.json';
const DEFAULT_REPO = 'ai-mindset-org/aim-lms';

interface CommunityMetaphor {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  insight: string;
  prompt: string;
  svg: string;
  author: string;
  votes: { up: number; down: number };
  createdAt: string;
  source: 'community';
}

interface CommunityFile {
  version: number;
  updatedAt: string;
  metaphors: CommunityMetaphor[];
}

interface RequestBody {
  svg: string;
  title: string;
  titleEn: string;
  prompt: string;
  author?: string;
}

function generateId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `cm-${timestamp}-${random}`;
}

async function getFileContent(
  repo: string,
  path: string,
  token: string
): Promise<{ content: CommunityFile; sha: string }> {
  const response = await fetch(`${GITHUB_API}/repos/${repo}/contents/${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'AIM-Visual-Toolkit',
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      // File doesn't exist, return empty structure
      return {
        content: {
          version: 1,
          updatedAt: new Date().toISOString(),
          metaphors: [],
        },
        sha: '',
      };
    }
    const errorText = await response.text();
    throw new Error(`GitHub API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const decodedContent = Buffer.from(data.content, 'base64').toString('utf-8');
  const content = JSON.parse(decodedContent) as CommunityFile;

  return { content, sha: data.sha };
}

async function updateFileContent(
  repo: string,
  path: string,
  content: CommunityFile,
  sha: string,
  message: string,
  token: string
): Promise<void> {
  const encodedContent = Buffer.from(JSON.stringify(content, null, 2)).toString('base64');

  const body: Record<string, string> = {
    message,
    content: encodedContent,
    branch: 'main',
  };

  // Only include sha if file exists (for updates)
  if (sha) {
    body.sha = sha;
  }

  const response = await fetch(`${GITHUB_API}/repos/${repo}/contents/${path}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      'User-Agent': 'AIM-Visual-Toolkit',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`GitHub commit failed: ${response.status} - ${errorText}`);
  }
}

const handler: Handler = async (event: HandlerEvent) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle CORS preflight
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

  // Get required environment variables
  const githubToken = process.env.GITHUB_TOKEN;
  const githubRepo = process.env.GITHUB_REPO || DEFAULT_REPO;

  if (!githubToken) {
    console.error('[save-community-metaphor] GITHUB_TOKEN not configured');
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'GitHub integration not configured' }),
    };
  }

  try {
    // Parse request body
    const body = JSON.parse(event.body || '{}') as RequestBody;
    const { svg, title, titleEn, prompt, author = 'anonymous' } = body;

    // Validate required fields
    if (!svg || typeof svg !== 'string') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'SVG is required' }),
      };
    }

    if (!title || typeof title !== 'string') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Title is required' }),
      };
    }

    if (!titleEn || typeof titleEn !== 'string') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'English title is required' }),
      };
    }

    if (!prompt || typeof prompt !== 'string') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Prompt is required' }),
      };
    }

    // Validate SVG is actually an SVG
    if (!svg.includes('<svg') || !svg.includes('</svg>')) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid SVG format' }),
      };
    }

    // Limit SVG size (100KB max)
    if (svg.length > 100000) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'SVG too large (max 100KB)' }),
      };
    }

    console.log(`[save-community-metaphor] Saving metaphor: "${titleEn}" by ${author}`);

    // Fetch current community.json
    const { content: communityData, sha } = await getFileContent(
      githubRepo,
      FILE_PATH,
      githubToken
    );

    // Create new metaphor entry
    const newMetaphor: CommunityMetaphor = {
      id: generateId(),
      title: title.slice(0, 100), // Limit title length
      titleEn: titleEn.toUpperCase().slice(0, 100),
      description: prompt.slice(0, 500),
      insight: '',
      prompt: prompt.slice(0, 500),
      svg,
      author: author.slice(0, 50),
      votes: { up: 0, down: 0 },
      createdAt: new Date().toISOString(),
      source: 'community',
    };

    // Add to beginning of array (newest first)
    communityData.metaphors.unshift(newMetaphor);
    communityData.updatedAt = new Date().toISOString();

    // Commit to GitHub
    const commitMessage = `feat(metaphors): add "${newMetaphor.titleEn}" by ${newMetaphor.author}`;
    await updateFileContent(
      githubRepo,
      FILE_PATH,
      communityData,
      sha,
      commitMessage,
      githubToken
    );

    console.log(`[save-community-metaphor] Successfully saved: ${newMetaphor.id}`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        id: newMetaphor.id,
        message: 'Metaphor saved to community gallery',
      }),
    };
  } catch (error) {
    console.error('[save-community-metaphor] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: `Failed to save metaphor: ${errorMessage}` }),
    };
  }
};

export { handler };
