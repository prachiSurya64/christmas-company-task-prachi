# Drawing Board  
A lightweight, feature-rich drawing board built with "React", "Redux Toolkit", and HTML Canvas,
supporting undo/redo, shapes, text, image upload, autosave, and PNG export.

---

=> Features

:-- Drawing & Shapes  
- Freehand brush  
- Line  
- Rectangle  
- Circle  
- Text tool with on-canvas editable overlay

:-- Image Support  
- Upload image (JPEG/PNG)  
- Add to canvas with draggable positioning

:-- Scene Management  
- Undo / Redo  
- Clear Canvas  
- Autosave to localStorage  
- Load scene from URL (`?scene=` compressed with LZ-String)

:-- Export  
- Export PNG  
- Download PNG  
- Share scene via compressed URL

---

:-- Tech Stack

- ReactJS
- Redux Toolkit
- LZ-String for compression
- React Icons
- HTML Canvas API
- Custom hooks, for autosave and scene loading etc.

---

=> Installation

Clone the repository: git clone https://github.com/<your-username>/<your-repo>.git

Install dependencies: npm install
Run cmd: npm run dev -> http://localhost:5173/ (like)

=> Folder Structure

src/
│── components/ ── home
|   |     |         ├──Home.jsx
|   |     ├── ── ──tools
|   |                ├──BrushSizer.jsx
|   |                ├──ColorPicker.jsx
|   |                ├──ToolBtn.jsx
│   |── Toolbar.jsx
│   ├── CanvasSheet.jsx
│   └── ShareBtn.jsx
|
│── config/
│   └── toolsConfig.js
│
│── store/
│   └── drawingBoard.js
│
│── hooks/
│   ├── useRedraw.js
│   ├── useCanvasHandler.js
│   ├── useTextTool.js
│   ├── useSceneLoader.js
│   └── useAutoSave.js
│
│── utils/
│   └── decompressScene.js
│
└── App.jsx

