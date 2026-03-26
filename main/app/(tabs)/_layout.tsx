import { Tabs } from 'expo-router';
import React from 'react';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {MaterialCommunityIcons} from "@expo/vector-icons";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons size={28} name="home" color={color} />,
        }}
      />
        <Tabs.Screen
            name="explore"
            options={{
                title: "Exercises",
                tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="dumbbell" color={color} size={size} />
                ),
            }}
        />
        <Tabs.Screen
            name="coach"
            options={{
                title: "Coach",
                tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="whistle" color={color} size={size} />
                ),
            }}
        />
        <Tabs.Screen
            name="calorieTracker"
            options={{
                title: "Calorie Tracker",
                tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="apple" color={color} size={size} />
                ),
            }}
        />
        <Tabs.Screen
            name="profile"
            options={{
                title: "Profile",
                tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="account" color={color} size={size} />
                ),
            }}
        />
    </Tabs>
  );
}
