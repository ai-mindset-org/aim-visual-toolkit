import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'aim-visual-toolkit-saved-metaphors';

export function useSavedMetaphors() {
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  // Load saved IDs from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const ids = JSON.parse(stored) as string[];
        setSavedIds(new Set(ids));
      }
    } catch (err) {
      console.error('Failed to load saved metaphors:', err);
    }
  }, []);

  // Save to localStorage whenever savedIds changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...savedIds]));
    } catch (err) {
      console.error('Failed to save metaphors:', err);
    }
  }, [savedIds]);

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

  return {
    savedIds,
    count: savedIds.size,
    addMetaphor,
    removeMetaphor,
    isSaved,
  };
}
