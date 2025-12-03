import { useEffect } from "react";
import decompressScene from "../utils/decompressScene";
export default function useSceneLoader({ dispatch, replaceScene, storageKey }) {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sceneParam = params.get("scene");

    if (sceneParam) {
      const sc = decompressScene(sceneParam);
      if (sc && sc.elements) {
        dispatch(replaceScene(sc));
        return;
      }
    }

    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        dispatch(replaceScene(JSON.parse(saved)));
      } catch {
      }
    }
  }, [dispatch, replaceScene, storageKey]);
}
