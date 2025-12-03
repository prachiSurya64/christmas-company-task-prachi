import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { clearScene, redo, undo, setTool } from "../store/drawingBoard";

import {
  FaUndo,
  FaRedo,
  FaTrash,
  FaDownload,
  FaUpload,
  FaShareAlt,
} from "react-icons/fa";

import ToolBtn from "./tools/ToolBtn";
import ColorPicker from "./tools/ColorPicker";
import BrushSizer from "./tools/BrushSizer";
import { TOOL_BUTTONS } from "../config/toolsConfig";

export default function Toolbar({
  color,
  setColor,
  size,
  setSize,
  onDownload,
  onUploadChange,
  onExport,
  onToolChange,
}) {
  const dispatch = useDispatch();
  const [activeTool, setActiveTool] = useState("brush");

  // 🔥 Handle tool switching + redux + parent callback
  const handleToolChange = (tool) => {
    setActiveTool(tool);
    dispatch(setTool(tool));
    onToolChange(tool);
  };

  const ACTION_BUTTONS = [
    {
      id: "undo",
      title: "Undo",
      icon: <FaUndo />,
      onClick: () => dispatch(undo()),
    },
    {
      id: "redo",
      title: "Redo",
      icon: <FaRedo />,
      onClick: () => dispatch(redo()),
    },
    {
      id: "clear",
      title: "Clear Canvas",
      icon: <FaTrash />,
      onClick: () => dispatch(clearScene()),
    },
  ];

  const FILE_ACTIONS = [
    {
      id: "export",
      title: "Export PNG",
      icon: <FaShareAlt />,
      onClick: onExport,
    },
    {
      id: "download",
      title: "Download PNG",
      icon: <FaDownload />,
      onClick: onDownload,
    },
  ];

  return (
    <div className="toolbar-container">
      <div className="tool-section">
        {TOOL_BUTTONS.map((tool) => {
          const Icon = tool.icon;

          return (
            <ToolBtn
              key={tool.id}
              title={tool.title}
              active={activeTool === tool.id}
              onClick={() => handleToolChange(tool.id)}
            >
              <Icon />
            </ToolBtn>
          );
        })}

        <ColorPicker color={color} setColor={setColor} />
        <BrushSizer size={size} setSize={setSize} />
      </div>

      <div className="tool-section">
        {ACTION_BUTTONS.map((btn) => (
          <button key={btn.id} title={btn.title} onClick={btn.onClick}>
            {btn.icon}
          </button>
        ))}
      </div>

      <div className="tool-section">
        {FILE_ACTIONS.map((btn) => (
          <button key={btn.id} title={btn.title} onClick={btn.onClick}>
            {btn.icon}
          </button>
        ))}

        <label className="upload-btn" title="Upload PNG">
          <FaUpload />
          <input type="file" accept="image/*" onChange={onUploadChange} />
        </label>
      </div>
    </div>
  );
}
