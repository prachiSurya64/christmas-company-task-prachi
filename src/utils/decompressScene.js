import LZString from "lz-string";

export default function decompressScene(str) {
  try {
    const s = LZString.decompressFromEncodedURIComponent(str);
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
}
