import React, { useState } from 'react';
import { TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AuthLayout from '@/components/AuthLayout';
import { register } from '@/scripts/apiService';
import { DTOs } from "@/shared/dto/dtos";
import { ThemedText } from '@/components/ThemedText';
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleRegister = async () => {
        const registrationData: DTOs.UserDTO = {
            country: 'PL',
            mail: email,
            password: password,
            username: username,
        };

        try {
            await register(registrationData);
            Alert.alert('Success', 'Registration finished successful.');
        } catch (err) {
            Alert.alert('Error', 'Registration failed, try again.');
        }
    };

    const handleBack = () => {
        router.back();
    };

    return (
        <AuthLayout>
            <ThemedText style={styles.title}>Register</ThemedText>

            <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#888"
                value={username}
                onChangeText={setUsername}
            />

            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#888"
                value={email}
                onChangeText={setEmail}
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#888"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <TouchableOpacity onPress={handleRegister} style={styles.button}>
                <ThemedText style={styles.buttonText}>Sign Up</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleBack} style={styles.button}>
                <ThemedText style={styles.buttonText}>Back</ThemedText>
            </TouchableOpacity>

        </AuthLayout>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 28,
        color: '#2ecc71',
        marginBottom: 20,
        fontWeight: 'bold',
    },
    input: {
        height: 50,
        width: 200,
        backgroundColor: '#f0f0f0',
        marginBottom: 20,
        paddingHorizontal: 15,
        borderRadius: 10,
    },
    button: {
        backgroundColor: '#2ecc71',
        padding: 15,
        paddingTop: 10,
        paddingBottom: 10,
        alignItems: 'center',
        borderRadius: 10,
        width: 100,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
    successText: {
        color: 'green',
        marginBottom: 10,
    },
});