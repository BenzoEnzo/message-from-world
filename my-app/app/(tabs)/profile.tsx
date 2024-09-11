import React, {useEffect, useState} from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import AuthLayout from "@/components/AuthLayout";
import { sendMessage, readRandomMessage } from "@/scripts/apiService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, {AxiosResponse, AxiosRequestHeaders, AxiosHeaders} from 'axios';
const { width } = Dimensions.get('window');

export default function ProfileScreen() {
    const [token, setToken] = useState<string | null>(null);
    const [content, setContent] = useState<string>('');
    const [showForm, setShowForm] = useState<boolean>(false);
    const [randomMessage, setRandomMessage] = useState<string | null>(null);
    const [loadingMessage, setLoadingMessage] = useState<boolean>(false);

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('token');
                if (storedToken) {
                    setToken(JSON.parse(storedToken));
                }
            } catch (error) {
                Alert.alert('Error', 'Failed to retrieve token.');
            }
        };

        fetchToken();
    }, []);


    const handleSendMessage = async () => {
        if (!content) {
            Alert.alert('Error', 'Message content cannot be empty.');
            return;
        }

        try {

            const messageData = { content }; // Tworzenie wiadomości
            const headers = { Authorization: `Bearer ${token}` }; // Nagłówki z tokenem
            await sendMessage(messageData, headers); // Wywołanie API
            Alert.alert('Success', 'Message sent successfully.');
            setContent(''); // Wyczyść formularz
        } catch (error) {
            Alert.alert('Error', 'Failed to send message.');
        }
    };

    // Obsługa odczytywania losowej wiadomości
    const handleReadMessage = async () => {
        setLoadingMessage(true);
        try {

            const headers: AxiosRequestHeaders = { Authorization: `Bearer ${token}` } as AxiosRequestHeaders;
            console.log(headers);
            const response = await readRandomMessage(headers);

            setRandomMessage(response.data.content);

        } catch (error) {
            Alert.alert('Error', 'Failed to load random message.');
        } finally {
            setLoadingMessage(false);
        }
    };

    return (
        <AuthLayout>
            <View style={styles.container}>
                {/* Sekcja profilu */}
                <View style={styles.profileSection}>
                    <ThemedText style={styles.profileTitle}>Welcome, User!</ThemedText>
                    <ThemedText style={styles.profileInfo}>Points: 100</ThemedText>
                    <ThemedText style={styles.profileInfo}>Country: Poland</ThemedText>
                </View>

                {/* Przyciski zarządzania wiadomościami */}
                <View style={styles.actionsContainer}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => setShowForm(!showForm)}
                    >
                        <ThemedText style={styles.actionText}>
                            {showForm ? 'Close Message Form' : 'Create New Message'}
                        </ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={handleReadMessage}
                    >
                        <ThemedText style={styles.actionText}>Read Random Message</ThemedText>
                    </TouchableOpacity>
                </View>

                {/* Formularz do tworzenia wiadomości */}
                {showForm && (
                    <View style={styles.formContainer}>
                        <TextInput
                            style={styles.input}
                            value={content}
                            onChangeText={setContent}
                            placeholder="Write your message..."
                            multiline
                            numberOfLines={4}
                        />
                        <TouchableOpacity onPress={handleSendMessage} style={styles.button}>
                            <ThemedText style={styles.buttonText}>Send Message</ThemedText>
                        </TouchableOpacity>
                    </View>
                )}


                {randomMessage && (
                    <View style={styles.messageBox}>
                        <ThemedText style={styles.subtitle}>Random Message:</ThemedText>
                        <ThemedText style={styles.messageContent}>{randomMessage}</ThemedText>
                    </View>
                )}

                {loadingMessage && <ThemedText style={styles.loadingText}>Loading message...</ThemedText>}
            </View>
        </AuthLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: width,
        padding: 20,
        justifyContent: 'center',
    },
    profileSection: {
        marginBottom: 20,
        backgroundColor: '#ffffff',
        padding: 20,
        borderRadius: 10,
        elevation: 2,
        alignItems: 'center',
    },
    profileTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    profileInfo: {
        fontSize: 18,
        marginBottom: 5,
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    actionButton: {
        backgroundColor: '#2ecc71',
        padding: 15,
        borderRadius: 10,
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    actionText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
    formContainer: {
        marginBottom: 20,
        backgroundColor: '#ffffff',
        padding: 20,
        borderRadius: 10,
        elevation: 2,
    },
    input: {
        height: 100,
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#2ecc71',
        padding: 15,
        alignItems: 'center',
        borderRadius: 10,
    },
    buttonText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
    messageBox: {
        backgroundColor: '#ffffff',
        padding: 20,
        borderRadius: 10,
        elevation: 2,
        marginTop: 20,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    messageContent: {
        fontSize: 16,
        color: '#333',
    },
    loadingText: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
        marginTop: 10,
    },
});