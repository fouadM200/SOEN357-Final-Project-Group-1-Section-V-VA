import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const NAV_ITEMS = [
  { name: 'home', label: 'Home', icon: 'home', route: '/(tabs)/home' },
  { name: 'explore', label: 'Exercises', icon: 'dumbbell', route: '/(tabs)/explore' },
  { name: 'coach', label: 'Coach', icon: 'whistle', route: '/(tabs)/coach' },
  { name: 'calorieTracker', label: 'Calories', icon: 'apple', route: '/(tabs)/calorieTracker' },
  { name: 'profile', label: 'Profile', icon: 'account', route: '/(tabs)/profile' },
];

export default function CustomBottomNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const colorScheme = useColorScheme();
  const activeColor = Colors[colorScheme ?? 'light'].tint;
  const inactiveColor = Colors[colorScheme ?? 'light'].tabIconDefault;

  const handleNavigation = (route: string) => {
    router.push(route as any);
  };

  const isTabActive = (itemName: string) => {
    if (pathname.includes(itemName)) return true;

    // Handle nested routes that don't include the tab name in their path
    if (itemName === 'explore' && (pathname.includes('/exercise/') || pathname.includes('/exercise'))) {
      return true;
    }
    if (itemName === 'coach' && (pathname.includes('/coach/') || pathname.includes('/messages'))) {
      return true;
    }
    if (itemName === 'calorieTracker' && pathname.includes('/add-meal')) {
      return true;
    }
    return false;
  };

  return (
    <View style={styles.container}>
      {NAV_ITEMS.map((item) => {
        const isActive = isTabActive(item.name);
        return (
          <TouchableOpacity
            key={item.name}
            style={styles.navItem}
            onPress={() => handleNavigation(item.route)}
          >
            <MaterialCommunityIcons
              name={item.icon as any}
              size={28}
              color={isActive ? activeColor : inactiveColor}
            />
            <Text style={[
              styles.label,
              { color: isActive ? activeColor : inactiveColor }
            ]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height:80,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    justifyContent: 'space-between',
    alignItems: 'center',
      paddingBottom: 20,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  label: {
    fontSize: 10,
    marginTop: 2,
  },
});
