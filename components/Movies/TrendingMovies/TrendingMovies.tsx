import { allTrendingMovies, AppDispatch, RootState } from "@/store";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import TrendingMovieCard from "../TrendingMovieCard";
import { useEffect } from "react";

export const TrendingMovies = () => {
  const dispatch: AppDispatch = useDispatch();
  const { trendingMovies, trendingLoading } = useSelector(
    (state: RootState) => state.movies,
  );

  useEffect(() => {
    dispatch(allTrendingMovies());
  }, []);

  return (
    <>
      {trendingLoading ? (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          className="mt-10 self-center"
        />
      ) : (
        trendingMovies && (
          <>
            <View>
              <Text className="text-lg text-white font-bold mb-3">
                Trending Movies
              </Text>
            </View>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              ItemSeparatorComponent={() => <View className="w-4" />}
              data={trendingMovies}
              keyExtractor={(item) => item.movie_id.toString()}
              renderItem={({ item, index }) => (
                <TrendingMovieCard movie={item} index={index} />
              )}
            />
          </>
        )
      )}
    </>
  );
};
