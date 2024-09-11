import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { getAllUsers } from '@/scripts/apiService';
import { ThemedText } from '@/components/ThemedText';
import AuthLayout from '@/components/AuthLayout';
import { DTOs } from "@/shared/dto/dtos";
import UserDTO = DTOs.UserDTO;

const { width, height } = Dimensions.get('window');

export default function RankingScreen() {
    const [users, setUsers] = useState<UserDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getAllUsers();
                setUsers(response.data);
            } catch (err) {
                setError('Failed to load users.');
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    if (loading) {
        return (
            <AuthLayout>
                <View style={styles.centeredView}>
                    <ActivityIndicator size="large" color="#2ecc71" />
                </View>
            </AuthLayout>
        );
    }

    if (error) {
        return (
            <AuthLayout>
                <View style={styles.centeredView}>
                    <ThemedText style={styles.error}>{error}</ThemedText>
                </View>
            </AuthLayout>
        );
    }

    // @ts-ignore
    return (
        <AuthLayout>
            <View style={styles.centeredView}>
                <ThemedText style={styles.title}>User Ranking</ThemedText>
                <FlatList
                    data={users.sort((a:any, b:any) => b.points - a.points)}
                    keyExtractor={(item:any) => item.id.toString()}
                    contentContainerStyle={styles.listContainer}
                    renderItem={({ item, index }) => (
                        <View style={styles.row}>
                            <Text style={styles.rank}>{index + 1}</Text>
                            <Text style={styles.username} numberOfLines={1}>{item.username}</Text>
                            <Text style={styles.points}>{item.points}</Text>
                        </View>
                    )}
                    ListHeaderComponent={
                        <View style={styles.header}>
                            <Text style={styles.headerText}>Rank</Text>
                            <Text style={styles.headerText}>Username</Text>
                            <Text style={styles.headerText}>Points</Text>
                        </View>
                    }
                />
            </View>
        </AuthLayout>
    );
}

const styles = StyleSheet.create({
    title: {
        paddingTop: 100,
        fontSize: 28,
        color: '#ffffff',
        marginBottom: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 4,
        letterSpacing: 1.2,
    },
    header: {
        flexDirection: 'row',
        width: width - 100,
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: width * 0.05,
        backgroundColor: '#2ecc71',
        borderRadius: 10,
    },
    headerText: {
        color: '#ffffff',
        paddingLeft: 2,
        fontSize: 16,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center'
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: width * 0.05,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2
    },
    rank: {
        fontSize: 16,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center'
    },
    username: {
        fontSize: 16,
        flex: 1,
        textAlign: 'center',
        color: '#333',
        flexWrap: 'wrap'
    },
    points: {
        fontSize: 16,
        flex: 1,
        textAlign: 'center',
        color: '#2ecc71',
    },
    error: {
        color: 'red',
        textAlign: 'center',
        fontSize: 16,
        marginTop: 20,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 20,
    },
    listContainer: {
        paddingBottom: 20,
    },
});