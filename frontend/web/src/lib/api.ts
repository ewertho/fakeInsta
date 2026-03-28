import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3333/api";
export const ASSET_URL = (import.meta.env.VITE_ASSET_URL ?? "http://localhost:3333").replace(/\/$/, "");

const TOKEN_KEY = "fakeinsta_token";

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string | null) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
