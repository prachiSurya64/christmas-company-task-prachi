// import React from "react";
// import { useSelector, useDispatch } from "react-redux";
// import LZString from "lz-string";
// import { replaceScene } from "../store/drawingBoard";

// /**
//  * ShareButton:
//  * - compresses current scene with lz-string
//  * - constructs shareable URL: ?scene=<compressed>
//  * - copies to clipboard
//  *
//  * Note: for very large scenes, some apps may truncate the URL. In production we'd fallback to server-side short link.
//  */

// function compress(obj) {
//   try {
//     return LZString.compressToEncodedURIComponent(JSON.stringify(obj));
//   } catch {
//     return null;
//   }
// }

// export default function ShareBtn() {
//   const scene = useSelector((s) => s.drawing.present);
//   const dispatch = useDispatch();

//   const copyLink = async () => {
//     const compressed = compress(scene);
//     if (!compressed) return alert("Failed to compress scene");
// //     const url = `${window.location.origin}${window.location.pathname}?scene=${compressed}`;
// //     const url = `https://tame-baboons-search.loca.lt/?scene=${compressed}`;
// //     const url = `https://prachi-whiteboard.loca.lt/?scene=${compressed}`;
// const origin = window.location.origin.includes("localhost")
//   ? "https://few-towns-pay.loca.lt"
//   : window.location.origin;

// const url = `${origin}/?scene=${compressed}`;


//     try {
//       await navigator.clipboard.writeText(url);
//       alert("Share link copied to clipboard");
//     } catch {
//       window.prompt("Copy this link:", url);
//     }
//   };

//   const clearUrlParam = () => {
//     // remove scene param from URL without reloading (useful during demo)
//     const u = new URL(window.location.href);
//     u.searchParams.delete("scene");
//     window.history.replaceState({}, "", u.toString());
//     dispatch(replaceScene(scene)); 
//   };

//   return (
//     <div style={{ marginTop: 12 }}>
//       <button onClick={copyLink}>Copy Share Link</button>
//     </div>
//   );
// }




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

  /*
   * Main share link logic:
   * → compress scene
   * → generate URL
   * → copy to clipboard
   */
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
