import React from 'react';
import { Tabs } from 'expo-router';
import { Platform, TouchableOpacity, View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Home, PieChart, Plus, Layers, Settings } from 'lucide-react-native';
import { Colors } from '@/constants/Colors'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import { blue } from 'react-native-reanimated/lib/typescript/Colors';
import { useExpenseStore } from '@/store/transaction-store';

export default function TabLayout() {
  const router = useRouter();

  const handleAddPress = () => {
    router.push('/transaction/new');
  };

  return (
    // <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background.main }}>
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary.main,
        tabBarInactiveTintColor: Colors.text.light,
        tabBarStyle: {
          // borderTopWidth: 0,
          borderTopColor: Colors.border,
          height: Platform.OS === 'ios' ? 100 : 70,
          paddingBottom: Platform.OS === 'ios' ? 30 : 10,
          paddingTop: 10,
        },
        headerStyle: {
          backgroundColor: Colors.background.main,
        },
        headerTitleStyle: {
          color: Colors.text.primary,
          fontWeight: '600',
          },
        headerPressOpacity: 0.8,
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: 'Reports',
          tabBarIcon: ({ color }) => <PieChart size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="add_placeholder"
        options={{
          title: 'Placeholder',
          tabBarButton: () => (
            <TouchableOpacity style={styles.addButton} onPress={handleAddPress}>
              <View style={styles.addButtonInner}>
                <Plus size={24} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Categories',
          tabBarIcon: ({ color }) => <Layers size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Settings size={24} color={color} />,
        }}
      />
      </Tabs>
    // </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  addButton: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
      },
    }),
  },
});