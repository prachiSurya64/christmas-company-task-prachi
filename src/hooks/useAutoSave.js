import { useEffect, useRef } from "react";


export default function useAutoSave(value, storageKey, delay = 700) {
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(value));
      } catch {
        
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
