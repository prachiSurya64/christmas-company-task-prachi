// src/hooks/useAutoSave.js
import { useEffect, useRef } from "react";

/**
 * Hook: useAutoSave
 * Debounces saving an object to localStorage.
 *
 * Params:
 *   value: data to save (e.g. redux present)
 *   storageKey: where to save
 *   delay: debounce delay in ms (700ms by original code)
 */
export default function useAutoSave(value, storageKey, delay = 700) {
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(value));
      } catch {
        // ignore storage errors
      }
    }, delay);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [value, storageKey, delay]);
}
