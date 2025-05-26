import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RootLayout() {
  const { isAuthenticated } = useAuthStore();

  return (
    <SafeAreaView>
      <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="transaction/new" options={{ presentation: 'modal', title: 'New Transaction' }} />
      <Stack.Screen name="transaction/[id]" options={{ title: 'Transaction Details' }} />
     </Stack>
    </SafeAreaView>
  );
}