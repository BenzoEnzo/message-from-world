import React, {useEffect, useState} from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import AuthLayout from "@/components/AuthLayout";
import { sendMessage, readRandomMessage } from "@/scripts/apiService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, {AxiosResponse, AxiosRequestHeaders, AxiosHeaders} from 'axios';
const { width } = Dimensions.get('window');
import { honorUser } from "@/scripts/apiService";
import { DTOs } from "@/shared/dto/dtos";
import { Keyboard, TouchableWithoutFeedback } from 'react-native';
import UserDTO = DTOs.UserDTO;
import MessageDTO = DTOs.MessageDTO;

export default function ProfileScreen() {
    const [token, setToken] = useState<string | null>(null);
    const [loggedUserData, setLoggedUserData] = useState<UserDTO>();
    const [content, setContent] = useState<string>('');
    const [activeFunctionality, setActiveFunctionality] = useState<'send' | 'read' | null>(null);
    const [showForm, setShowForm] = useState<boolean>(false);
    const [randomMessage, setRandomMessage] = useState<string | null>(null);
    const [loadingMessage, setLoadingMessage] = useState<boolean>(false);
    const [messageAuthorClientAppId, setMessageAuthorClientAppId] = useState<string | null>(null);

    useEffect(() => {
        const fetchStoredData = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('token');
                if (storedToken) {
                    setToken(JSON.parse(storedToken));
                    const authorizedUser = await AsyncStorage.getItem('loggedUserData');
                    if (authorizedUser != null) {
                        setLoggedUserData(JSON.parse(authorizedUser) as UserDTO);
                    }
                }
            } catch (error) {
                Alert.alert('Error', 'Failed to retrieve token.');
            }
        };

        fetchStoredData();
    }, [loggedUserData]);


    const handleSendMessage = async () => {
        if (!content) {
            Alert.alert('Error', 'Message content cannot be empty.');
            return;
        }

        try {

            const messageData: DTOs.MessageDTO = { content: content,
                metadata: {
                    deviceName: '',
                    ipAddress: ''
                },
                profile: loggedUserData
            };
            const headers: AxiosRequestHeaders = { Authorization: `Bearer ${token}` } as AxiosRequestHeaders;
            await sendMessage(messageData, headers);

            if (loggedUserData?.points) {
                const updatedPoints = loggedUserData.points - 1;
                const updatedUserData = {
                    ...loggedUserData,
                    points: updatedPoints
                };
                setLoggedUserData(updatedUserData);
                await AsyncStorage.setItem('loggedUserData', JSON.stringify(updatedUserData));
            }

                Alert.alert('Success', 'Message sent successfully.');
            setContent('');
        } catch (error) {
            Alert.alert('Error', 'Failed to send message.');
        }
    };


    const handleReadMessage = async () => {
        setLoadingMessage(true);
        try {

            const headers: AxiosRequestHeaders = { Authorization: `Bearer ${token}` } as AxiosRequestHeaders;

            const response = await readRandomMessage(headers);

            if(response.data.profile?.clientAppId){
                const clientAppId = response.data.profile.clientAppId;
                setRandomMessage(response.data.content);
                setMessageAuthorClientAppId(clientAppId);
            }

        } catch (error) {
            Alert.alert('Error', 'Failed to load random message.');
        } finally {
            setLoadingMessage(false);
        }
    };

    const handleHonorForAuthor = async () => {
        if (!messageAuthorClientAppId) {
            Alert.alert('Error', 'No author found to honor.');
            return;
        }

        try {
            console.log('Rewarding user id:', messageAuthorClientAppId);

            const headers: AxiosRequestHeaders = { Authorization: `Bearer ${token}` } as AxiosRequestHeaders;

            await honorUser(messageAuthorClientAppId, headers);

            Alert.alert('Success', 'Thank you for supporting another user.');

            setMessageAuthorClientAppId(null);

            setRandomMessage(null);

        } catch (error) {
            console.error('Failed to reward the user:', error);
            Alert.alert('Error', 'Failed to honor the user.');
        }

    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <AuthLayout>
            <View style={styles.container}>
                {/* Profile Section */}
                <View style={styles.profileSection}>
                    <ThemedText style={styles.profileTitle}>Welcome: {loggedUserData?.username}</ThemedText>
                    <ThemedText style={styles.profileInfo}>Points: {loggedUserData?.points}</ThemedText>
                    <ThemedText style={styles.profileInfo}>Country: {loggedUserData?.country}</ThemedText>
                    <ThemedText style={styles.profileInfo}>Rank: {loggedUserData?.role}</ThemedText>
                </View>

                {/* Actions Section */}
                <View style={styles.actionsWrapper}>
                    <ThemedText style={styles.actionsTitle}>Actions</ThemedText>
                    <View style={styles.actionsContainer}>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => setActiveFunctionality('send')}
                        >
                            <ThemedText style={styles.actionText}>
                                Create Message
                            </ThemedText>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => setActiveFunctionality('read')}
                        >
                            <ThemedText style={styles.actionText}>Read Message</ThemedText>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Conditional Render: Show either the form or the random message */}
                {activeFunctionality === 'send' && (
                    <View style={styles.formContainer}>
                        <TextInput
                            style={styles.input}
                            value={content}
                            onChangeText={setContent}
                            placeholder="Write your message..."
                            multiline
                            numberOfLines={9}
                            onSubmitEditing={() => Keyboard.dismiss()}
                            blurOnSubmit={true}
                        />
                        <TouchableOpacity onPress={handleSendMessage} style={styles.button}>
                            <ThemedText style={styles.buttonText}>Send Message</ThemedText>
                        </TouchableOpacity>
                    </View>
                )}

                {activeFunctionality === 'read' && (
                    <View style={styles.messageContainer}>
                        {randomMessage && (<>
                            <View style={styles.messageBox}>
                                <ThemedText style={styles.messageContent}>{randomMessage}</ThemedText>
                            </View>
                            {!loadingMessage && <>
                                <TouchableOpacity onPress={handleHonorForAuthor} style={styles.buttonHonor}>
                                    <ThemedText style={styles.buttonTextHonor}>
                                        {'Reward for the message'}
                                    </ThemedText>
                                </TouchableOpacity>
                            </>}
                    </>

                        )}
                        <TouchableOpacity onPress={handleReadMessage} style={styles.button}>
                            <ThemedText style={styles.buttonText}>
                                {loadingMessage ? 'Loading...' : 'Draw random'}
                            </ThemedText>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </AuthLayout>
        </TouchableWithoutFeedback>
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
        marginTop: 0,
        marginBottom: 20,
        backgroundColor: '#ffffff',
        padding: 20,
        borderRadius: 10,
        height: '20%',
        elevation: 2,
        alignItems: 'center',
    },
    profileTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2ecc71',
        marginBottom: 10,
    },
    profileInfo: {
        fontSize: 18,
        color: '#2ecc71',
        marginBottom: 5,
        marginLeft: 0
    },
    actionsWrapper: {
        borderColor: '#f1c40f',
        borderWidth: 2,
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
        backgroundColor: 'transparent',
    },
    actionsTitle: {
        color: '#f1c40f',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
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
        backgroundColor: 'transparent',
        padding: 20,
        borderRadius: 10,
        height: '55%',
        elevation: 2,
        marginBottom: 5,
    },
    input: {
        height: '80%',
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#2ecc71',
        padding: 15,
        alignItems: 'center',
        marginTop: 10,
        borderRadius: 10,
    },
    buttonText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
    buttonHonor: {
        backgroundColor: '#ffffff',
        borderColor: '#f1c40f',
        borderWidth: 2,
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
    },
    buttonTextHonor: {
        color: '#f1c40f',
        fontWeight: 'bold',
    },
    messageContainer: {
        backgroundColor: 'transparent',
        padding: 20,
        height: '40%',
        borderRadius: 10,
        elevation: 2,
        marginBottom: 20,
    },
    messageBox: {
        backgroundColor: '#ffffff',
        padding: 20,
        height: '80%',
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
});