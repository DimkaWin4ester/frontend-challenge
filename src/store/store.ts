import { configureStore } from "@reduxjs/toolkit";
import {catsSlice} from "./cats/catsSlice";

export const store = configureStore({
  reducer: {
    cats: catsSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
