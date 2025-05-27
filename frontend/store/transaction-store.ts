import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axios from 'axios';

export interface Expense {
  id: string;
  name: string;
  amount: string;
  description: string;
  createdAt?: string;
  username?: string;
}

interface ExpenseState {
  expenses: Expense[];
  isLoading: boolean;
  fetchExpenses: () => Promise<void>;
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
}

export const useExpenseStore = create<ExpenseState>()(
  persist(
    (set, get) => ({
      expenses: [],
      isLoading: false,

      fetchExpenses: async () => {
        set({ isLoading: true });
        try {
          const response = await axios.get('https://67ac71475853dfff53dab929.mockapi.io/api/v1/expenses');
          set({ expenses: response.data, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      addExpense: async (expense) => {
        set({ isLoading: true });
        try {
          const payload = { ...expense, createdAt: new Date().toISOString() };
          const response = await axios.post('https://67ac71475853dfff53dab929.mockapi.io/api/v1/expenses', payload);
          set({ expenses: [response.data, ...get().expenses], isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      deleteExpense: async (id) => {
        set({ isLoading: true });
        try {
          await axios.delete(`https://67ac71475853dfff53dab929.mockapi.io/api/v1/expenses/${id}`);
          set({ expenses: get().expenses.filter(exp => exp.id !== id), isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
    }),
    {
      name: 'expense-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);