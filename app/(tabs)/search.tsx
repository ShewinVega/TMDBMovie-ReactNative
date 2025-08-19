import MovieCard from "@/components/Movies/MovieCard";
import { SearchBar } from "@/components/Search";
import { icons } from "@/constants/icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { images } from "../../constants/images";
import { allMovies, AppDispatch, RootState, updateSearchCount } from "@/store";
import { useDispatch, useSelector } from "react-redux";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const dispatch: AppDispatch = useDispatch();
  const { movies, loading, error } = useSelector(
    (state: RootState) => state.movies,
  );
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const debounce = setTimeout(async () => {
      if (searchQuery.trim() && searchQuery.trim().length >= 3) {
        dispatch(allMovies({ query: searchQuery }));
      }
    }, 500);

    return () => clearTimeout(debounce);
  }, [searchQuery]);

  useEffect(() => {
    if (
      searchQuery.trim().length >= 3 &&
      movies &&
      movies?.length > 0 &&
      movies[0]
    ) {
      dispatch(updateSearchCount(searchQuery, movies[0]));
    }
  }, [movies]);

  return (
    <View
      className="flex-1 bg-primary"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <Image
        source={images.bg}
        className="absolute z-0 w-full"
        resizeMode="cover"
      />

      <FlatList
        data={movies}
        renderItem={({ item }) => <MovieCard {...item} />}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: "center",
          gap: 16,
          marginVertical: 16,
        }}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        className="px-5"
        ListHeaderComponent={
          <>
            {/* Logo */}
            <View className="w-full flex-row items-center justify-center">
              <Image source={icons.logo} className="w-12 h-10" />
            </View>

            {/* Search Bar */}
            <View className="my-5">
              <SearchBar
                placeholder="Search movies..."
                onChangeText={(text: string) => setSearchQuery(text)}
                value={searchQuery}
              />
            </View>

            {loading && (
              <ActivityIndicator
                size="large"
                color="#0000ff"
                className=" my-3"
              />
            )}

            {error && (
              <Text className="text-red-500 px-5 my-3 text-center">
                Error: {error?.message}
              </Text>
            )}
            {!loading &&
              !error &&
              "SEARCH TERM".trim() &&
              movies &&
              movies?.length > 0 && (
                <Text className="text-white text-xl font-bold px-5 my-3 text-center">
                  Search Results for{" "}
                  <Text className="text-accent">SEARCH TERM</Text>
                </Text>
              )}
          </>
        }
        ListEmptyComponent={
          !loading && !error ? (
            <View className="mt-10 px-5">
              <Text className="text-gray-500 text-center">
                {searchQuery.trim() ? "No movies found" : "Search for a movie"}
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({});
