import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useExpenseStore } from '@/store/transaction-store';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/Button';
import { Colors } from '@/constants/Colors';

export default function AddExpenseScreen() {
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [errors, setErrors] = useState<{ name?: string; amount?: string }>({});
    const { addExpense } = useExpenseStore();
    const { user } = useAuthStore();

    const validate = () => {
        const newErrors: { name?: string; amount?: string } = {};
        if (!name.trim() || /^\d+$/.test(name.trim())) {
            newErrors.name = 'Name must be a non-empty string and not just numbers.';
        }
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            newErrors.amount = 'Amount must be a positive number.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;
        try {
            await addExpense({
                name: name.trim(),
                amount: Number(amount).toFixed(2),
                description: description.trim(),
                username: user?.username || '',
                createdAt: new Date().toISOString(),
            });
            Alert.alert('Success', 'Expense added!');
            router.back();
        } catch (e) {
            Alert.alert('Error', 'Failed to add expense.');
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="always"
            >
                <Text style={styles.label}>Name</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Expense Name"
                    placeholderTextColor={Colors.text.light}
                    autoCapitalize="words"
                />
                {errors.name && <Text style={styles.error}>{errors.name}</Text>}

                <Text style={styles.label}>Amount</Text>
                <TextInput
                    style={styles.input}
                    value={amount}
                    onChangeText={setAmount}
                    placeholder="0.00"
                    keyboardType="decimal-pad"
                    placeholderTextColor={Colors.text.light}
                />
                {errors.amount && <Text style={styles.error}>{errors.amount}</Text>}

                <Text style={styles.label}>Description</Text>
                <TextInput
                    style={[styles.input, { height: 80 }]}
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Description (optional)"
                    placeholderTextColor={Colors.text.light}
                    multiline
                />

                <Button
                    title="Add Expense"
                    onPress={handleSave}
                    style={styles.saveButton}
                />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background.main,
    },
    scrollContent: {
        padding: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        color: Colors.text.primary,
        marginBottom: 4,
        marginTop: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: Colors.text.primary,
        marginBottom: 8,
        backgroundColor: Colors.background.card,
    },
    error: {
        color: Colors.status.error,
        marginBottom: 8,
    },
    saveButton: {
        marginTop: 24,
    },
});