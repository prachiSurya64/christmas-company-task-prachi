import { configureStore } from "@reduxjs/toolkit";
import drawingReducer from "./drawingBoard";

const store = configureStore({
  reducer: {
    drawing: drawingReducer
  }
});

export default store;
