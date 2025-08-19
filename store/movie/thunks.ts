import { Client, Databases, ID, Query } from "react-native-appwrite";

import { TMDB_CONFIG } from "@/config/api";
import { AppDispatch } from "../store";
import {
  getMovieDetail,
  getMovies,
  getSavedMovies,
  getTrendingMovies,
  setLoading,
} from "./movie.slice";
import {
  DATABASE_ID,
  ENDPOINT_APPWRITE,
  FAVORITES_COLLECTION,
  METRICS_COLLECTION,
  PROJECT_ID,
} from "@/config/appwrite";

// Create a client
const client = new Client()
  .setEndpoint(ENDPOINT_APPWRITE)
  .setProject(PROJECT_ID);

// create appwrite database instance
const database = new Databases(client);

// Movies
export const allMovies = ({ query }: { query: string }) => {
  return async (dispatch: AppDispatch) => {
    // create the url
    const url = query
      ? `${TMDB_CONFIG.baseUrl}/search/movie?query=${encodeURIComponent(query)}`
      : `${TMDB_CONFIG.baseUrl}/discover/movie?sort_by=popularity.desc`;

    // Set loading
    dispatch(setLoading({ loading: true }));

    // make the request
    const response = await fetch(url, {
      method: "GET",
      headers: TMDB_CONFIG.headers,
    });

    // test if everything is ok
    if (!response.ok) {
      dispatch(
        getMovies({
          error: response.statusText,
          movies: [],
        }),
      );
      // @ts-ignore
      throw new Error("Failed to fetch movies", response.statusText);
    }

    const data = await response.json(); // convert to json

    // change the state with the new data
    dispatch(
      getMovies({
        movies: data.results,
        error: "",
      }),
    );
  };
};

// Movie Detail
export const findMovie = (movieId: string) => {
  return async (dispatch: AppDispatch, getState: any) => {
    try {
      // Variables
      let movieInFavorites = false;

      // create url
      const url = `${TMDB_CONFIG.baseUrl}/movie/${movieId}?api_key=${TMDB_CONFIG.apiKey}`;

      // Make de request
      const response = await fetch(url, {
        method: "GET",
        headers: TMDB_CONFIG.headers,
      });

      // validate response
      if (!response.ok) {
        dispatch(getMovieDetail({ error: response.statusText }));
      }

      // convert to JSON
      const data = await response.json();

      // Verify if the movie has been saved in favorites(saved) movies
      const getSavedMoviesResponse = await database.listDocuments(
        DATABASE_ID,
        FAVORITES_COLLECTION,
      );

      dispatch(
        getSavedMovies({
          movies: getSavedMoviesResponse.documents as unknown as SavedMovie[],
        }),
      );

      dispatch(getMovieDetail({ movie: data }));
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
};

// Trending Movies
export const allTrendingMovies = () => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading({ trendingLoading: true }));

      const results = await database.listDocuments(
        DATABASE_ID,
        METRICS_COLLECTION,
        [Query.limit(5), Query.orderDesc("count")],
      );

      dispatch(
        getTrendingMovies({
          trendingMovies: results.documents,
          error: "",
        }),
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
};

// Update trending movie count or add new one
export const updateSearchCount = (query: string, movie: Movie) => {
  return async (dispatch: AppDispatch) => {
    try {
      // list trending movies base on query parameter
      const getTrendingMovies = await database.listDocuments(
        DATABASE_ID,
        METRICS_COLLECTION,
        [
          Query.and([
            Query.equal("searchTerm", query),
            Query.equal("movie_id", movie.id),
          ]),
        ],
      );

      // Check if exist at least one record
      if (getTrendingMovies.documents.length > 0) {
        const movieAlreadyExist = getTrendingMovies.documents[0]; // get the first coincidence

        // update the movie count field
        await database.updateDocument(
          DATABASE_ID,
          METRICS_COLLECTION,
          movieAlreadyExist.$id,
          {
            count: movieAlreadyExist.count + 1,
          },
        );
      }

      // if theres not trending movies means is new search and we are going to add
      // this new movie to our appwrite database
      if (getTrendingMovies.documents.length === 0) {
        await database.createDocument(
          DATABASE_ID,
          METRICS_COLLECTION,
          ID.unique(),
          {
            searchTerm: query,
            count: 1,
            movie_id: movie.id,
            poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            title: movie.title,
          },
        );
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
};

// Saved Movies
export const allSavedMovies = () => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading({ loading: true }));

      const getSavedMoviesResponse = await database.listDocuments(
        DATABASE_ID,
        FAVORITES_COLLECTION,
        [Query.orderDesc("created_at")],
      );

      dispatch(
        getSavedMovies({
          movies: getSavedMoviesResponse.documents as unknown as SavedMovie[],
        }),
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
};

export const saveMovie = (movie: SavedMovie) => {
  return async (dispatch: AppDispatch) => {
    try {
      // get the document if this one exist
      const getFavoriteMovies = await database.listDocuments(
        DATABASE_ID,
        FAVORITES_COLLECTION,
        [Query.equal("movie_id", movie.movie_id)],
      );

      // Checkf if there is a movie already saved as a favorite
      if (getFavoriteMovies.documents.length > 0) {
        const movieAlreadySaved = getFavoriteMovies.documents[0];

        await database.deleteDocument(
          DATABASE_ID,
          FAVORITES_COLLECTION,
          movieAlreadySaved.$id,
        );
      }

      if (getFavoriteMovies.documents.length === 0) {
        await database.createDocument(
          DATABASE_ID,
          FAVORITES_COLLECTION,
          ID.unique(),
          {
            movie_id: movie.movie_id,
            title: movie.title,
            poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_url}`,
            vote_average: movie.vote_average,
            release_date: movie.release_date,
            created_at: movie.created_at,
          },
        );
      }

      // get new saved movies array
      const newSavedMoviesCollection = await database.listDocuments(
        DATABASE_ID,
        FAVORITES_COLLECTION,
        [Query.orderDesc("created_at")],
      );

      dispatch(
        getSavedMovies({
          movies: newSavedMoviesCollection.documents as unknown as SavedMovie[],
        }),
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
};
