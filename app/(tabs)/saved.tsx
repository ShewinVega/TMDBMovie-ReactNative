import SavedMovieCard from "@/components/Movies/SavedMovieCard";
import { icons } from "@/constants/icons";
import { allSavedMovies, AppDispatch, RootState } from "@/store";

import React, { useEffect } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

const Saved = () => {
  const insets = useSafeAreaInsets();
  const dispatch: AppDispatch = useDispatch();
  const { savedMovies: movies, loading } = useSelector(
    (state: RootState) => state.movies,
  );

  useEffect(() => {
    dispatch(allSavedMovies());
  }, []);

  return (
    <View
      className="flex-1 bg-primary h-screen"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          className="mt-10 self-center"
        />
      ) : (
        <FlatList
          data={movies}
          renderItem={({ item }) => <SavedMovieCard {...item} />}
          keyExtractor={(item) => item.movie_id.toString()}
          numColumns={3}
          columnWrapperStyle={{
            justifyContent: "flex-start",
            gap: 20,
            paddingRight: 5,
            marginBottom: 10,
          }}
          ListHeaderComponent={
            <>
              {/* Logo */}
              <View className="w-full flex-row items-center justify-center mb-10">
                <Image source={icons.logo} className="w-12 h-10" />
              </View>
              {loading && (
                <ActivityIndicator
                  size="large"
                  color="#0000ff"
                  className=" my-3"
                />
              )}
            </>
          }
          ListEmptyComponent={
            !loading && movies?.length === 0 ? (
              <View className="mt-10 px-5">
                <Text className="text-gray-500 text-center">
                  No movies saved!
                </Text>
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
};

export default Saved;

const styles = StyleSheet.create({});
