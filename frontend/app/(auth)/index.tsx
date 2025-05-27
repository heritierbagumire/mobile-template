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
} from 'react-native';
import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Mail, Lock } from 'lucide-react-native';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/auth-store';
import { Colors } from '@/constants/Colors';

const logo = require('@/assets/images/icon.png');
export default function LoginScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{ username?: string; password?: string }>({});

    const { login, isLoading } = useAuthStore();

    const validateForm = () => {
        const newErrors: { username?: string; password?: string } = {};

        if (!username) {
            newErrors.username = 'Username is required';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async () => {
        if (!validateForm()) return;

        try {
            await login(username, password);
            router.replace('/(tabs)');
        } catch (error) {
            setErrors({ username: 'Invalid username or password' });
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
                    <Text style={styles.title}>Welcome Back</Text>
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
                        title="Sign In"
                        onPress={handleLogin}
                        isLoading={isLoading}
                        style={styles.loginButton}
                    />

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Don't have an account? </Text>
                        <Link href="/signup" asChild>
                            <TouchableOpacity>
                                <Text style={styles.signupLink}>Sign up</Text>
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
    loginButton: {
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
    signupLink: {
        color: Colors.primary.main,
        fontWeight: '600',
    },
});