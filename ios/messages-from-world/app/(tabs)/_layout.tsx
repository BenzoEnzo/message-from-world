import { Tabs, useRouter } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                headerShown: true,
                tabBarStyle: isLoading ? { display: 'none' } : {},
                headerLeft: () => (
                    <TouchableOpacity onPress={() => router.push('/')}>
                        <Ionicons name="arrow-back" size={24} color={Colors[colorScheme ?? 'light'].tint} />
                    </TouchableOpacity>
                ),
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="register"
                options={{
                    title: 'Sign-Up'
                }}
            />
            <Tabs.Screen
                name="login"
                options={{
                    title: 'Sign-In'
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'My profile'
                }}
            />
            <Tabs.Screen
                name="ranking"
                options={{
                    title: 'Ranking'
                }}
            />
        </Tabs>
    );
}