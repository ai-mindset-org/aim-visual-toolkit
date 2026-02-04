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
  source: 'lms' | 'generated';
  format: 'svg-file';
  filename: string;
}

export type Category = {
  id: string;
  label: string;
  labelEn: string;
};

export const CATEGORIES: Category[] = [
  { id: 'all', label: 'Все', labelEn: 'All' },
  { id: 'ai', label: 'AI & Модели', labelEn: 'AI & Models' },
  { id: 'thinking', label: 'Мышление', labelEn: 'Thinking' },
  { id: 'system', label: 'Системы', labelEn: 'Systems' },
  { id: 'communication', label: 'Коммуникация', labelEn: 'Communication' },
  { id: 'learning', label: 'Обучение', labelEn: 'Learning' },
  { id: 'fos18', label: 'FOS18', labelEn: 'FOS18' },
];

export const METAPHORS: Metaphor[] = [
  // Core AI metaphors
  {
    id: 'exoskeleton',
    title: 'Экзоскелет',
    titleEn: 'Exoskeleton',
    description: 'AI как внешний усилитель ваших возможностей',
    insight: 'AI не заменяет вас, а усиливает ваши способности',
    categories: ['ai', 'system'],
    source: 'lms',
    format: 'svg-file',
    filename: 'exoskeleton.svg',
  },
  {
    id: 'digital-twin',
    title: 'Цифровой двойник',
    titleEn: 'Digital Twin',
    description: 'Ваша цифровая копия, обучаемая вашим стилем',
    insight: 'Создайте AI-версию себя для делегирования задач',
    categories: ['ai', 'system'],
    source: 'lms',
    format: 'svg-file',
    filename: 'digital-twin.svg',
  },
  {
    id: 'context-ai',
    title: 'Контекст AI',
    titleEn: 'AI Context',
    description: 'Понимание через контекст, а не через данные',
    insight: 'Качество контекста определяет качество ответа AI',
    categories: ['ai', 'communication'],
    source: 'lms',
    format: 'svg-file',
    filename: 'context-ai.svg',
  },
  {
    id: 'model-landscape',
    title: 'Ландшафт моделей',
    titleEn: 'Model Landscape',
    description: 'Карта AI моделей и их возможностей',
    insight: 'Разные модели для разных задач',
    categories: ['ai'],
    source: 'lms',
    format: 'svg-file',
    filename: 'model-landscape.svg',
  },

  // Thinking & Structure
  {
    id: 'chain-of-thought',
    title: 'Цепочка мыслей',
    titleEn: 'Chain of Thought',
    description: 'Пошаговое логическое рассуждение',
    insight: 'Разбивайте сложные задачи на простые шаги',
    categories: ['thinking', 'ai'],
    source: 'lms',
    format: 'svg-file',
    filename: 'chain-of-thought.svg',
  },
  {
    id: 'prompt-structure',
    title: 'Структура промпта',
    titleEn: 'Prompt Structure',
    description: 'Анатомия эффективного промпта',
    insight: 'Структурированный промпт = предсказуемый результат',
    categories: ['ai', 'communication'],
    source: 'lms',
    format: 'svg-file',
    filename: 'prompt-structure.svg',
  },
  {
    id: 'second-brain',
    title: 'Второй мозг',
    titleEn: 'Second Brain',
    description: 'Внешняя система хранения и обработки знаний',
    insight: 'Освободите мозг от запоминания, сосредоточьтесь на мышлении',
    categories: ['thinking', 'system'],
    source: 'lms',
    format: 'svg-file',
    filename: 'second-brain.svg',
  },
  {
    id: 'architecture-layers',
    title: 'Слои архитектуры',
    titleEn: 'Architecture Layers',
    description: 'Уровни абстракции в системах',
    insight: 'Каждый слой решает свою задачу',
    categories: ['system', 'thinking'],
    source: 'lms',
    format: 'svg-file',
    filename: 'architecture-layers.svg',
  },

  // Communication & Interface
  {
    id: 'interface-portal',
    title: 'Портал интерфейса',
    titleEn: 'Interface Portal',
    description: 'Точка входа в цифровой мир',
    insight: 'Интерфейс — это язык общения с системой',
    categories: ['communication', 'system'],
    source: 'lms',
    format: 'svg-file',
    filename: 'interface-portal.svg',
  },
  {
    id: 'voice-wave',
    title: 'Голосовая волна',
    titleEn: 'Voice Wave',
    description: 'Голос как интерфейс взаимодействия',
    insight: 'Голосовое управление — естественный способ коммуникации',
    categories: ['communication', 'ai'],
    source: 'lms',
    format: 'svg-file',
    filename: 'voice-wave.svg',
  },
  {
    id: 'symbiosis-loop',
    title: 'Цикл симбиоза',
    titleEn: 'Symbiosis Loop',
    description: 'Взаимовыгодное взаимодействие человека и AI',
    insight: 'Человек и AI усиливают друг друга',
    categories: ['ai', 'system'],
    source: 'lms',
    format: 'svg-file',
    filename: 'symbiosis-loop.svg',
  },

  // Learning & Growth
  {
    id: 'alchemy',
    title: 'Алхимия',
    titleEn: 'Alchemy',
    description: 'Трансформация информации в знания',
    insight: 'Превращайте сырые данные в ценные инсайты',
    categories: ['learning', 'thinking'],
    source: 'lms',
    format: 'svg-file',
    filename: 'alchemy.svg',
  },
  {
    id: 'alignment',
    title: 'Выравнивание',
    titleEn: 'Alignment',
    description: 'Синхронизация целей и действий',
    insight: 'Alignment AI = alignment ваших намерений',
    categories: ['ai', 'thinking'],
    source: 'lms',
    format: 'svg-file',
    filename: 'alignment.svg',
  },
  {
    id: 'leverage',
    title: 'Рычаг',
    titleEn: 'Leverage',
    description: 'Умножение результата через правильный инструмент',
    insight: 'Найдите точку опоры для максимального эффекта',
    categories: ['thinking', 'system'],
    source: 'lms',
    format: 'svg-file',
    filename: 'leverage.svg',
  },
  {
    id: 'intent-economy',
    title: 'Экономика намерений',
    titleEn: 'Intent Economy',
    description: 'Ценность ясно выраженного намерения',
    insight: 'Чёткое намерение = точный результат',
    categories: ['communication', 'ai'],
    source: 'lms',
    format: 'svg-file',
    filename: 'intent-economy.svg',
  },
  {
    id: 'four-weeks',
    title: 'Четыре недели',
    titleEn: 'Four Weeks',
    description: 'Структура курса AIM',
    insight: 'Системный подход к обучению AI навыкам',
    categories: ['learning'],
    source: 'lms',
    format: 'svg-file',
    filename: 'four-weeks.svg',
  },

  // Books
  {
    id: 'book-basics',
    title: 'Книга: Основы',
    titleEn: 'Book: Basics',
    description: 'Фундаментальные знания об AI',
    categories: ['learning'],
    source: 'lms',
    format: 'svg-file',
    filename: 'book-basics.svg',
  },
  {
    id: 'book-practice',
    title: 'Книга: Практика',
    titleEn: 'Book: Practice',
    description: 'Практические навыки работы с AI',
    categories: ['learning'],
    source: 'lms',
    format: 'svg-file',
    filename: 'book-practice.svg',
  },
  {
    id: 'book-design',
    title: 'Книга: Дизайн',
    titleEn: 'Book: Design',
    description: 'Дизайн взаимодействия с AI',
    categories: ['learning'],
    source: 'lms',
    format: 'svg-file',
    filename: 'book-design.svg',
  },
  {
    id: 'book-advanced',
    title: 'Книга: Продвинутый',
    titleEn: 'Book: Advanced',
    description: 'Продвинутые техники работы с AI',
    categories: ['learning'],
    source: 'lms',
    format: 'svg-file',
    filename: 'book-advanced.svg',
  },

  // FOS18 Workshop
  {
    id: 'fos18-two-systems',
    title: 'Две системы',
    titleEn: 'Two Systems',
    description: 'Система 1 и Система 2 мышления с AI',
    insight: 'Автоматическое vs аналитическое мышление',
    categories: ['fos18', 'thinking'],
    source: 'lms',
    format: 'svg-file',
    filename: 'fos18/fos18-two-systems.svg',
  },
  {
    id: 'ai-sprint',
    title: 'AI Спринт',
    titleEn: 'AI Sprint',
    description: 'Быстрый цикл работы с AI',
    insight: 'Итеративный подход к AI-проектам',
    categories: ['fos18', 'system'],
    source: 'lms',
    format: 'svg-file',
    filename: 'fos18/ai-sprint.svg',
  },
  {
    id: 'founder-os-system',
    title: 'Founder OS',
    titleEn: 'Founder OS',
    description: 'Операционная система основателя',
    insight: 'Системный подход к управлению бизнесом',
    categories: ['fos18', 'system'],
    source: 'lms',
    format: 'svg-file',
    filename: 'fos18/founder-os-system.svg',
  },
  {
    id: 'obsidian-flow',
    title: 'Obsidian Flow',
    titleEn: 'Obsidian Flow',
    description: 'Поток работы в Obsidian',
    insight: 'PKM как основа продуктивности',
    categories: ['fos18', 'thinking'],
    source: 'lms',
    format: 'svg-file',
    filename: 'fos18/obsidian-flow.svg',
  },
];

/**
 * Get metaphors filtered by category
 */
export function getMetaphorsByCategory(categoryId: string): Metaphor[] {
  if (categoryId === 'all') return METAPHORS;
  return METAPHORS.filter((m) => m.categories.includes(categoryId));
}

/**
 * Get metaphor by ID
 */
export function getMetaphorById(id: string): Metaphor | undefined {
  return METAPHORS.find((m) => m.id === id);
}

/**
 * Search metaphors by text
 */
export function searchMetaphors(query: string): Metaphor[] {
  const q = query.toLowerCase();
  return METAPHORS.filter(
    (m) =>
      m.title.toLowerCase().includes(q) ||
      m.titleEn.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q) ||
      m.insight?.toLowerCase().includes(q)
  );
}
