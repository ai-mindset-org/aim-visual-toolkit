import { useState, useEffect } from 'react';

export interface Settings {
  openRouterKey: string;
  model: 'google/gemini-3-flash-preview' | 'google/gemini-2.5-flash' | 'anthropic/claude-3.5-sonnet';
  style: 'light' | 'dark';
}

const STORAGE_KEY = 'aim-visual-toolkit-settings';

const DEFAULT_SETTINGS: Settings = {
  openRouterKey: '',
  model: 'google/gemini-3-flash-preview',
  style: 'light',
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
  { id: 'google/gemini-3-flash-preview', name: 'Gemini 3 Flash', description: 'Fast, latest' },
  { id: 'google/gemini-2.5-flash', name: 'Gemini 2.5 Flash', description: 'Stable' },
  { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', description: 'Best quality' },
] as const;
