import { colors } from "@/constants/colors";
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.frost,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: colors.mint,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    color: colors.plum,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    backgroundColor: colors.mist,
    borderRadius: 8,
    padding: 12,
    color: colors.plum,
    marginBottom: 12,
  },
  button: {
    backgroundColor: colors.plum,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: colors.lavender,
    fontWeight: '600',
    fontSize: 16,
  },
  error: {
    color: colors.red,
    textAlign: 'center',
    marginTop: 8,
  },
});

export default function Login() {
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setError(null);
    try {  
        await login(credentials.username, credentials.password);
        console.log("Login successful");
        router.replace('/(app)/dashboard');
    } catch (err) {
      console.log("Login failed:", err);
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <KeyboardAvoidingView 
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
    style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Login</Text>
          {error && <Text style={styles.error}>{error}</Text>}
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={credentials.username}
            onChangeText={(text) => setCredentials({ ...credentials, username: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={credentials.password}
            onChangeText={(text) => setCredentials({ ...credentials, password: text })}
          />
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

