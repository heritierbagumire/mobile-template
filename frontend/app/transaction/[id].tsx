import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Alert,
    TouchableOpacity,
    Platform,
    TextInput,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Trash2, Edit2, Save } from 'lucide-react-native';
import { useExpenseStore, Expense } from '@/store/transaction-store';
import { Button } from '@/components/ui/Button';
import { Colors } from '@/constants/Colors';

export default function ExpenseDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { expenses, deleteExpense, addExpense } = useExpenseStore();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const expense = expenses.find(e => e.id === id);
    const [form, setForm] = useState<Partial<Expense>>({
        name: expense?.name || '',
        amount: expense?.amount || '',
        description: expense?.description || '',
    });

    if (!expense) {
        return (
            <View style={styles.notFoundContainer}>
                <Text style={styles.notFoundText}>Expense not found</Text>
                <Button
                    title="Go Back"
                    onPress={() => router.back()}
                    style={styles.backButton}
                />
            </View>
        );
    }

    const formattedDate = new Date(expense.createdAt || '').toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const handleDelete = async () => {
        Alert.alert(
            'Delete Expense',
            'Are you sure you want to delete this expense?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        setIsLoading(true);
                        await deleteExpense(id as string);
                        setIsLoading(false);
                        Alert.alert('Deleted', 'Expense deleted!');
                        router.back();
                    },
                },
            ]
        );
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        if (!form.name || !form.amount) {
            Alert.alert('Validation', 'Name and amount are required.');
            return;
        }
        setIsLoading(true);
        try {
            // PATCH to API
            const updatedExpense = { ...expense, ...form };
            await fetch(`https://67ac71475853dfff53dab929.mockapi.io/api/v1/expenses/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedExpense),
            });
            // Optimistically update in Zustand
            await deleteExpense(id as string);
            await addExpense({
                name: form.name!,
                amount: form.amount!,
                description: form.description || '',
            });
            setIsEditing(false);
            Alert.alert('Updated', 'Expense updated!');
        } catch (e) {
            Alert.alert('Error', 'Failed to update expense.');
        }
        setIsLoading(false);
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <View style={styles.iconCircle}>
                    <Text style={styles.iconText}>💸</Text>
                </View>
                {isEditing ? (
                    <TextInput
                        style={styles.titleInput}
                        value={form.name}
                        onChangeText={v => setForm(f => ({ ...f, name: v }))}
                        placeholder="Expense Name"
                    />
                ) : (
                    <Text style={styles.title}>{expense.name}</Text>
                )}
                {isEditing ? (
                    <TextInput
                        style={styles.amountInput}
                        value={form.amount}
                        onChangeText={v => setForm(f => ({ ...f, amount: v }))}
                        placeholder="Amount"
                        keyboardType="numeric"
                    />
                ) : (
                    <Text style={[styles.amount, { color: Colors.expense }]}>-${parseFloat(expense.amount).toFixed(2)}</Text>
                )}
            </View>

            <View style={styles.detailsContainer}>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Date</Text>
                    <Text style={styles.detailValue}>{formattedDate}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Description</Text>
                    {isEditing ? (
                        <TextInput
                            style={styles.descriptionInput}
                            value={form.description}
                            onChangeText={v => setForm(f => ({ ...f, description: v }))}
                            placeholder="Description"
                        />
                    ) : (
                        <Text style={styles.detailValue}>{expense.description}</Text>
                    )}
                </View>
            </View>

            <View style={styles.actionsContainer}>
                {isEditing ? (
                    <TouchableOpacity
                        style={[styles.actionButton, styles.saveButton]}
                        onPress={handleSave}
                        disabled={isLoading}
                    >
                        <Save size={20} color={Colors.primary.main} />
                        <Text style={[styles.actionText, styles.saveText]}>Save</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={[styles.actionButton, styles.editButton]}
                        onPress={handleEdit}
                    >
                        <Edit2 size={20} color={Colors.primary.main} />
                        <Text style={[styles.actionText, styles.editText]}>Edit</Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={handleDelete}
                    disabled={isLoading}
                >
                    <Trash2 size={20} color={Colors.status.error} />
                    <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
                </TouchableOpacity>
            </View>
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
    },
    header: {
        alignItems: 'center',
        marginBottom: 24,
    },
    iconCircle: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: Colors.background.card,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        ...Platform.select({
            ios: {
                shadowColor: Colors.shadow,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    iconText: {
        fontSize: 32,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: Colors.text.primary,
        marginBottom: 8,
    },
    titleInput: {
        fontSize: 24,
        fontWeight: '600',
        color: Colors.text.primary,
        marginBottom: 8,
        borderBottomWidth: 1,
        borderColor: Colors.border,
        width: '80%',
        textAlign: 'center',
    },
    amount: {
        fontSize: 32,
        fontWeight: '700',
    },
    amountInput: {
        fontSize: 32,
        fontWeight: '700',
        color: Colors.expense,
        borderBottomWidth: 1,
        borderColor: Colors.border,
        width: '50%',
        textAlign: 'center',
        marginBottom: 8,
    },
    detailsContainer: {
        backgroundColor: Colors.background.card,
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        ...Platform.select({
            ios: {
                shadowColor: Colors.shadow,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    detailLabel: {
        color: Colors.text.secondary,
        fontWeight: '500',
        fontSize: 15,
    },
    detailValue: {
        color: Colors.text.primary,
        fontSize: 15,
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: Colors.border,
        marginVertical: 8,
    },
    descriptionInput: {
        color: Colors.text.primary,
        fontSize: 15,
        borderBottomWidth: 1,
        borderColor: Colors.border,
        width: '100%',
        marginTop: 2,
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 8,
        backgroundColor: Colors.background.card,
        marginHorizontal: 4,
        ...Platform.select({
            ios: {
                shadowColor: Colors.shadow,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 3,
            },
            android: {
                elevation: 1,
            },
        }),
    },
    actionText: {
        fontWeight: '600',
        marginLeft: 8,
        fontSize: 16,
    },
    editButton: {},
    editText: {
        color: Colors.primary.main,
    },
    saveButton: {},
    saveText: {
        color: Colors.primary.main,
    },
    deleteButton: {
        borderWidth: 1,
        borderColor: Colors.status.error,
    },
    deleteText: {
        color: Colors.status.error,
    },
    notFoundContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
    },
    notFoundText: {
        fontSize: 18,
        color: Colors.text.secondary,
        marginBottom: 16,
    },
    backButton: {
        marginTop: 16,
    },
});