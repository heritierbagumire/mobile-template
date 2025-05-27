import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, Share2 } from 'lucide-react-native';
import { useExpenseStore, Expense } from '@/store/transaction-store';
import { useAuthStore } from '@/store/auth-store';
import { Colors } from '@/constants/Colors';

export default function HomeScreen() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const {
    expenses,
    isLoading,
    fetchExpenses,
    deleteExpense,
  } = useExpenseStore();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [showedExpenses, setShowedExpenses] = useState<Expense[]>([]);

  // Notification on login
  useEffect(() => {
    if (isAuthenticated && user?.username) {
      Alert.alert('Welcome', `Welcome, ${user.username}!`);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    // Pagination: show 10 per page
    const filtered = expenses.filter(exp => exp.name.toLowerCase().includes(search.toLowerCase()));
    setShowedExpenses(filtered.slice(0, page * 10));
  }, [expenses, search, page]);

  // Summary calculations
  const total = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
  const avg = expenses.length ? total / expenses.length : 0;
  const count = expenses.length;

  // Sort expenses by date (newest first)
  const sortedExpenses = [...showedExpenses].sort((a, b) => {
    return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
  });

  const handleAddExpense = () => {
    router.push('/transaction/new');
  };

  const handleExpensePress = (expense: Expense) => {
    router.push({ pathname: '/transaction/[id]', params: { id: expense.id } });
  };

  const handleDeleteExpense = async (id: string) => {
    await deleteExpense(id);
  };

  const handleLoadMore = () => {
    setPage(page + 1);
  };

  const renderHeader = () => (
    <>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=2071&auto=format&fit=crop' }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.welcomeText}>Welcome,</Text>
            <Text style={styles.userName}>{user?.username || 'User'}</Text>
          </View>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddExpense}
          >
            <Plus size={18} stroke="#FFFFFF" />
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareButton}>
            <Share2 size={20} color={Colors.text.primary} />
          </TouchableOpacity>
        </View>
      </View>
      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Dashboard Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Expenses:</Text>
          <Text style={styles.summaryValue}>${total.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Average Expense:</Text>
          <Text style={styles.summaryValue}>${avg.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Number of Expenses:</Text>
          <Text style={styles.summaryValue}>{count}</Text>
        </View>
      </View>
      {/* Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search expenses by aame..."
        value={search}
        onChangeText={setSearch}
      />
      <Text style={styles.sectionTitle}>Recent Expenses</Text>
    </>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No expenses yet</Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={handleAddExpense}
      >
        <Text style={styles.emptyButtonText}>Add your first expense</Text>
      </TouchableOpacity>
    </View>
  );

  const renderExpenseItem = ({ item }: { item: Expense }) => (
    <TouchableOpacity style={styles.expenseItem} onPress={() => handleExpensePress(item)}>
      <View style={styles.expenseInfo}>
        <Text style={styles.expenseName}>{item.name}</Text>
        <Text style={styles.expenseAmount}>${parseFloat(item.amount).toFixed(2)}</Text>
      </View>
      <Text style={styles.expenseDescription}>{item.description}</Text>
      <Text style={styles.expenseDate}>{new Date(item.createdAt!).toLocaleDateString()}</Text>
      <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteExpense(item.id)}>
        <Text style={{ color: 'red', fontWeight: 'bold' }}>Delete</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color={Colors.primary.main} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={sortedExpenses}
          renderItem={renderExpenseItem}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmptyList}
          contentContainerStyle={styles.listContent}
          ListFooterComponent={showedExpenses.length < expenses.filter(exp => exp.name.toLowerCase().includes(search.toLowerCase())).length ? (
            <TouchableOpacity style={styles.loadMoreButton} onPress={handleLoadMore}>
              <Text style={styles.loadMoreText}>Load More</Text>
            </TouchableOpacity>
          ) : null}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  welcomeText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary.main,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 12,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 4,
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryCard: {
    backgroundColor: Colors.background.card,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    color: Colors.text.primary,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  summaryLabel: {
    color: Colors.text.secondary,
    fontSize: 15,
  },
  summaryValue: {
    color: Colors.text.primary,
    fontWeight: '600',
    fontSize: 15,
  },
  searchInput: {
    backgroundColor: Colors.background.card,
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 16,
    marginBottom: 12,
    fontSize: 16,
    color: Colors.text.primary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginTop: 8,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 16,
  },
  emptyButton: {
    backgroundColor: Colors.primary.main,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  expenseItem: {
    backgroundColor: Colors.background.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  expenseInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expenseName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: 'red',
  },
  expenseDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 4,
  },
  expenseDate: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  deleteButton: {
    marginTop: 8,
    alignSelf: 'flex-end',
    padding: 4,
  },
  loadMoreButton: {
    backgroundColor: Colors.primary.main,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  loadMoreText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});