import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import AuthLayout from '@/components/AuthLayout';
import {useFocusEffect, useRouter} from 'expo-router';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  useFocusEffect(
      React.useCallback(() => {
        const fetchToken = async () => {
          try {
            const storedToken = await AsyncStorage.getItem('token');
            setToken(storedToken);
          } catch (error) {
            Alert.alert('Error', 'Failed to retrieve token.');
          }
        };

        fetchToken();
      }, [])
  );


  const handleSignIn = () => {
    router.push('/login');
  };

  const handleSignUp = () => {
    router.push('/register');
  }

  const handleRanking = () => {
    router.push('/ranking');
  };

  const handleProfile = () => {
    router.push('/profile');
  }

  const handleLogout = async () => {
    await AsyncStorage.clear();
    setToken(null);
    router.push('/');
  }

  return (
      <AuthLayout>
        <ThemedText style={styles.title}>Messages from world</ThemedText>
        {!token ? (
            <>
              <TouchableOpacity style={[styles.button, styles.signUpButton]} onPress={handleSignUp}>
                <ThemedText style={styles.buttonText}>Sign Up</ThemedText>
              </TouchableOpacity>

              <TouchableOpacity style={styles.button} onPress={handleSignIn}>
                <ThemedText style={styles.buttonText}>Sign In</ThemedText>
              </TouchableOpacity>
            </>
        ) : (<>
            <TouchableOpacity style={styles.button} onPress={handleProfile}>
              <ThemedText style={styles.buttonText}>Profile</ThemedText>
            </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <ThemedText style={styles.buttonText}>Logout</ThemedText>
      </TouchableOpacity>
            </>
        )}
        <TouchableOpacity style={styles.button} onPress={handleRanking}>
          <ThemedText style={styles.buttonText}>Ranking</ThemedText>
        </TouchableOpacity>
      </AuthLayout>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    color: '#ffffff',
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
    letterSpacing: 1.2,
  },
  button: {
    backgroundColor: '#ffffff',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 25,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  buttonText: {
    color: '#2ecc71',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signUpButton: {
    borderWidth: 2,
    borderColor: '#2ecc71',
    backgroundColor: 'transparent',
  },
});