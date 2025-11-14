// Redraws entire scene from Redux store
export default function useRedraw(canvasRef, present) {
  return function fullRedraw() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    present.elements.forEach((el) => {
      if (el.type === "freedraw") {
        ctx.beginPath();
        ctx.lineWidth = el.size;
        ctx.strokeStyle = el.color;
        ctx.lineCap = "round";
        ctx.moveTo(el.points[0].x, el.points[0].y);
        el.points.forEach((p) => ctx.lineTo(p.x, p.y));
        ctx.stroke();
      }

      if (el.type === "line") {
        ctx.beginPath();
        ctx.lineWidth = el.size;
        ctx.strokeStyle = el.color;
        ctx.moveTo(el.start.x, el.start.y);
        ctx.lineTo(el.end.x, el.end.y);
        ctx.stroke();
      }

      if (el.type === "rectangle") {
        ctx.lineWidth = el.size;
        ctx.strokeStyle = el.color;
        ctx.strokeRect(
          el.start.x,
          el.start.y,
          el.end.x - el.start.x,
          el.end.y - el.start.y
        );
      }

      if (el.type === "circle") {
        ctx.lineWidth = el.size;
        ctx.strokeStyle = el.color;
        const r = Math.hypot(el.end.x - el.start.x, el.end.y - el.start.y);
        ctx.beginPath();
        ctx.arc(el.start.x, el.start.y, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      if (el.type === "text") {
        const lines = el.text.split("\n");
        ctx.fillStyle = el.color;
        ctx.font = `${el.size * 5}px Arial`;
        lines.forEach((line, i) =>
          ctx.fillText(line, el.x, el.y + i * (el.size * 8))
        );
      }
    });
  };
}
