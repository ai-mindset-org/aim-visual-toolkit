/**
 * Metaphor Data Types and Catalog
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
  index?: number;
  prompt?: string;
  author?: string;
}

export type Category = {
  id: string;
  label: string;
};

// Categories by topic (not by week)
export const CATEGORIES: Category[] = [
  { id: 'all', label: 'All' },
  { id: 'ai', label: 'AI & Models' },
  { id: 'thinking', label: 'Thinking' },
  { id: 'system', label: 'Systems' },
  { id: 'communication', label: 'Communication' },
  { id: 'learning', label: 'Learning' },
  { id: 'fos', label: 'Founder OS' },
  { id: 'community', label: 'Community' },
];

export const METAPHORS: Metaphor[] = [
  // AI & Models
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
    index: 1,
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
    index: 2,
  },
  {
    id: 'context-ai',
    title: 'Context + AI',
    titleEn: 'CONTEXT + AI',
    description: 'Symbiosis of personal context and AI',
    insight: 'Context matters more than prompts.',
    categories: ['ai', 'communication'],
    source: 'core',
    format: 'svg-file',
    filename: 'context-ai.svg',
    index: 3,
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
    index: 4,
  },
  {
    id: 'symbiosis-loop',
    title: 'Symbiosis Loop',
    titleEn: 'SYMBIOSIS LOOP',
    description: 'Mutual enhancement of human and AI',
    insight: 'Productivity is not speed, but awareness.',
    categories: ['ai', 'system'],
    source: 'core',
    format: 'svg-file',
    filename: 'symbiosis-loop.svg',
    index: 5,
  },

  // Thinking
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
    index: 6,
  },
  {
    id: 'prompt-structure',
    title: 'Prompt Structure',
    titleEn: 'PROMPT STRUCTURE',
    description: 'Anatomy of effective request',
    insight: 'Not clever prompts, but quality of context.',
    categories: ['thinking', 'communication'],
    source: 'core',
    format: 'svg-file',
    filename: 'prompt-structure.svg',
    index: 7,
  },
  {
    id: 'second-brain',
    title: 'Second Brain',
    titleEn: 'SECOND BRAIN',
    description: 'Personal knowledge base for context',
    insight: 'Context should live with you, not in service memory.',
    categories: ['thinking', 'system'],
    source: 'core',
    format: 'svg-file',
    filename: 'second-brain.svg',
    index: 8,
  },
  {
    id: 'alchemy',
    title: 'Context Alchemy',
    titleEn: 'CONTEXT ALCHEMY',
    description: 'Transforming raw data into insights',
    insight: 'Mixing sources creates new artifacts.',
    categories: ['thinking'],
    source: 'core',
    format: 'svg-file',
    filename: 'alchemy.svg',
    index: 9,
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
    index: 10,
  },

  // Systems
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
    index: 11,
  },
  {
    id: 'leverage',
    title: 'Leverage',
    titleEn: 'LEVERAGE',
    description: 'AI as lever for multiplying impact',
    insight: 'One context file transforms every conversation.',
    categories: ['system'],
    source: 'core',
    format: 'svg-file',
    filename: 'leverage.svg',
    index: 12,
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
    index: 13,
  },

  // Communication
  {
    id: 'voice-wave',
    title: 'Voice Wave',
    titleEn: 'VOICE WAVE',
    description: 'Voice as natural interface for AI',
    insight: 'Voice input accelerates work dramatically.',
    categories: ['communication'],
    source: 'core',
    format: 'svg-file',
    filename: 'voice-wave.svg',
    index: 14,
  },
  {
    id: 'interface-portal',
    title: 'Interface Portal',
    titleEn: 'INTERFACE PORTAL',
    description: 'AI OS as single entry point',
    insight: 'Not scattered chats, but unified system.',
    categories: ['communication', 'system'],
    source: 'core',
    format: 'svg-file',
    filename: 'interface-portal.svg',
    index: 15,
  },
  {
    id: 'intent-economy',
    title: 'Intent Economy',
    titleEn: 'INTENT ECONOMY',
    description: 'From attention economy to intent economy',
    insight: 'AI allows monetizing intentions.',
    categories: ['communication'],
    source: 'core',
    format: 'svg-file',
    filename: 'intent-economy.svg',
    index: 16,
  },

  // Learning (Books)
  {
    id: 'book-basics',
    title: 'Book: Basics',
    titleEn: 'BOOK BASICS',
    description: 'Fundamental knowledge about AI',
    categories: ['learning'],
    source: 'core',
    format: 'svg-file',
    filename: 'book-basics.svg',
    index: 17,
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
    index: 18,
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
    index: 19,
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
    index: 20,
  },

  // Founder OS
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
    index: 21,
  },
  {
    id: 'fos18-two-systems',
    title: 'Two Systems',
    titleEn: 'TWO SYSTEMS',
    description: 'Obsidian CMS + AI Mindset LMS',
    insight: 'AI accelerates, you design architecture.',
    categories: ['fos'],
    source: 'core',
    format: 'svg-file',
    filename: 'fos18/fos18-two-systems.svg',
    index: 22,
  },
  {
    id: 'obsidian-flow',
    title: 'Content Flow',
    titleEn: 'CONTENT FLOW',
    description: 'Markdown → AI → multi-channel publishing',
    insight: 'Single source of truth, multiple outputs.',
    categories: ['fos'],
    source: 'core',
    format: 'svg-file',
    filename: 'fos18/obsidian-flow.svg',
    index: 23,
  },
  {
    id: 'ai-sprint',
    title: 'AI Sprint',
    titleEn: 'AI SPRINT',
    description: 'Parallel task execution by AI agents',
    insight: '3 agents = 3x faster.',
    categories: ['fos'],
    source: 'core',
    format: 'svg-file',
    filename: 'fos18/ai-sprint.svg',
    index: 24,
  },
];

// Community metaphors
export const COMMUNITY_METAPHORS: Metaphor[] = [
  {
    id: 'cm-digital-smile',
    title: 'Digital Smile',
    titleEn: 'DIGITAL SMILE',
    description: 'Wide smile on screen - connection through interface',
    insight: 'Human warmth through digital channels',
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

export function getMetaphorsByCategory(categoryId: string): Metaphor[] {
  if (categoryId === 'all') return ALL_METAPHORS;
  return ALL_METAPHORS.filter((m) => m.categories.includes(categoryId));
}

export function getMetaphorById(id: string): Metaphor | undefined {
  return ALL_METAPHORS.find((m) => m.id === id);
}

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

export function formatIndex(index: number | undefined, total: number = TOTAL_COUNT): string {
  if (!index) return '';
  return `${String(index).padStart(2, '0')}/${total}`;
}
