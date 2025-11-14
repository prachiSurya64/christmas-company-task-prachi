// src/hooks/useSceneLoader.js
import { useEffect } from "react";
import decompressScene from "../utils/decompressScene";

/**
 * Hook: useSceneLoader
 * - Loads initial scene from URL param `?scene=` (compressed) OR localStorage fallback.
 * - Dispatches replaceScene(sc) when found.
 *
 * Params:
 *   dispatch: redux dispatch
 *   replaceScene: redux action creator
 *   storageKey: localStorage key to fallback to
 */
export default function useSceneLoader({ dispatch, replaceScene, storageKey }) {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sceneParam = params.get("scene");

    if (sceneParam) {
      const sc = decompressScene(sceneParam);
      if (sc && sc.elements) {
        // If URL has compressed scene, use it (preserve URL as-is).
        dispatch(replaceScene(sc));
        return;
      }
    }

    // Fallback: localStorage
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        dispatch(replaceScene(JSON.parse(saved)));
      } catch {
        // ignore invalid saved content
      }
    }
  }, [dispatch, replaceScene, storageKey]);
}
