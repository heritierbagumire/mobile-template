import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
} from 'react-native';
import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Mail, Lock } from 'lucide-react-native';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/auth-store';
import { Colors } from '@/constants/Colors'; 
import axios from 'axios';

const logo = require('@/assets/images/icon.png');
export default function SignupScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
    const { login, isLoading } = useAuthStore();

    const validateForm = () => {
        const newErrors: { username?: string; password?: string } = {};
        if (!username) {
            newErrors.username = 'Username is required';
        } else if (username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }
        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSignup = async () => {
        if (!validateForm()) return;
        try {
            // Check if username already exists
            const check = await axios.get(`https://67ac71475853dfff53dab929.mockapi.io/api/v1/users?username=${username}`);
            if (check.data && check.data.length > 0) {
                setErrors({ username: 'Username already exists' });
                return;
            }
            // Create user
            await axios.post('https://67ac71475853dfff53dab929.mockapi.io/api/v1/users', {
                username,
                password,
                createdAt: new Date().toISOString(),
            });
            // Log in the user
            await login(username, password);
            router.replace('/(tabs)');
        } catch (error) {
            Alert.alert('Signup error', 'Failed to create account.');
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
            <StatusBar style="dark" />
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.header}>
                    <Image
                        source={logo}
                        style={styles.logo}
                    />
                    <Text style={styles.title}>Create Account</Text>
                </View>
                <View style={styles.form}>
                    <Input
                        label="Username"
                        placeholder="Enter username"
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                        leftIcon={<Mail size={20} color={Colors.text.secondary} />}
                        error={errors.username}
                    />
                    <Input
                        label="Password"
                        placeholder="Enter password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        leftIcon={<Lock size={20} color={Colors.text.secondary} />}
                        error={errors.password}
                    />
                    <Button
                        title="Sign Up"
                        onPress={handleSignup}
                        isLoading={isLoading}
                        style={styles.signupButton}
                    />
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account? </Text>
                        <Link href="/" asChild>
                            <TouchableOpacity>
                                <Text style={styles.loginLink}>Sign in</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                </View>
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
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: Colors.text.primary,
    },
    form: {
        width: '100%',
    },
    signupButton: {
        marginTop: 24,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    footerText: {
        color: Colors.text.secondary,
    },
    loginLink: {
        color: Colors.primary.main,
        fontWeight: '600',
    },
});