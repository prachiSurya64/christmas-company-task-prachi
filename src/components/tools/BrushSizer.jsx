
import React from "react";

export default function BrushSizer({ size, setSize }) {
  return (
    <div className="brush-size">
      <input
        type="range"
        min="1"
        max="40"
        value={size}
        onChange={(e) => setSize(Number(e.target.value))}
      />
      <span>{size}px</span>
    </div>
  );
}
