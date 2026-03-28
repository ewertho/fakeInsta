import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { Platform } from "react-native";

const API_PORT = 3333;

function stripTrailingSlash(url: string) {
  return url.replace(/\/$/, "");
}

/**
 * Origem do backend (sem /api): mesma máquina que o Metro em dev.
 * No celular físico com Expo Go, `debuggerHost` traz o IP do PC na rede (ex.: 192.168.x.x).
 */
function resolveOrigin(): string {
  const assetEnv = process.env.EXPO_PUBLIC_ASSET_URL;
  if (assetEnv) {
    return stripTrailingSlash(assetEnv);
  }

  const apiEnv = process.env.EXPO_PUBLIC_API_URL;
  if (apiEnv) {
    return stripTrailingSlash(apiEnv).replace(/\/api$/, "");
  }

  const debuggerHost = Constants.expoGoConfig?.debuggerHost;
  if (typeof debuggerHost === "string" && debuggerHost.length > 0) {
    const host = debuggerHost.split(":")[0];
    if (host) {
      return `http://${host}:${API_PORT}`;
    }
  }

  const hostUri = Constants.expoConfig?.hostUri;
  if (typeof hostUri === "string" && hostUri.length > 0) {
    const host = hostUri.split(":")[0];
    if (host) {
      return `http://${host}:${API_PORT}`;
    }
  }

  if (Platform.OS === "android") {
    return `http://10.0.2.2:${API_PORT}`;
  }

  return `http://localhost:${API_PORT}`;
}

const origin = resolveOrigin();
export const assetUrl = origin;
export const socketUrl = origin;

export const apiUrl = `${origin}/api`;

const TOKEN_KEY = "fakeinsta_token";

export async function getStoredToken() {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function setStoredToken(token: string | null) {
  if (token) {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } else {
    await AsyncStorage.removeItem(TOKEN_KEY);
  }
}

export const api = axios.create({
  baseURL: apiUrl,
  timeout: 15_000,
});

api.interceptors.request.use(async (config) => {
  const token = await getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
