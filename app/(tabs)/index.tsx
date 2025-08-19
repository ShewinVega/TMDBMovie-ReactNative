import MovieCard from "@/components/Movies/MovieCard";
import { SearchBar } from "@/components/Search";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { allMovies, AppDispatch, RootState } from "@/store";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useEffect } from "react";
import { TrendingMovies } from "@/components/Movies/TrendingMovies/TrendingMovies";

export default function Index() {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const { movies, loading, error } = useSelector(
    (state: RootState) => state.movies,
  );

  useEffect(() => {
    dispatch(allMovies({ query: "" }));
  }, []);

  return (
    <View className="flex-1 bg-primary h-screen">
      <Image source={images.bg} className="absolute z-0 w-full" />
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          minHeight: "100%",
          paddingBottom: 10,
        }}
      >
        <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            className="mt-10 self-center"
          />
        ) : error ? (
          <Text>{error?.message}</Text>
        ) : (
          <View className="flex-1 mt-5">
            <SearchBar
              onPress={() => router.push("/search")}
              placeholder="Search for a movie"
            />

            {/* Trending Movies */}
            <TrendingMovies />

            <>
              <Text className="text-lg text-white font-bold mt-5 mb-3">
                Latest Movies
              </Text>
              {/* List Data */}
              <FlatList
                data={movies}
                renderItem={({ item }) => <MovieCard {...item} />}
                keyExtractor={(item) => item.id.toString()}
                numColumns={3}
                columnWrapperStyle={{
                  justifyContent: "flex-start",
                  gap: 20,
                  paddingRight: 5,
                  marginBottom: 10,
                }}
                className="mt-2 pb-32"
                scrollEnabled={false}
              />
            </>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
