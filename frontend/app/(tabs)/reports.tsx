import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useExpenseStore, Expense } from '@/store/transaction-store';
import { useAuthStore } from '@/store/auth-store';
import { Card } from '@/components/ui/Card';
import { Colors } from '@/constants/Colors';

function isToday(dateString?: string) {
    if (!dateString) return false;
    const today = new Date();
    const date = new Date(dateString);
    return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
    );
}

export default function ReportsScreen() {
    const { expenses } = useExpenseStore();
    const { user } = useAuthStore();

    const todaysExpenses = expenses.filter(
        (exp: Expense) =>
            isToday(exp.createdAt) &&
            exp.username === user?.username
    );

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>Today's Expenses</Text>
            {todaysExpenses.length === 0 ? (
                <Text style={styles.emptyText}>No expenses created by you today.</Text>
            ) : (
                todaysExpenses.map((exp) => (
                    <Card key={exp.id} style={styles.expenseCard}>
                        <Text style={styles.expenseName}>{exp.name}</Text>
                        <Text style={styles.expenseAmount}>${parseFloat(exp.amount).toFixed(2)}</Text>
                        <Text style={styles.expenseDescription}>{exp.description}</Text>
                        <Text style={styles.expenseDate}>{new Date(exp.createdAt!).toLocaleTimeString()}</Text>
                    </Card>
                ))
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background.secondary,
    },
    content: {
        padding: 16,
        paddingBottom: 32,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.text.primary,
        marginBottom: 16,
    },
    expenseCard: {
        marginBottom: 16,
        padding: 16,
        borderRadius: 12,
        backgroundColor: Colors.background.card,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    expenseName: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text.primary,
    },
    expenseAmount: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.expense,
        marginTop: 4,
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
    emptyText: {
        textAlign: 'center',
        color: Colors.text.secondary,
        marginVertical: 16,
    },
});