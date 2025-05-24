import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, View, Text } from 'react-native'; // Import Text and StyleSheet for custom labels
import Ionicons from '@expo/vector-icons/Ionicons'; // Import Ionicons

import { HapticTab } from '@/components/HapticTab'; // Your custom tab button
import TabBarBackground from '@/components/ui/TabBarBackground'; // Your custom tab bar background
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab, // Retain your custom HapticTab behavior
        tabBarBackground: TabBarBackground, // Retain your custom background
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute', // Allows your TabBarBackground to show blur
            backgroundColor: 'transparent', // Make tab bar transparent
            borderTopWidth: 0, // Remove top border
            elevation: 0, // Remove shadow on Android
            height: 90, // Custom height for the tab bar
            paddingBottom: 25, // Adjust padding for iPhone X/notch devices
          },
          default: {
            height: 70, // Custom height for Android
            paddingBottom: 10,
          },
        }),
        // Customize label style
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          // Use Ionicons here
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'} // Filled icon when focused, outline when not
              size={size + 2} // Slightly larger icon
              color={color}
            />
          ),
          // You can also add a badge
          tabBarBadge: 3, // Example: Show a badge with number 3
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          // Use Ionicons here
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'compass' : 'compass-outline'}
              size={size + 2}
              color={color}
            />
          ),
          // Example of a custom tab bar label component
          tabBarLabel: ({ color, focused }) => (
            <Text style={{ color, fontSize: 12, fontWeight: focused ? 'bold' : 'normal' }}>
              Discover
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="settings" // Example of another tab
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'settings' : 'settings-outline'}
              size={size + 2}
              color={color}
            />
          ),
          // You can also hide the label if only icon is desired
          // tabBarShowLabel: false,
        }}
      />
      {/* Add more Tabs.Screen components for other routes */}
    </Tabs>
  );
}

// Example custom styles (if you need a completely custom TabBar, not just background/button)
const styles = StyleSheet.create({
  customTabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    height: 80,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    // ... more styles
  },
});