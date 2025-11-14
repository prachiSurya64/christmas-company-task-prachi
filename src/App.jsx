// import React, { useState, useEffect, useRef } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import LZString from "lz-string";
// import Toolbar from "./components/Toolbar";
// import ShareBtn from "./components/ShareBtn";
// import {
//   addImageElement,
//   replaceScene,
//   setTool,
// } from "./store/drawingBoard";
// import CanvasSheet from "./components/CanvasSheet";

// const STORAGE_KEY = "painter_scene_v1";

// function decompressScene(str) {
//   try {
//     const s = LZString.decompressFromEncodedURIComponent(str);
//     return s ? JSON.parse(s) : null;
//   } catch {
//     return null;
//   }
// }

// export default function App() {
//   const dispatch = useDispatch();
//   const present = useSelector((s) => s.drawing.present);
//   const tool = useSelector((s) => s.drawing.tool);

//   const [color, setColor] = useState("#000000");
//   const [size, setSize] = useState(3);

//   const canvasContainerRef = useRef(null);
//   const canvasRef = useRef(null);
//   const ctxRef = useRef(null);
//   const [isDrawing, setIsDrawing] = useState(false);
//   const [startPos, setStartPos] = useState({ x: 0, y: 0 });

//   const width = window.innerWidth - 300;
//   const height = window.innerHeight - 100;

//   // 🔹 Load saved scene
//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const sceneParam = params.get("scene");
//     if (sceneParam) {
//       const sc = decompressScene(sceneParam);
//       if (sc && sc.elements) {
//         dispatch(replaceScene(sc));
//         return;
//       }
//     }
//     const saved = localStorage.getItem(STORAGE_KEY);
//     if (saved) {
//       try {
//         dispatch(replaceScene(JSON.parse(saved)));
//       } catch {}
//     }
//   }, [dispatch]);

//   // 🔹 Auto-save
//   useEffect(() => {
//     const id = setTimeout(() => {
//       try {
//         localStorage.setItem(STORAGE_KEY, JSON.stringify(present));
//       } catch {}
//     }, 700);
//     return () => clearTimeout(id);
//   }, [present]);

//   // 🔹 Initialize canvas context
//   // useEffect(() => {
//   //   const canvas = canvasRef.current;
//   //   const ctx = canvas.getContext("2d");
//   //   ctx.lineCap = "round";
//   //   ctx.lineJoin = "round";
//   //   ctxRef.current = ctx;
//   // }, []);

//   useEffect(() => {
//   const canvas = canvasRef.current;
//   if (!canvas) return;

//   const ctx = canvas.getContext("2d");
//   if (!ctx) return;

//   ctx.lineCap = "round";
//   ctx.lineJoin = "round";
//   ctxRef.current = ctx;
// }, []);


//   // 🔹 Drawing Logic
//   const startDrawing = (e) => {
//     const { offsetX, offsetY } = e.nativeEvent;
//     setIsDrawing(true);
//     setStartPos({ x: offsetX, y: offsetY });

//     if (tool === "brush") {
//       ctxRef.current.beginPath();
//       ctxRef.current.moveTo(offsetX, offsetY);
//     }
//   };

//   const draw = (e) => {
//     if (!isDrawing) return;
//     const { offsetX, offsetY } = e.nativeEvent;
//     const ctx = ctxRef.current;

//     ctx.strokeStyle = color;
//     ctx.lineWidth = size;

//     if (tool === "brush") {
//       ctx.lineTo(offsetX, offsetY);
//       ctx.stroke();
//     } else {
//       // clear before shape redraw
//       const canvas = canvasRef.current;
//       const img = new Image();
//       img.src = localStorage.getItem("drawing") || "";
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
//       if (img.src) ctx.drawImage(img, 0, 0);

//       if (tool === "line") {
//         ctx.beginPath();
//         ctx.moveTo(startPos.x, startPos.y);
//         ctx.lineTo(offsetX, offsetY);
//         ctx.stroke();
//       } else if (tool === "rectangle") {
//         const width = offsetX - startPos.x;
//         const height = offsetY - startPos.y;
//         ctx.strokeRect(startPos.x, startPos.y, width, height);
//       } else if (tool === "circle") {
//         const radius = Math.sqrt(
//           Math.pow(offsetX - startPos.x, 2) + Math.pow(offsetY - startPos.y, 2)
//         );
//         ctx.beginPath();
//         ctx.arc(startPos.x, startPos.y, radius, 0, Math.PI * 2);
//         ctx.stroke();
//       }
//     }
//   };

//   const stopDrawing = () => {
//     if (!isDrawing) return;
//     setIsDrawing(false);
//     ctxRef.current.closePath();
//     saveToHistory();
//   };

//   // 🔹 Save to localStorage for persistence
//   const saveToHistory = () => {
//     const canvas = canvasRef.current;
//     localStorage.setItem("drawing", canvas.toDataURL());
//   };

//   // 🔹 Handle upload (images)
//   const onUploadChange = (e) => {
//     const f = e.target.files && e.target.files[0];
//     if (!f) return;
//     const reader = new FileReader();
//     reader.onload = () => {
//       const src = reader.result;
//       const img = new Image();
//       img.onload = () => {
//         const el = {
//           id: "img_" + Date.now(),
//           type: "image",
//           src,
//           x: 0,
//           y: 0,
//           width: img.width,
//           height: img.height,
//         };
//         dispatch(addImageElement(el));
//       };
//       img.src = src;
//     };
//     reader.readAsDataURL(f);
//   };

//   const onDownload = () => {
//     const link = document.createElement("a");
//     link.download = "drawing.png";
//     link.href = canvasRef.current.toDataURL();
//     link.click();
//   };

//   return (
//     <div className="app">
//       <header className="toolbar">
//         <Toolbar
//           color={color}
//           setColor={setColor}
//           size={size}
//           setSize={setSize}
//           onDownload={onDownload}
//           onUploadChange={onUploadChange}
//           onExport={onDownload}
//           onToolChange={(t) => dispatch(setTool(t))}
//         />
//         <ShareBtn />
//       </header>

//       {/* <main
//         ref={canvasContainerRef}
//         className={`canvas-container ${tool === "brush" ? "brush-cursor" : ""}`}
//         style={{
//           flex: 1,
//           border: "1px solid #ddd",
//           borderRadius: 6,
//           overflow: "hidden",
//           position: "relative",
//         }}
//       >
//         <canvas
//           ref={canvasRef}
//           width={width}
//           height={height}
//           onMouseDown={startDrawing}
//           onMouseMove={draw}
//           onMouseUp={stopDrawing}
//           onMouseLeave={stopDrawing}
//           style={{ background: "#fff", display: "block" }}
//         />
//       </main> */}

//       <main
//   className={`canvas-container ${tool === "brush" ? "brush-cursor" : ""}`}
//   style={{
//     flex: 1,
//     border: "1px solid #ddd",
//     borderRadius: 6,
//     overflow: "scroll",
//     position: "relative",
//   }}
// >
//   <CanvasSheet color={color} size={size} tool={tool} />

//   <div
//     id="text-layer"
//     style={{
//       position: "absolute",
//       inset: 0,
//       pointerEvents: "none", 
//       zIndex: 10
//     }}
//   />
// </main>

//     </div>
//   );
// }


import React from "react";

import Home from "./components/home/Home";


export default function App() {
  

  return (
    <div className="app">
     <Home />

    </div>
  );
}
