import { addElement } from "../store/drawingBoard";


export default function useTextTool(containerRef, dispatch, color, size) {
  return function handleText(pt) {
    const textarea = document.createElement("textarea");

    textarea.style.position = "absolute";
    textarea.style.left = `${pt.x}px`;
    textarea.style.top = `${pt.y}px`;
    textarea.style.font = "18px sans-serif";
    textarea.style.border = "1px dashed #555";
    textarea.style.background = "white";
    textarea.style.color = color;
    textarea.style.padding = "4px";
    textarea.style.outline = "none";
    textarea.style.resize = "auto";
    textarea.style.zIndex = 9999;
    textarea.rows = 1;

    containerRef.current.appendChild(textarea);
    textarea.focus();

    textarea.addEventListener("input", () => {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    });

    textarea.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        textarea.remove();
        return;
      }

      if (e.key === "Enter" && e.shiftKey) return;

      if (e.key === "Enter") {
        e.preventDefault();
        const text = textarea.value.trim();

        if (text !== "") {
          dispatch(
            addElement({
              id: "el_" + Date.now(),
              type: "text",
              x: pt.x,
              y: pt.y,
              text,
              color,
              size,
            })
          );
        }

        textarea.remove();
      }
    });
  };
}
