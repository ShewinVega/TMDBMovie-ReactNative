export const TMDB_CONFIG = {
    baseUrl: 'https://api.themoviedb.org/3',
    apiKey: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`
    }
}

// /discover/movie

export const getMovies = async ({query}: {query: string}) => {
    // create the url
    const url = query
        ? `${TMDB_CONFIG.baseUrl}/search/movie?query=${encodeURIComponent(query)}`
        : `${TMDB_CONFIG.baseUrl}/discover/movie?sort_by=popularity.desc`;

    // make the request
    const response = await fetch(url,{
        method: 'GET',
        headers: TMDB_CONFIG.headers,
    });

    // test if everything is ok
    if(!response.ok) {
        // @ts-ignore
        throw new Error('Failed to fetch movies', response.statusText);
    }

    const data = await response.json();

    return data.results;

}

// Get movie details 
export const getMovieDeatils = async (movieId: string):Promise<MovieDetails> => {
    try {
        // create the url
        const url = `${TMDB_CONFIG.baseUrl}/movie/${movieId}?api_key=${TMDB_CONFIG.apiKey}`;

        // make the request
        const response = await fetch(url, {
            method: 'GET',
            headers: TMDB_CONFIG.headers,
        });

        if(!response.ok ) {
            // @ts-ignore
            throw new Error('Failed to fetch movie details', response.statusText);
        };

        const data = await response.json();

        return data;

    } catch(error) {
        console.log(error);
        throw error;
    }
}