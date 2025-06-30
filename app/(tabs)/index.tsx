import MovieCard from "@/components/Movies/MovieCard";
import TrendingMovieCard from "@/components/Movies/TrendingMovieCard";
import { SearchBar } from "@/components/Search";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import useFetch from "@/hooks/useFetch";
import { getMovies } from "@/services/api";
import { getTrendingMovies } from "@/services/appwrite";
import { useRouter } from "expo-router";
import { ActivityIndicator, FlatList, Image, ScrollView, Text, View } from "react-native";

export default function Index() {

  const router = useRouter();

  // Fetch data for movies
  const { data, loading, error } = useFetch(() => getMovies({ query: '' }));

  // Fetch data for trending movies
  const { data: trendingMovies, loading: trendingLoading, error: trendingError } = useFetch(() => getTrendingMovies());

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg}  className="absolute z-0 w-full"/>
      <ScrollView 
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          minHeight: '100%',
          paddingBottom: 10,
        }}
      >
        <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />
        {
          loading || trendingError ? <ActivityIndicator size='large' color='#0000ff' className="mt-10 self-center" /> : error || trendingError ? (
            <Text>
              {error?.message}
            </Text>
          ) : (
            <View className="flex-1 mt-5">
              <SearchBar 
                onPress={() => router.push('/search')}
                placeholder='Search for a movie'
              />

              {/* Trending Movies */}
              {
                trendingMovies && (
                  <>
                    <View>
                      <Text className="text-lg text-white font-bold mb-3" >Trending Movies</Text>
                    </View>
                    <FlatList
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      ItemSeparatorComponent={() => <View className="w-4" />}
                      data={trendingMovies}
                      keyExtractor={(item) => item.movie_id.toString()}
                      renderItem={({item, index}) => <TrendingMovieCard movie={item} index={index} />}
                    />
                  </>
                )
              }
              <>
                <Text className="text-lg text-white font-bold mt-5 mb-3" >Latest Movies</Text>
                {/* List Data */}
                <FlatList 
                  data={data}
                  renderItem={({ item }) => <MovieCard {...item} />}
                  keyExtractor={(item) => item.id.toString()}
                  numColumns={3}
                  columnWrapperStyle={{
                    justifyContent: 'flex-start',
                    gap: 20,
                    paddingRight: 5,
                    marginBottom: 10
                  }}
                  className="mt-2 pb-32"
                  scrollEnabled={false}
                />
              </>
            </View>
          )
        }
      </ScrollView>
    </View>
  );
}