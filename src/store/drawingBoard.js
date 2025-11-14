import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  present: { elements: [], meta: {} },
  past: [],
  future: [],
  tool: "brush",
};

const slice = createSlice({
  name: "drawing",
  initialState,
  reducers: {
    setScene(state, action) {
      state.past.push(JSON.parse(JSON.stringify(state.present)));
      if (state.past.length > 100) state.past.shift();
      state.present = action.payload;
      state.future = [];
    },
    replaceScene(state, action) {
      state.present = action.payload;
      state.past = [];
      state.future = [];
    },
    addElement(state, action) {
      state.past.push(JSON.parse(JSON.stringify(state.present)));
      if (state.past.length > 100) state.past.shift();
      state.present.elements.push(action.payload);
      state.future = [];
    },
    updateLastElementPoints(state, action) {
      const { id, points } = action.payload;
      const el = state.present.elements.find((e) => e.id === id);
      if (el && el.type === "freedraw") {
        el.points = points;
      }
    },
    undo(state) {
      if (state.past.length === 0) return;
      const prev = state.past.pop();
      state.future.push(JSON.parse(JSON.stringify(state.present)));
      state.present = prev;
    },
    redo(state) {
      if (state.future.length === 0) return;
      const next = state.future.pop();
      state.past.push(JSON.parse(JSON.stringify(state.present)));
      state.present = next;
    },
    clearScene(state) {
      state.past.push(JSON.parse(JSON.stringify(state.present)));
      state.present = { elements: [], meta: {} };
      state.future = [];
    },
    addImageElement(state, action) {
      state.past.push(JSON.parse(JSON.stringify(state.present)));
      if (state.past.length > 100) state.past.shift();
      state.present.elements.push(action.payload);
      state.future = [];
    },

    setTool(state, action) {
      state.tool = action.payload;
    },
  },
});

export const {
  setScene,
  replaceScene,
  addElement,
  updateLastElementPoints,
  undo,
  redo,
  clearScene,
  addImageElement,
  setTool,
} = slice.actions;

export default slice.reducer;
