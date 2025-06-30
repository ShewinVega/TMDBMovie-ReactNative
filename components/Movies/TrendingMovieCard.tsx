import { images } from '@/constants/images';
import MaskedView from '@react-native-masked-view/masked-view';
import { Link } from 'expo-router';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

const TrendingMovieCard = ({ movie: { title, poster_url, movie_id }, index }: TrendingCardProps) => {
  return (
    <Link href={`/movie/${movie_id}`} asChild >
        <TouchableOpacity className='w-32 relative pl-5' >
            <Image 
                source={{ uri: poster_url }}
                resizeMode='cover'
                className='w-32 h-48 rounded-lg'
            />
            <View className='absolute bottom-9 -left-3.5 px-2'>
                <MaskedView 
                    maskElement={
                        <Text className='text-white text-6xl font-bold'>
                            {index + 1}
                        </Text>
                    }>
                        <Image 
                            source={images.rankingGradient}
                            className='size-14'
                            resizeMode='cover'
                        />
                </MaskedView>
            </View>
                <Text className='text-sm text-light-200 font-bold mt-2' numberOfLines={2}>
                    {title}
                </Text>
        </TouchableOpacity>
    </Link>
  )
}

export default TrendingMovieCard