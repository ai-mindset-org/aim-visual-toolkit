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
};

export const CATEGORIES: Category[] = [
  { id: 'all', label: 'All' },
  { id: 'ai', label: 'AI & Models' },
  { id: 'thinking', label: 'Thinking' },
  { id: 'system', label: 'Systems' },
  { id: 'communication', label: 'Communication' },
  { id: 'learning', label: 'Learning' },
  { id: 'fos', label: 'Founder OS' },
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
];

export const COMMUNITY_METAPHORS: Metaphor[] = [];

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
