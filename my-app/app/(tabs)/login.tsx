import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AuthLayout from '@/components/AuthLayout';
import { DTOs } from "@/shared/dto/dtos";
import { ThemedText } from '@/components/ThemedText';
import { useRouter } from 'expo-router';
import { login } from "@/scripts/apiService";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const validateInputs = () => {
        if (!email || !password) {
            Alert.alert('Email and password are required.');
            return false;
        }
        return true;
    };

    const handleLogin = async () => {

        if (!validateInputs()) {
            return;
        }

        const signIn: DTOs.SignInDTO = {
            mail: email,
            password: password
        };

        try {
            const response = await login(signIn);

            if (response?.status == 200) {

                await AsyncStorage.setItem('token', JSON.stringify(response.data.jwtToken));
                console.log(await AsyncStorage.getItem('token'));
                router.push('/ranking');
            } else {
                Alert.alert('Invalid credentials, please try again.');
            }
        } catch (err) {
            Alert.alert('Login failed. Please try again later.');
            console.error(err);
        }
    };

    const handleBack = () => {
        router.back();
    };

    return (
        <AuthLayout>
            <ThemedText style={styles.title}>Login</ThemedText>

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                keyboardType="email-address"
                onChangeText={(text) => setEmail(text)}
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={(text) => setPassword(text)}
            />

            <TouchableOpacity onPress={handleLogin} style={styles.button}>
                <ThemedText style={styles.buttonText}>Sign In</ThemedText>
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
        width: '100%',
        backgroundColor: '#f0f0f0',
        marginBottom: 20,
        paddingHorizontal: 15,
        borderRadius: 10,
    },
    button: {
        backgroundColor: '#2ecc71',
        padding: 15,
        alignItems: 'center',
        borderRadius: 10,
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        marginBottom: 20,
    },
});