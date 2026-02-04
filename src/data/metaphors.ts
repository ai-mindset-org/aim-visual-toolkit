/**
 * Metaphor Data Types and Catalog
 * Based on LMS CORE_METAPHORS with full metadata
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
  workshop?: string;
  week?: number;
  index?: number; // For display like 01/20
  prompt?: string; // Generation prompt
  author?: string;
}

export type Category = {
  id: string;
  label: string;
};

export const CATEGORIES: Category[] = [
  { id: 'all', label: 'All' },
  { id: 'w1', label: 'Week 1' },
  { id: 'w2', label: 'Week 2' },
  { id: 'w3', label: 'Week 3' },
  { id: 'w4', label: 'Week 4' },
  { id: 'advanced', label: 'Advanced' },
  { id: 'fos', label: 'Founder OS' },
  { id: 'community', label: 'Community' },
];

// Core Metaphors from LMS - ordered by workshop sequence
export const METAPHORS: Metaphor[] = [
  // WS00: INTRO
  {
    id: 'exoskeleton',
    title: 'Exoskeleton',
    titleEn: 'EXOSKELETON',
    description: 'AI as external frame amplifying human capabilities',
    insight: 'AI doesn\'t replace expertise — it amplifies it.',
    categories: ['w1'],
    source: 'core',
    format: 'svg-file',
    filename: 'exoskeleton.svg',
    workshop: 'ws00',
    week: 1,
    index: 1,
  },

  // WS01: PROMPT ENGINEERING
  {
    id: 'prompt-structure',
    title: 'Prompt Structure',
    titleEn: 'PROMPT STRUCTURE',
    description: 'Anatomy of effective request: context, task, format, constraints',
    insight: 'Not clever prompts, but quality of context and clarity of task.',
    categories: ['w1'],
    source: 'core',
    format: 'svg-file',
    filename: 'prompt-structure.svg',
    workshop: 'ws01',
    week: 1,
    index: 2,
  },
  {
    id: 'chain-of-thought',
    title: 'Chain of Thought',
    titleEn: 'CHAIN OF THOUGHT',
    description: 'Step-by-step reasoning for complex tasks',
    insight: 'LLM predicts next token. Better context = better prediction.',
    categories: ['w1'],
    source: 'core',
    format: 'svg-file',
    filename: 'chain-of-thought.svg',
    workshop: 'ws01',
    week: 1,
    index: 3,
  },
  {
    id: 'voice-wave',
    title: 'Voice Wave',
    titleEn: 'VOICE WAVE',
    description: 'Voice as natural interface for AI interaction',
    insight: 'Voice input accelerates work dramatically.',
    categories: ['w1'],
    source: 'core',
    format: 'svg-file',
    filename: 'voice-wave.svg',
    workshop: 'ws01',
    week: 1,
    index: 4,
  },
  {
    id: 'second-brain',
    title: 'Second Brain',
    titleEn: 'SECOND BRAIN',
    description: 'Personal knowledge base for storing and processing context',
    insight: 'Context should live with you, not in service memory.',
    categories: ['w1'],
    source: 'core',
    format: 'svg-file',
    filename: 'second-brain.svg',
    workshop: 'ws01',
    week: 1,
    index: 5,
  },
  {
    id: 'four-weeks',
    title: 'Four Weeks',
    titleEn: 'FOUR WEEKS',
    description: 'Lab structure: Prompt → Context → Mind → Life',
    insight: 'Each week — a new layer of AI integration into life.',
    categories: ['w1'],
    source: 'core',
    format: 'svg-file',
    filename: 'four-weeks.svg',
    workshop: 'ws01',
    week: 1,
    index: 6,
  },

  // WS02: CONTEXT ENGINEERING
  {
    id: 'context-ai',
    title: 'Context + AI',
    titleEn: 'CONTEXT + AI',
    description: 'Symbiosis of personal context and artificial intelligence',
    insight: 'Context matters more than prompts.',
    categories: ['w2'],
    source: 'core',
    format: 'svg-file',
    filename: 'context-ai.svg',
    workshop: 'ws02',
    week: 2,
    index: 7,
  },
  {
    id: 'alchemy',
    title: 'Context Alchemy',
    titleEn: 'CONTEXT ALCHEMY',
    description: 'Transforming raw data into golden insights',
    insight: 'Mixing sources creates new artifacts.',
    categories: ['w2'],
    source: 'core',
    format: 'svg-file',
    filename: 'alchemy.svg',
    workshop: 'ws02',
    week: 2,
    index: 8,
  },

  // WS03: MIND ENGINEERING
  {
    id: 'symbiosis-loop',
    title: 'Symbiosis Loop',
    titleEn: 'SYMBIOSIS LOOP',
    description: 'Mutual enhancement of human and AI through iteration',
    insight: 'Productivity is not speed, but awareness.',
    categories: ['w3'],
    source: 'core',
    format: 'svg-file',
    filename: 'symbiosis-loop.svg',
    workshop: 'ws03',
    week: 3,
    index: 9,
  },

  // WS04: LIFE ENGINEERING
  {
    id: 'digital-twin',
    title: 'Digital Twin',
    titleEn: 'DIGITAL TWIN',
    description: 'Virtual copy for modeling and testing decisions',
    insight: 'About Me file is your digital twin.',
    categories: ['w4'],
    source: 'core',
    format: 'svg-file',
    filename: 'digital-twin.svg',
    workshop: 'ws04',
    week: 4,
    index: 10,
  },

  // ADVANCED TRACK
  {
    id: 'alignment',
    title: 'Alignment',
    titleEn: 'ALIGNMENT',
    description: 'Aligning human and AI goals',
    insight: 'Success criterion: what state is the target.',
    categories: ['advanced'],
    source: 'core',
    format: 'svg-file',
    filename: 'alignment.svg',
    workshop: 'at01',
    index: 11,
  },
  {
    id: 'architecture-layers',
    title: 'Architecture Layers',
    titleEn: 'ARCHITECTURE LAYERS',
    description: 'Multi-level structure of agent systems',
    insight: 'Agent = AI + tools + memory + goal.',
    categories: ['advanced'],
    source: 'core',
    format: 'svg-file',
    filename: 'architecture-layers.svg',
    workshop: 'at02',
    index: 12,
  },
  {
    id: 'intent-economy',
    title: 'Intent Economy',
    titleEn: 'INTENT ECONOMY',
    description: 'Transition from attention economy to intent economy',
    insight: 'AI allows monetizing intentions, not attention.',
    categories: ['advanced'],
    source: 'core',
    format: 'svg-file',
    filename: 'intent-economy.svg',
    workshop: 'at04',
    index: 13,
  },
  {
    id: 'interface-portal',
    title: 'Interface Portal',
    titleEn: 'INTERFACE PORTAL',
    description: 'AI OS as single entry point to all tools',
    insight: 'Not scattered chats, but unified system with context.',
    categories: ['advanced'],
    source: 'core',
    format: 'svg-file',
    filename: 'interface-portal.svg',
    workshop: 'at05',
    index: 14,
  },

  // GENERAL
  {
    id: 'leverage',
    title: 'Leverage',
    titleEn: 'LEVERAGE',
    description: 'AI as lever for multiplying productivity and impact',
    insight: 'One context file transforms every AI conversation.',
    categories: ['advanced'],
    source: 'core',
    format: 'svg-file',
    filename: 'leverage.svg',
    workshop: 'demo-day',
    index: 15,
  },
  {
    id: 'model-landscape',
    title: 'Model Landscape',
    titleEn: 'MODEL LANDSCAPE',
    description: 'Map of AI models and their capabilities',
    insight: 'Different models for different tasks.',
    categories: ['advanced'],
    source: 'core',
    format: 'svg-file',
    filename: 'model-landscape.svg',
    index: 16,
  },

  // FOUNDER OS
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
    index: 17,
  },
  {
    id: 'fos18-two-systems',
    title: 'Two Systems',
    titleEn: 'TWO SYSTEMS',
    description: 'Obsidian CMS (8 months) + AI Mindset LMS (1 week)',
    insight: 'AI accelerates development, but you design architecture.',
    categories: ['fos'],
    source: 'core',
    format: 'svg-file',
    filename: 'fos18/fos18-two-systems.svg',
    index: 18,
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
    index: 19,
  },
  {
    id: 'ai-sprint',
    title: 'AI Sprint',
    titleEn: 'AI SPRINT',
    description: 'Parallel task execution by multiple AI agents',
    insight: 'Not sequential, but parallel. 3 agents = 3x faster.',
    categories: ['fos'],
    source: 'core',
    format: 'svg-file',
    filename: 'fos18/ai-sprint.svg',
    index: 20,
  },

  // BOOKS (bonus)
  {
    id: 'book-basics',
    title: 'Book: Basics',
    titleEn: 'BOOK BASICS',
    description: 'Fundamental knowledge about AI',
    categories: ['w1'],
    source: 'core',
    format: 'svg-file',
    filename: 'book-basics.svg',
    index: 21,
  },
  {
    id: 'book-practice',
    title: 'Book: Practice',
    titleEn: 'BOOK PRACTICE',
    description: 'Practical skills for working with AI',
    categories: ['w2'],
    source: 'core',
    format: 'svg-file',
    filename: 'book-practice.svg',
    index: 22,
  },
  {
    id: 'book-design',
    title: 'Book: Design',
    titleEn: 'BOOK DESIGN',
    description: 'Designing interactions with AI',
    categories: ['w3'],
    source: 'core',
    format: 'svg-file',
    filename: 'book-design.svg',
    index: 23,
  },
  {
    id: 'book-advanced',
    title: 'Book: Advanced',
    titleEn: 'BOOK ADVANCED',
    description: 'Advanced techniques for working with AI',
    categories: ['w4'],
    source: 'core',
    format: 'svg-file',
    filename: 'book-advanced.svg',
    index: 24,
  },
];

// Community metaphor from LMS
export const COMMUNITY_METAPHORS: Metaphor[] = [
  {
    id: 'cm-digital-smile',
    title: 'Digital Smile',
    titleEn: 'DIGITAL SMILE',
    description: 'Wide smile on screen - connection through interface',
    insight: 'Remember how they embraced me beautifully',
    categories: ['community'],
    source: 'community',
    format: 'svg-inline',
    svg: `<svg width="800" height="800" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .frame { fill: none; stroke: #171717; stroke-width: 4; }
      .accent { fill: #DC2626; }
      .smile-path { fill: none; stroke: #DC2626; stroke-width: 12; stroke-linecap: round; }
      @keyframes expand-width { 0%, 100% { transform: scaleX(1); } 50% { transform: scaleX(1.15); } }
      @keyframes glow-pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
      .animate-smile { transform-origin: center; animation: expand-width 3s ease-in-out infinite; }
      .animate-glow { animation: glow-pulse 2s ease-in-out infinite; }
    </style>
  </defs>
  <rect width="800" height="800" fill="#FFFFFF" />
  <rect x="100" y="200" width="600" height="400" rx="8" class="frame" />
  <circle cx="130" cy="230" r="6" fill="#171717" />
  <circle cx="150" cy="230" r="6" fill="#171717" />
  <circle cx="170" cy="230" r="6" fill="#171717" />
  <g class="animate-glow">
    <rect x="250" y="320" width="60" height="12" fill="#171717" />
    <rect x="490" y="320" width="60" height="12" fill="#171717" />
  </g>
  <g class="animate-smile">
    <path d="M 200 420 Q 400 580 600 420" class="smile-path" />
    <rect x="190" y="410" width="20" height="20" class="accent" />
    <rect x="590" y="410" width="20" height="20" class="accent" />
  </g>
</svg>`,
    author: 'alex',
    prompt: 'Wide smile on screen',
    index: 25,
  },
];

export const ALL_METAPHORS = [...METAPHORS, ...COMMUNITY_METAPHORS];

export const TOTAL_COUNT = ALL_METAPHORS.length;

/**
 * Get metaphors filtered by category
 */
export function getMetaphorsByCategory(categoryId: string): Metaphor[] {
  if (categoryId === 'all') return ALL_METAPHORS;
  return ALL_METAPHORS.filter((m) => m.categories.includes(categoryId));
}

/**
 * Get metaphor by ID
 */
export function getMetaphorById(id: string): Metaphor | undefined {
  return ALL_METAPHORS.find((m) => m.id === id);
}

/**
 * Search metaphors by text
 */
export function searchMetaphors(query: string): Metaphor[] {
  const q = query.toLowerCase();
  return ALL_METAPHORS.filter(
    (m) =>
      m.title.toLowerCase().includes(q) ||
      m.titleEn.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q) ||
      m.insight?.toLowerCase().includes(q)
  );
}

/**
 * Format index as XX/YY
 */
export function formatIndex(index: number | undefined, total: number = TOTAL_COUNT): string {
  if (!index) return '';
  return `${String(index).padStart(2, '0')}/${total}`;
}
