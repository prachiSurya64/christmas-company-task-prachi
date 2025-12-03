import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import useRedraw from "../hooks/useRedraw";
import useTextTool from "../hooks/useTextTool";
import useCanvasHandlers from "../hooks/useCanvasHandlers";


export default function CanvasSheet({ color, size }) {
  const dispatch = useDispatch();

  const present = useSelector((s) => s.drawing.present);
  const tool = useSelector((s) => s.drawing.tool);     

  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const drawingRef = useRef(null);

  const fullRedraw = useRedraw(canvasRef, present);

  
  const handleText = useTextTool(containerRef, dispatch, color, size);

  
  const { onPointerDown, onPointerMove, onPointerUp } = useCanvasHandlers({
    tool,
    color,
    size,
    canvasRef,
    drawingRef,
    dispatch,
    handleText,
    fullRedraw,
  });

  
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 6000;
    canvas.height = 6000;
    fullRedraw();
  }, [present]);

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", width: "6000px", height: "6000px" }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "6000px",
          height: "6000px",
          background: "#fff",
          touchAction: "none",
          display: "block",
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      />
    </div>
  );
}
