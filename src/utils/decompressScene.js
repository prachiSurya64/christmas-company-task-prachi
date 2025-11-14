// src/utils/decompressScene.js
import LZString from "lz-string";

/**
 * Try to decompress a URL-encoded compressed scene string.
 * Returns parsed scene object or null on failure.
 */
export default function decompressScene(str) {
  try {
    const s = LZString.decompressFromEncodedURIComponent(str);
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
}
