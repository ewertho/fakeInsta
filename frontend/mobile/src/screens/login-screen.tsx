import axios from "axios";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useAuth } from "../lib/auth-context";
import { apiUrl } from "../lib/api";

export function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("alice@demo.com");
  const [password, setPassword] = useState("demo1234");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    setError(null);
    setLoading(true);
    try {
      await signIn(email, password);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (!err.response) {
          setError(
            `Sem conexão com a API (${apiUrl}). Mesma rede Wi‑Fi? Firewall liberando a porta 3333?`,
          );
          return;
        }
        if (err.response.status === 400) {
          setError("E-mail ou senha inválidos.");
          return;
        }
      }
      setError("Não foi possível entrar. Tente de novo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.logo}>FakeInsta</Text>
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#737373"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#737373"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Pressable style={styles.button} onPress={onSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Entrar</Text>}
        </Pressable>
        <Text style={styles.hint}>Demo: alice@demo.com / demo1234</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  card: {
    borderWidth: 1,
    borderColor: "#262626",
    borderRadius: 12,
    padding: 24,
  },
  logo: {
    fontSize: 36,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: "#262626",
    borderRadius: 6,
    backgroundColor: "#121212",
    color: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 10,
    fontSize: 14,
  },
  button: {
    backgroundColor: "#0095f6",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  error: {
    color: "#ed4956",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 8,
  },
  hint: {
    marginTop: 16,
    fontSize: 12,
    color: "#737373",
    textAlign: "center",
  },
});
