import { icons } from '@/constants/icons';
import useFetch from '@/hooks/useFetch';
import { getMovieDeatils } from '@/services/api';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface MovieInfoProps {
  label: string;
  value: string | number | null | undefined;
}

const MovieInfo = ({ label, value }: MovieInfoProps) => {
  return (
    <View className='flex-col items-start justify-center mt-5'>
      <Text className='text-light-200 text-sm font-normal'>{label}</Text>
      <Text className='text-light-100 text-sm font-bold mt-2'>{value ?? 'N/A'}</Text>
    </View>
  )
}

const MovieDetail = () => {
    
    // get the movie id form the url
    const { id } = useLocalSearchParams();
    
    // get the movie details
    const { data: movie } = useFetch(() => getMovieDeatils(id as string));

  return (
    <View className='bg-primary flex-1 pb-20'>
      <ScrollView>
        <View>
          <Image 
            source={{ uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}` }}
            className='w-full h-[550px]'
            resizeMode='stretch'
          />
        </View>
        <View className='flex-col items-start justify-center my-5 px-5 gap-2 '>
          {/* Title, Release Date and Runtime */}
          <View className='flex-col items-start'>
            <Text className='text-white font-bold text-xl'>{movie?.title}</Text>
            <View className='flex-row items-center gap-2'>
              <Text className='text-light-200 text-sm'>{movie?.release_date?.split('-')[0]}</Text>
              <Text className='text-light-200 text-sm'>{movie?.runtime}m</Text>
            </View>
          </View>
            {/* Rate and Reviews */}
          <View className='flex-row items-center bg-dark-100 px-2 py-1 rounded-md  gap-x-1 mt-2'>
            <Image 
              source={icons.star}
              className='size-4'
            />
            <Text className='text-white fond-bold text-sm'>
              {Math.round(movie?.vote_average ?? 0)}/10
            </Text>
            <Text className='text-light-200' >
              {movie?.vote_count} votes
            </Text>
          </View>
          {/* Overview */}
          <MovieInfo label='Overview' value={movie?.overview} />
          {/* Genres */}
          <View className='mt-5'>
            <Text className='text-light-200 text-sm font-normal '>Genres</Text>
            <View className='flex-row items-start gap-2 mt-2'>
              {
                movie?.genres.map((genre) => (
                  <View key={genre.id} className='flex-row items-center justify-center bg-light-300 px-2 py-1 rounded-md'>
                    <Text className='text-white font-bold text-sm'>{genre.name}</Text>
                  </View>
                ))
              }
            </View>
          </View>
          {/* Budget */}
          <View className='flex flex-row justify-between w-2/3'>
            <MovieInfo label='Budget' value={`$${movie?.budget / 1_000_000} million`} />
            <MovieInfo label='Revenue' value={`$${Math.round(movie?.revenue) / 1_000_000} million`} />
          </View>
          {/* Production Companies */}
          <MovieInfo label='Production Companies' value={movie?.production_companies.map((company) => company.name).join(', ') || 'N/A'} />
        </View>
      </ScrollView>
      <TouchableOpacity className='absolute left-0 right-0 bottom-0 mx-5 bg-accent rounded-lg py-3.5  flex flex-row items-center justify-center z-50' onPress={() => router.back()}>
        <Image source={icons.arrow} className='size-5 mr-1 mt-0.5 rotate-180' tintColor="#fff" />
        <Text className='text-white font-semibold'>Go Back</Text>
      </TouchableOpacity>
    </View>
  )
}

export default MovieDetail

const styles = StyleSheet.create({

});