import { Client, Databases, ID, Query } from "react-native-appwrite";

// variables
const DATABASE_ID: string = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID || "";
const METRICS_COLLECTION: string =
  process.env.EXPO_PUBLIC_APPWRITE_METRICS_ID || "";
const FAVORITES_COLLECTION: string =
  process.env.EXPO_PUBLIC_APPWRITE_FAVORITE_ID || "";
const ENDPOINT_APPWRITE: string =
  process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1";
const PROJECT_ID: string = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID || "";

// Create a client
const client = new Client()
  .setEndpoint(ENDPOINT_APPWRITE)
  .setProject(PROJECT_ID);

// get AppWrite database
const database = new Databases(client);

export const updateSearchCount = async (query: string, movie: Movie) => {
  try {
    const results = await database.listDocuments(
      DATABASE_ID,
      METRICS_COLLECTION,
      [Query.equal("searchTerm", query)],
    );

    // Check if a record of that search has already been stored
    if (results.documents.length > 0) {
      const existingMovie = results.documents[0];

      await database.updateDocument(
        DATABASE_ID,
        METRICS_COLLECTION,
        existingMovie.$id,
        {
          count: existingMovie.count + 1,
        },
      );
    } else {
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

export const getTrendingMovies = async (): Promise<
  TrendingMovie[] | undefined
> => {
  try {
    const results = await database.listDocuments(
      DATABASE_ID,
      METRICS_COLLECTION,
      [Query.limit(5), Query.orderDesc("count")],
    );

    return results.documents as unknown as TrendingMovie[];
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const saveFavoriteMovie = async (movie: Movie): Promise<void> => {
  try {
    // get the document if this one exist

    const getFavoriteMovies = await database.listDocuments(
      DATABASE_ID,
      FAVORITES_COLLECTION,
      [Query.equal("movie_id", movie.id)],
    );

    // Checkf if there is a movie already saved as a favorite
    if (getFavoriteMovies.documents.length > 0) {
      const movieAlreadySaved = getFavoriteMovies.documents[0];

      await database.updateDocument(
        DATABASE_ID,
        FAVORITES_COLLECTION,
        movieAlreadySaved.$id,
        {
          saved: false,
        },
      );
    }

    if (getFavoriteMovies.documents.length === 0) {
      await database.createDocument(
        DATABASE_ID,
        FAVORITES_COLLECTION,
        ID.unique(),
        {
          movie_id: movie.id,
          title: movie.title,
          poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          saved: true,
        },
      );
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getFavoriteMovies = async (): Promise<
  SavedMovie[] | undefined
> => {
  try {
    const getFavoriteMovies = await database.listDocuments(
      DATABASE_ID,
      FAVORITES_COLLECTION,
      [Query.orderDesc("created_at")],
    );

    return getFavoriteMovies.documents as unknown as SavedMovie[];
  } catch (error) {
    console.log(error);
    throw error;
  }
};
