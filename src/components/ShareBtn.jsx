import React from "react";
import { useSelector, useDispatch } from "react-redux";
import LZString from "lz-string";
import { replaceScene } from "../store/drawingBoard";

function compress(obj) {
  try {
    return LZString.compressToEncodedURIComponent(JSON.stringify(obj));
  } catch (err) {
    console.error("Compression failed:", err);
    return null;
  }
}

export default function ShareBtn() {
  const scene = useSelector((s) => s.drawing.present);
  const dispatch = useDispatch();

  const buildShareURL = (compressed) => {
    const isLocal = window.location.origin.includes("localhost");

    const origin = isLocal
      ? "https://few-towns-pay.loca.lt"
      : window.location.origin;

    return `${origin}/?scene=${compressed}`;
  };


  const copyLink = async () => {
    const compressed = compress(scene);
    if (!compressed) {
      alert("Failed to compress scene");
      return;
    }

    const url = buildShareURL(compressed);

    try {
      await navigator.clipboard.writeText(url);
      alert("Share link copied ✔");
    } catch {
      window.prompt("Copy this link:", url);
    }
  };

  const clearUrlParam = () => {
    const urlObj = new URL(window.location.href);
    urlObj.searchParams.delete("scene");

    window.history.replaceState({}, "", urlObj.toString());
    dispatch(replaceScene(scene));
  };

  return (
    <div style={{ marginTop: 12, display: "flex", gap: "8px" }}>
      <button onClick={copyLink}>Copy Share Link</button>
    </div>
  );
}
