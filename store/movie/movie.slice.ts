import { createSlice } from "@reduxjs/toolkit";

export const initialState: {
  movies: Movie[] | null;
  savedMovies: SavedMovie[] | null;
  trendingMovies: TrendingMovie[] | null;
  movieDetail: Movie | null;
  loading: boolean;
  trendingLoading: boolean;
  error: Error | null;
} = {
  movies: null,
  savedMovies: null,
  trendingMovies: null,
  movieDetail: null,
  loading: false,
  trendingLoading: false,
  error: null,
};

export const movieSlice = createSlice({
  name: "movie",
  initialState,
  reducers: {
    setLoading: (state, { payload }) => {
      if (payload.loading) {
        state.loading = true;
      }

      if (payload.trendingLoading) {
        state.trendingLoading = true;
      }
    },
    getMovies: (state, { payload }) => {
      state.movies = payload.movies;
      state.error = payload.error;
      state.loading = false;
    },

    getTrendingMovies: (state, { payload }) => {
      state.trendingMovies = payload.trendingMovies;
      state.error = payload.error;
      state.trendingLoading = false;
    },

    getMovieDetail: (state, { payload }) => {
      state.movieDetail = payload.movie;
      state.error = payload.error;
    },

    getSavedMovies: (state, { payload }) => {
      state.savedMovies = payload.movies;
      state.loading = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setLoading,
  getMovies,
  getTrendingMovies,
  getMovieDetail,
  getSavedMovies,
} = movieSlice.actions;
