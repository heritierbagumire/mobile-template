import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@/types/user';
import axios from 'axios';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      
      login: async (username, password) => {
        set({ isLoading: true });
        try {
          const response = await axios.get(`https://67ac71475853dfff53dab929.mockapi.io/api/v1/users?username=${username}`);
          const users: User[] = response.data;
          if (users.length === 0) {
            throw new Error('User not found');
          }
          const user = users[0];
          if (user.password !== password) {
            throw new Error('Invalid password');
          }
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);