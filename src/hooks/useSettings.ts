import { useState, useEffect } from 'react';

export type ComplexityLevel = 'minimal' | 'standard' | 'detailed';
export type AnimationLevel = 'none' | 'subtle' | 'active';
export type ModelId =
  | 'google/gemini-2.0-flash-001'
  | 'google/gemini-2.0-flash-exp'
  | 'google/gemini-1.5-flash'
  | 'google/gemini-1.5-pro'
  | 'google/gemini-2.0-pro-exp-02-05';

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
  model: 'google/gemini-2.0-flash-001',
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
  { id: 'google/gemini-2.0-flash-001', name: 'Gemini 2.0 Flash', description: 'Fast, latest (Recommended)', cost: '$0.001' },
  { id: 'google/gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash Exp', description: 'Experimental thinking', cost: '$0.001' },
  { id: 'google/gemini-2.0-pro-exp-02-05', name: 'Gemini 2.0 Pro', description: 'Best quality', cost: '$0.01' },
  { id: 'google/gemini-1.5-flash', name: 'Gemini 1.5 Flash', description: 'Stable, reliable', cost: '$0.0005' },
  { id: 'google/gemini-1.5-pro', name: 'Gemini 1.5 Pro', description: 'High quality', cost: '$0.005' },
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
