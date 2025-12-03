import { addElement } from "../store/drawingBoard";

export default function useCanvasHandlers({
  tool,
  color,
  size,
  canvasRef,
  drawingRef,
  dispatch,
  handleText,
  fullRedraw,
}) {
  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const onPointerDown = (e) => {
    const pt = getPos(e);

    if (tool === "text") {
      handleText(pt);
      return;
    }

    if (tool === "brush") {
      drawingRef.current = {
        type: "freedraw",
        color,
        size,
        points: [pt],
      };
      return;
    }

    if (["line", "rectangle", "circle"].includes(tool)) {
      drawingRef.current = {
        type: tool,
        start: pt,
        end: pt,
        color,
        size,
      };
    }
  };

  const onPointerMove = (e) => {
    if (!drawingRef.current) return;

    const pt = getPos(e);
    const ctx = canvasRef.current.getContext("2d");

    if (drawingRef.current.type === "freedraw") {
      drawingRef.current.points.push(pt);

      const arr = drawingRef.current.points;
      ctx.beginPath();
      ctx.lineCap = "round";
      ctx.lineWidth = drawingRef.current.size;
      ctx.strokeStyle = drawingRef.current.color;
      ctx.moveTo(arr[arr.length - 2].x, arr[arr.length - 2].y);
      ctx.lineTo(arr[arr.length - 1].x, arr[arr.length - 1].y);
      ctx.stroke();
      return;
    }

    fullRedraw();

    const { start } = drawingRef.current;
    ctx.lineWidth = drawingRef.current.size;
    ctx.strokeStyle = drawingRef.current.color;

    if (tool === "line") {
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(pt.x, pt.y);
      ctx.stroke();
    }

    if (tool === "rectangle") {
      ctx.strokeRect(start.x, start.y, pt.x - start.x, pt.y - start.y);
    }

    if (tool === "circle") {
      const r = Math.hypot(pt.x - start.x, pt.y - start.y);
      ctx.beginPath();
      ctx.arc(start.x, start.y, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    drawingRef.current.end = pt;
  };

  const onPointerUp = () => {
    if (!drawingRef.current) return;

    dispatch(addElement({ id: "el_" + Date.now(), ...drawingRef.current }));
    drawingRef.current = null;
  };

  return { onPointerDown, onPointerMove, onPointerUp };
}
