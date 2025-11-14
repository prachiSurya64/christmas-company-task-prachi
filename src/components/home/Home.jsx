
import React, { useRef, useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Toolbar from "../Toolbar";
import ShareBtn from "../ShareBtn";
import CanvasSheet from "../CanvasSheet";
import { addImageElement, replaceScene, setTool } from "../../store/drawingBoard";
import useSceneLoader from "../../hooks/useSceneLoader";
import useAutoSave from "../../hooks/useAutoSave";

const STORAGE_KEY = "painter_scene_v1";

/**
 * App (optimized)
 * - Loads scene from URL/localStorage (via useSceneLoader)
 * - Autosaves `present` to localStorage (via useAutoSave)
 * - Provides upload / download handlers (keeps previous behavior)
 * - Keeps UI structure identical to previous code
 */
export default function Home() {
  const dispatch = useDispatch();

  // redux slices
  const present = useSelector((s) => s.drawing.present);
  const tool = useSelector((s) => s.drawing.tool);

  // local UI state
  const [color, setColor] = useState("#000000");
  const [size, setSize] = useState(3);

  // refs (kept for compatibility; CanvasSheet writes 'drawing' to localStorage)
  const canvasContainerRef = useRef(null);

  // -------------- Scene load ----------------
  // loads initial scene from ?scene= or localStorage
  useSceneLoader({ dispatch, replaceScene, storageKey: STORAGE_KEY });

  // -------------- Auto-save ----------------
  // debounce present -> localStorage (exactly like original: 700ms)
  useAutoSave(present, STORAGE_KEY, 700);

  // -------------- Upload handler (images) ----------------
  // unchanged logic; dispatch addImageElement when read
  const onUploadChange = useCallback(
    (e) => {
      const f = e.target.files && e.target.files[0];
      if (!f) return;
      const reader = new FileReader();
      reader.onload = () => {
        const src = reader.result;
        const img = new Image();
        img.onload = () => {
          const el = {
            id: "img_" + Date.now(),
            type: "image",
            src,
            x: 0,
            y: 0,
            width: img.width,
            height: img.height,
          };
          dispatch(addImageElement(el));
        };
        img.src = src;
      };
      reader.readAsDataURL(f);
    },
    [dispatch]
  );

  // -------------- Download handler ----------------
  // Your original App used canvasRef.current.toDataURL().
  // Current CanvasSheet saves a dataURL into localStorage key "drawing" (via saveToHistory).
  // To avoid changing CanvasSheet, we reuse that stored value here as the download source.
  const onDownload = useCallback(() => {
    const dataUrl = localStorage.getItem("drawing");
    if (dataUrl) {
      const link = document.createElement("a");
      link.download = "drawing.png";
      link.href = dataUrl;
      link.click();
      return;
    }

    // Fallback: attempt to export from DOM canvas if present inside container
    try {
      const container = canvasContainerRef.current;
      if (!container) return;
      const canvas = container.querySelector("canvas");
      if (!canvas) return;
      const link = document.createElement("a");
      link.download = "drawing.png";
      link.href = canvas.toDataURL();
      link.click();
    } catch {
      // ignore
    }
  }, [canvasContainerRef]);

  // tool change helper to dispatch redux + keep any parent state in sync
  const handleToolChange = useCallback(
    (t) => {
      dispatch(setTool(t));
    },
    [dispatch]
  );

  return (
    <div >
    {/* <div className="app"> */}
      <header className="toolbar">
        <Toolbar
          color={color}
          setColor={setColor}
          size={size}
          setSize={setSize}
          onDownload={onDownload}
          onUploadChange={onUploadChange}
          onExport={onDownload}
          onToolChange={(t) => handleToolChange(t)}
        />
        <ShareBtn />
      </header>

      <main
        ref={canvasContainerRef}
        className={`canvas-container ${tool === "brush" ? "brush-cursor" : ""}`}
        style={{
          flex: 1,
          border: "1px solid #ddd",
          borderRadius: 6,
          overflow: "scroll",
          position: "relative",
        }}
      >
        {/* CanvasSheet contains the actual drawing canvas and Redux-driven scene rendering */}
        <CanvasSheet color={color} size={size} tool={tool} />

        {/* Text layer overlay used by CanvasSheet for direct typing */}
        <div
          id="text-layer"
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 10,
          }}
        />
      </main>
    </div>
  );
}
