import React from "react";

export default function ToolBtn({ active, title, onClick, children }) {
  return (
    <button
      className={`tool-btn ${active ? "active" : ""}`}
      onClick={onClick}
      title={title}
    >
      {children}
    </button>
  );
}
