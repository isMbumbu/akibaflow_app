import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../server/authApi';
import { API_BASE_URL } from '../server/types';
import { setAuth } from '../store';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginMutation, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const token = await loginMutation({ username, password }).unwrap();
      // After login, fetch user info
      const user = await fetch(`${API_BASE_URL}/auth/whoami`, {
        headers: {
          'Authorization': `Bearer ${token.access_token}`,
        },
      }).then(res => res.json());
      dispatch(setAuth({ user, token: token.access_token }));
      router.replace('/(tabs)');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      Alert.alert('Login Failed', message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AkibaFlow</Text>
      <Text style={styles.subtitle}>Login to your account</Text>

      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={username}
          onChangeText={setUsername}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Logging in...' : 'Login'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.link} onPress={() => router.replace('/register')}>
          <Text style={styles.linkText}>Don&apos;t have an account? Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#EAF2FF',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    color: '#6B7280',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  button: {
    backgroundColor: '#2F80ED',
    padding: 16,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    alignItems: 'center',
  },
  linkText: {
    color: '#2F80ED',
    fontSize: 16,
  },
});