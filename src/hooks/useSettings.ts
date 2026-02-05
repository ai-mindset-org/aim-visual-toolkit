import { useState, useEffect } from 'react';

export type ComplexityLevel = 'minimal' | 'standard' | 'detailed';
export type AnimationLevel = 'none' | 'subtle' | 'active';
export type ModelId =
  // Gemini 3 (newest)
  | 'google/gemini-3-flash'
  | 'google/gemini-3-pro'
  // Gemini 2.5
  | 'google/gemini-2.5-flash-preview'
  | 'google/gemini-2.5-pro-preview'
  // Claude
  | 'anthropic/claude-3.5-sonnet'
  | 'anthropic/claude-3-5-haiku'
  // OpenAI
  | 'openai/gpt-4o'
  | 'openai/gpt-4o-mini';

export interface Settings {
  openRouterKey: string;
  model: ModelId;
  style: 'light' | 'dark';
  complexity: ComplexityLevel;
  animation: AnimationLevel;
}

const STORAGE_KEY = 'aim-visual-toolkit-settings';

const DEFAULT_SETTINGS: Settings = {
  openRouterKey: '',
  model: 'google/gemini-3-flash',
  style: 'light',
  complexity: 'standard',
  animation: 'subtle',
};

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(() => {
    if (typeof window === 'undefined') return DEFAULT_SETTINGS;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      } catch {
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (updates: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  const hasCustomKey = settings.openRouterKey.length > 0;

  return {
    settings,
    updateSettings,
    hasCustomKey,
  };
}

export const MODELS = [
  // Gemini 3 (newest generation)
  { id: 'google/gemini-3-flash', name: 'Gemini 3 Flash', description: 'Latest & fastest (Recommended)', cost: '$0.001' },
  { id: 'google/gemini-3-pro', name: 'Gemini 3 Pro', description: 'Best quality', cost: '$0.01' },
  // Gemini 2.5
  { id: 'google/gemini-2.5-flash-preview', name: 'Gemini 2.5 Flash', description: 'Fast, stable', cost: '$0.001' },
  { id: 'google/gemini-2.5-pro-preview', name: 'Gemini 2.5 Pro', description: 'High quality', cost: '$0.01' },
  // Anthropic Claude
  { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', description: 'Best for design', cost: '$0.015' },
  { id: 'anthropic/claude-3-5-haiku', name: 'Claude 3.5 Haiku', description: 'Fast Claude', cost: '$0.001' },
  // OpenAI GPT
  { id: 'openai/gpt-4o', name: 'GPT-4o', description: 'OpenAI flagship', cost: '$0.015' },
  { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini', description: 'Fast & cheap', cost: '$0.0005' },
] as const;

export const COMPLEXITY_OPTIONS = [
  { id: 'minimal', name: 'Minimal', description: 'Simple shapes, clean' },
  { id: 'standard', name: 'Standard', description: 'Balanced detail' },
  { id: 'detailed', name: 'Detailed', description: 'Rich, complex' },
] as const;

export const ANIMATION_OPTIONS = [
  { id: 'none', name: 'None', description: 'Static' },
  { id: 'subtle', name: 'Subtle', description: 'Slow, gentle' },
  { id: 'active', name: 'Active', description: 'Dynamic' },
] as const;
