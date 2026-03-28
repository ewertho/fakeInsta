import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3333/api";
export const ASSET_URL = (import.meta.env.VITE_ASSET_URL ?? "http://localhost:3333").replace(/\/$/, "");

export const api = axios.create({
  baseURL: API_URL,
});
