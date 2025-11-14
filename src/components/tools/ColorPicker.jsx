
import { FaPalette } from "react-icons/fa";

export default function ColorPicker({ color, setColor }) {
  return (
    <div className="color-picker">
      <FaPalette />
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
      />
    </div>
  );
}
