import { icons } from '@/constants/icons';
import { images } from '@/constants/images';
import { Tabs } from 'expo-router';
import React from 'react';
import { Image, ImageBackground, ImageSourcePropType, StyleSheet, Text, View } from 'react-native';

interface TabProps {
    name: string;
    icon: ImageSourcePropType;
    focused: boolean;
}

const TabBackground = ({ focused ,name, icon }: TabProps) => {
    if(focused) {
        return (
            <>
                <ImageBackground
                    source={images.highlight}
                    className="flex flex-row flex-1 w-full min-w-[112px] min-h-16 mt-4 justify-center items-center rounded-full overflow-hidden"
                >
                    <Image 
                        source={icon}
                        tintColor="#151312"
                        className="size-5"
                    />
                    <Text className="text-secondary text-base font-semibold ml-2">{name}</Text>
                </ImageBackground>
            </>
        )
    }

    return (
        <View className="size-full justify-center items-center mt-4 rounded-full" >
            <Image source={icon} tintColor="#A8B5DB" />
        </View>
    ) 
}

const _Layout = () => {
return (
    <Tabs
        screenOptions={{
            tabBarShowLabel: false,
            tabBarItemStyle: styles.tabBarItem,
            tabBarStyle: styles.tabBar,
        }}
    >
        <Tabs.Screen 
            name='index'
            options={{ 
                headerShown: false, 
                tabBarIcon: ({ focused }) => (<TabBackground focused={focused} name='Home' icon={icons.home} />) 
            }}
        />
        <Tabs.Screen 
            name='search'
            options={{ 
                headerShown: false, 
                tabBarIcon: ({ focused }) => (<TabBackground focused={focused} name='Search' icon={icons.search} />)
            }}
        />
        <Tabs.Screen 
            name='saved'
            options={{ 
                headerShown: false,
                tabBarIcon: (({ focused }) => (<TabBackground focused={focused} name='Saved' icon={icons.save} />)) 
            }}
        />
        <Tabs.Screen 
            name='profile'
            options={{ 
                headerShown: false,
                tabBarIcon: (({ focused }) => (<TabBackground focused={focused} name='Profile' icon={icons.person} />))
            }}
        />
    </Tabs>
)
}

export default _Layout

const styles = StyleSheet.create({
    tabBarItem: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabBar: {
        backgroundColor: '#0f0D23',
        borderRadius: 50,
        marginHorizontal: 20,
        marginBottom: 36,
        height: 52,
        position: 'absolute',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#0f0d23'
    }
});