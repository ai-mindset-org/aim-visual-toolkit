/**
 * Metaphor Data Types and Catalog
 * All UI in English
 */

export interface Metaphor {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  insight?: string;
  categories: string[];
  source: 'core' | 'community' | 'generated';
  format: 'svg-file' | 'svg-inline';
  filename?: string;
  svg?: string;
  prompt?: string;
  author?: string;
}

export type Category = {
  id: string;
  label: string;
  accent?: boolean; // Special styling (red accent)
};

export const CATEGORIES: Category[] = [
  { id: 'all', label: 'All' },
  { id: 'ai', label: 'AI & Models' },
  { id: 'thinking', label: 'Thinking' },
  { id: 'system', label: 'Systems' },
  { id: 'communication', label: 'Communication' },
  { id: 'learning', label: 'Learning' },
  { id: 'fos', label: 'Founder OS' },
  { id: 'community', label: 'Community', accent: true },
];

export const METAPHORS: Metaphor[] = [
  {
    id: 'exoskeleton',
    title: 'Exoskeleton',
    titleEn: 'EXOSKELETON',
    description: 'AI as external frame amplifying human capabilities',
    insight: 'AI doesn\'t replace expertise — it amplifies it.',
    categories: ['ai', 'system'],
    source: 'core',
    format: 'svg-file',
    filename: 'exoskeleton.svg',
  },
  {
    id: 'prompt-structure',
    title: 'Prompt Structure',
    titleEn: 'PROMPT STRUCTURE',
    description: 'Anatomy of an effective request: context, task, format, constraints',
    insight: 'Not clever prompts, but quality of context.',
    categories: ['thinking', 'communication'],
    source: 'core',
    format: 'svg-file',
    filename: 'prompt-structure.svg',
  },
  {
    id: 'chain-of-thought',
    title: 'Chain of Thought',
    titleEn: 'CHAIN OF THOUGHT',
    description: 'Step-by-step reasoning for complex tasks',
    insight: 'Better context = better prediction.',
    categories: ['thinking', 'ai'],
    source: 'core',
    format: 'svg-file',
    filename: 'chain-of-thought.svg',
  },
  {
    id: 'voice-wave',
    title: 'Voice Wave',
    titleEn: 'VOICE WAVE',
    description: 'Voice as natural interface for AI interaction',
    insight: 'Voice input accelerates work dramatically.',
    categories: ['communication'],
    source: 'core',
    format: 'svg-file',
    filename: 'voice-wave.svg',
  },
  {
    id: 'second-brain',
    title: 'Second Brain',
    titleEn: 'SECOND BRAIN',
    description: 'Personal knowledge base for storing and processing context',
    insight: 'Context should live with you, not in service memory.',
    categories: ['thinking', 'system'],
    source: 'core',
    format: 'svg-file',
    filename: 'second-brain.svg',
  },
  {
    id: 'four-weeks',
    title: 'Four Weeks',
    titleEn: 'FOUR WEEKS',
    description: 'Lab structure: Prompt → Context → Mind → Life',
    insight: 'Each week — a new layer of AI integration.',
    categories: ['system', 'learning'],
    source: 'core',
    format: 'svg-file',
    filename: 'four-weeks.svg',
  },
  {
    id: 'context-ai',
    title: 'Context + AI',
    titleEn: 'CONTEXT + AI',
    description: 'Symbiosis of personal context and artificial intelligence',
    insight: 'Context matters more than prompts.',
    categories: ['ai', 'communication'],
    source: 'core',
    format: 'svg-file',
    filename: 'context-ai.svg',
  },
  {
    id: 'alchemy',
    title: 'Context Alchemy',
    titleEn: 'CONTEXT ALCHEMY',
    description: 'Transforming raw data into golden insights',
    insight: 'Mixing sources creates new artifacts.',
    categories: ['thinking'],
    source: 'core',
    format: 'svg-file',
    filename: 'alchemy.svg',
  },
  {
    id: 'symbiosis-loop',
    title: 'Symbiosis Loop',
    titleEn: 'SYMBIOSIS LOOP',
    description: 'Mutual enhancement through iterative human-AI interaction',
    insight: 'Productivity is not speed, but awareness.',
    categories: ['ai', 'system'],
    source: 'core',
    format: 'svg-file',
    filename: 'symbiosis-loop.svg',
  },
  {
    id: 'digital-twin',
    title: 'Digital Twin',
    titleEn: 'DIGITAL TWIN',
    description: 'Virtual copy for modeling and testing decisions',
    insight: 'About Me file is your digital twin.',
    categories: ['ai', 'system'],
    source: 'core',
    format: 'svg-file',
    filename: 'digital-twin.svg',
  },
  {
    id: 'alignment',
    title: 'Alignment',
    titleEn: 'ALIGNMENT',
    description: 'Aligning human and AI goals',
    insight: 'Success criterion: what state is the target.',
    categories: ['thinking', 'ai'],
    source: 'core',
    format: 'svg-file',
    filename: 'alignment.svg',
  },
  {
    id: 'architecture-layers',
    title: 'Architecture Layers',
    titleEn: 'ARCHITECTURE LAYERS',
    description: 'Multi-level structure of agent systems',
    insight: 'Agent = AI + tools + memory + goal.',
    categories: ['system'],
    source: 'core',
    format: 'svg-file',
    filename: 'architecture-layers.svg',
  },
  {
    id: 'intent-economy',
    title: 'Intent Economy',
    titleEn: 'INTENT ECONOMY',
    description: 'Transition from attention economy to intent economy',
    insight: 'AI allows monetizing intentions, not attention.',
    categories: ['communication'],
    source: 'core',
    format: 'svg-file',
    filename: 'intent-economy.svg',
  },
  {
    id: 'interface-portal',
    title: 'Interface Portal',
    titleEn: 'INTERFACE PORTAL',
    description: 'AI OS as single entry point to all tools',
    insight: 'Not scattered chats, but unified system.',
    categories: ['communication', 'system'],
    source: 'core',
    format: 'svg-file',
    filename: 'interface-portal.svg',
  },
  {
    id: 'leverage',
    title: 'Leverage',
    titleEn: 'LEVERAGE',
    description: 'AI as lever for multiplying productivity and impact',
    insight: 'One context file transforms every conversation.',
    categories: ['system'],
    source: 'core',
    format: 'svg-file',
    filename: 'leverage.svg',
  },
  {
    id: 'book-basics',
    title: 'Book: Basics',
    titleEn: 'BOOK BASICS',
    description: 'Fundamental knowledge about AI',
    categories: ['learning'],
    source: 'core',
    format: 'svg-file',
    filename: 'book-basics.svg',
  },
  {
    id: 'book-practice',
    title: 'Book: Practice',
    titleEn: 'BOOK PRACTICE',
    description: 'Practical skills for working with AI',
    categories: ['learning'],
    source: 'core',
    format: 'svg-file',
    filename: 'book-practice.svg',
  },
  {
    id: 'book-design',
    title: 'Book: Design',
    titleEn: 'BOOK DESIGN',
    description: 'Designing interactions with AI',
    categories: ['learning'],
    source: 'core',
    format: 'svg-file',
    filename: 'book-design.svg',
  },
  {
    id: 'book-advanced',
    title: 'Book: Advanced',
    titleEn: 'BOOK ADVANCED',
    description: 'Advanced techniques for AI',
    categories: ['learning'],
    source: 'core',
    format: 'svg-file',
    filename: 'book-advanced.svg',
  },
  {
    id: 'model-landscape',
    title: 'Model Landscape',
    titleEn: 'MODEL LANDSCAPE',
    description: 'Map of AI models and their capabilities',
    insight: 'Different models for different tasks.',
    categories: ['ai'],
    source: 'core',
    format: 'svg-file',
    filename: 'model-landscape.svg',
  },
  {
    id: 'founder-os-system',
    title: 'Founder OS',
    titleEn: 'FOUNDER OS',
    description: '4 principles: Context, Systems, AI, Public',
    insight: 'Not chaos of tools, but coherent system.',
    categories: ['fos'],
    source: 'core',
    format: 'svg-file',
    filename: 'fos18/founder-os-system.svg',
  },
  {
    id: 'fos18-two-systems',
    title: 'Two Systems',
    titleEn: 'TWO SYSTEMS',
    description: 'Obsidian CMS + AI Mindset LMS — different speed, same approach',
    insight: 'AI accelerates, you design architecture.',
    categories: ['fos'],
    source: 'core',
    format: 'svg-file',
    filename: 'fos18/fos18-two-systems.svg',
  },
  {
    id: 'obsidian-flow',
    title: 'Content Flow',
    titleEn: 'CONTENT FLOW',
    description: 'Markdown → AI processing → multi-channel publishing',
    insight: 'Single source of truth, multiple outputs.',
    categories: ['fos'],
    source: 'core',
    format: 'svg-file',
    filename: 'fos18/obsidian-flow.svg',
  },
  {
    id: 'ai-sprint',
    title: 'AI Sprint',
    titleEn: 'AI SPRINT',
    description: 'Parallel task execution by multiple AI agents',
    insight: '3 agents = 3x faster.',
    categories: ['fos'],
    source: 'core',
    format: 'svg-file',
    filename: 'fos18/ai-sprint.svg',
  },
  {
    id: 'agent-triad',
    title: 'Agent Triad',
    titleEn: 'AGENT TRIAD',
    description: 'Three types of AI agents: Executor, Analyst, Creator',
    insight: 'Different agents for different tasks.',
    categories: ['fos', 'system'],
    source: 'core',
    format: 'svg-file',
    filename: 'agent-triad.svg',
  },
  {
    id: 'signal',
    title: 'Signal',
    titleEn: 'SIGNAL',
    description: 'Separating signal from noise in information flow',
    insight: 'AI helps find what matters in the chaos of data.',
    categories: ['thinking', 'communication'],
    source: 'core',
    format: 'svg-file',
    filename: 'signal.svg',
  },
];

// Community metaphors loaded from community.json
// This is the initial state - will be populated by loadCommunityMetaphors()
let communityMetaphorsCache: Metaphor[] = [];
let communityMetaphorsLoaded = false;

/**
 * Raw community metaphor from community.json
 */
interface CommunityMetaphorRaw {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  insight?: string;
  prompt?: string;
  svg?: string;
  author?: string;
  votes?: { up: number; down: number };
  createdAt: string;
  source: 'community';
}

/**
 * Community JSON file structure
 */
interface CommunityJsonFile {
  version: number;
  updatedAt: string;
  metaphors: CommunityMetaphorRaw[];
}

/**
 * Convert raw community metaphor to Metaphor type
 */
function convertCommunityMetaphor(raw: CommunityMetaphorRaw): Metaphor {
  return {
    id: raw.id,
    title: raw.titleEn || raw.title,
    titleEn: raw.titleEn?.toUpperCase() || raw.title.toUpperCase(),
    description: raw.description,
    insight: raw.insight,
    categories: ['community'],
    source: 'community',
    format: raw.svg ? 'svg-inline' : 'svg-file',
    svg: raw.svg,
    prompt: raw.prompt,
    author: raw.author,
  };
}

/**
 * Load community metaphors from community.json
 * Returns cached results on subsequent calls unless forceReload is true
 */
export async function loadCommunityMetaphors(forceReload = false): Promise<Metaphor[]> {
  if (communityMetaphorsLoaded && !forceReload) {
    return communityMetaphorsCache;
  }

  try {
    // Add cache-busting param when force reloading
    const url = forceReload
      ? `/metaphors/community.json?t=${Date.now()}`
      : '/metaphors/community.json';
    const response = await fetch(url);
    if (!response.ok) {
      console.warn('Failed to load community.json:', response.status);
      return [];
    }

    const data: CommunityJsonFile = await response.json();
    communityMetaphorsCache = data.metaphors.map(convertCommunityMetaphor);
    communityMetaphorsLoaded = true;
    return communityMetaphorsCache;
  } catch (error) {
    console.warn('Error loading community metaphors:', error);
    return [];
  }
}

/**
 * Force reload community metaphors from server
 * Bypasses cache and fetches fresh data
 */
export async function reloadCommunityMetaphors(): Promise<Metaphor[]> {
  return loadCommunityMetaphors(true);
}

/**
 * Clear community metaphors cache
 * Next call to loadCommunityMetaphors will fetch fresh data
 */
export function clearCommunityCache(): void {
  communityMetaphorsCache = [];
  communityMetaphorsLoaded = false;
}

/**
 * Get cached community metaphors (empty until loadCommunityMetaphors is called)
 */
export function getCommunityMetaphors(): Metaphor[] {
  return communityMetaphorsCache;
}

/**
 * Check if community metaphors have been loaded
 */
export function isCommunityLoaded(): boolean {
  return communityMetaphorsLoaded;
}

// Legacy export for backwards compatibility
export const COMMUNITY_METAPHORS: Metaphor[] = [];

export const ALL_METAPHORS = [...METAPHORS];
export let TOTAL_COUNT = ALL_METAPHORS.length;

/**
 * Get all metaphors including community (must be called after loadCommunityMetaphors)
 */
export function getAllMetaphors(): Metaphor[] {
  return [...METAPHORS, ...communityMetaphorsCache];
}

/**
 * Get total count including community metaphors
 */
export function getTotalCount(): number {
  return METAPHORS.length + communityMetaphorsCache.length;
}

export function getMetaphorsByCategory(categoryId: string): Metaphor[] {
  const all = getAllMetaphors();
  if (categoryId === 'all') return all;
  if (categoryId === 'community') return communityMetaphorsCache;
  return all.filter((m) => m.categories.includes(categoryId));
}

export function getMetaphorById(id: string): Metaphor | undefined {
  return getAllMetaphors().find((m) => m.id === id);
}

export function searchMetaphors(query: string): Metaphor[] {
  const q = query.toLowerCase();
  return getAllMetaphors().filter(
    (m) =>
      m.title.toLowerCase().includes(q) ||
      m.titleEn.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q) ||
      m.insight?.toLowerCase().includes(q)
  );
}

/**
 * Check if a category has the accent styling
 */
export function isCategoryAccent(categoryId: string): boolean {
  const cat = CATEGORIES.find((c) => c.id === categoryId);
  return cat?.accent ?? false;
}
