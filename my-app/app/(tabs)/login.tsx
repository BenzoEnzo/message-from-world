import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AuthLayout from '@/components/AuthLayout';
import {DTOs} from "@/shared/dto/dtos";
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

                await AsyncStorage.setItem('loggedUserData', JSON.stringify({
                    clientAppId: response.data.profile.clientAppId,
                    country: response.data.profile.country,
                    createdAt: response.data.profile.createdAt,
                    lastLoggedAt: response.data.profile.lastLoggedAt,
                    mail: response.data.profile.mail,
                    points: response.data.profile.points,
                    role: response.data.profile.role,
                    username: response.data.profile.username
                }));

                router.push('/');
            } else {
                Alert.alert('Invalid credentials, please try again.');
            }
        } catch (err) {
            Alert.alert('Login failed. Please try again later.');
            console.error(err);
        }
    };

    return (
        <AuthLayout>
            <ThemedText style={styles.title}>Sign-in</ThemedText>

            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#888"
                value={email}
                keyboardType="email-address"
                onChangeText={(text) => setEmail(text)}
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#888"
                secureTextEntry
                value={password}
                onChangeText={(text) => setPassword(text)}
            />

            <TouchableOpacity onPress={handleLogin} style={styles.button}>
                <ThemedText style={styles.buttonText}>Sign In</ThemedText>
            </TouchableOpacity>

        </AuthLayout>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 28,
        color: '#ffffff',
        marginBottom: 20,
        fontWeight: 'bold',
    },
    input: {
        height: 50,
        width: '80%',
        backgroundColor: '#f0f0f0',
        marginBottom: 20,
        paddingHorizontal: 15,
        borderRadius: 10,
    },
    button: {
        backgroundColor: '#2ecc71',
        padding: 15,
        width: '50%',
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