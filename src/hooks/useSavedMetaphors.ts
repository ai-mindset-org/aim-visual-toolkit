import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'aim-visual-toolkit-saved-metaphors';

export interface GeneratedMetaphor {
  id: string;
  svg: string;
  title?: string;
  titleEn?: string;
  prompt: string;
  createdAt: number;
  model?: string;
  style?: 'light' | 'dark';
}

interface SavedData {
  catalogIds: string[];
  generated: GeneratedMetaphor[];
}

export function useSavedMetaphors() {
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [generatedMetaphors, setGeneratedMetaphors] = useState<GeneratedMetaphor[]>([]);

  // Load saved data from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Handle legacy format (array of strings)
        if (Array.isArray(parsed)) {
          setSavedIds(new Set(parsed));
          setGeneratedMetaphors([]);
        } else {
          // New format
          const data = parsed as SavedData;
          setSavedIds(new Set(data.catalogIds || []));
          setGeneratedMetaphors(data.generated || []);
        }
      }
    } catch (err) {
      console.error('Failed to load saved metaphors:', err);
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    try {
      const data: SavedData = {
        catalogIds: [...savedIds],
        generated: generatedMetaphors,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      console.error('Failed to save metaphors:', err);
    }
  }, [savedIds, generatedMetaphors]);

  // Catalog metaphor operations
  const addMetaphor = useCallback((id: string) => {
    setSavedIds((prev) => new Set([...prev, id]));
  }, []);

  const removeMetaphor = useCallback((id: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const isSaved = useCallback((id: string) => savedIds.has(id), [savedIds]);

  // Generated metaphor operations
  const addGeneratedMetaphor = useCallback((metaphor: Omit<GeneratedMetaphor, 'id' | 'createdAt'>) => {
    const newMetaphor: GeneratedMetaphor = {
      ...metaphor,
      id: `gen-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      createdAt: Date.now(),
    };
    setGeneratedMetaphors((prev) => [newMetaphor, ...prev]);
    return newMetaphor.id;
  }, []);

  const removeGeneratedMetaphor = useCallback((id: string) => {
    setGeneratedMetaphors((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const isGeneratedSaved = useCallback(
    (svg: string) => generatedMetaphors.some((m) => m.svg === svg),
    [generatedMetaphors]
  );

  const totalCount = savedIds.size + generatedMetaphors.length;

  return {
    // Catalog metaphors
    savedIds,
    count: savedIds.size,
    addMetaphor,
    removeMetaphor,
    isSaved,
    // Generated metaphors
    generatedMetaphors,
    generatedCount: generatedMetaphors.length,
    addGeneratedMetaphor,
    removeGeneratedMetaphor,
    isGeneratedSaved,
    // Combined
    totalCount,
  };
}
