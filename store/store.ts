import { configureStore } from "@reduxjs/toolkit";
import { movieSlice } from "./movie/movie.slice";

export const store = configureStore({
  reducer: {
    movies: movieSlice.reducer,
  },
});

// infer types from the store itself

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
