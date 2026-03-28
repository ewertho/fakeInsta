import axios from "axios";

const apiUrl = process.env.EXPO_PUBLIC_API_URL ?? "http://10.0.2.2:3333/api";
export const assetUrl = (process.env.EXPO_PUBLIC_ASSET_URL ?? "http://10.0.2.2:3333").replace(/\/$/, "");

export const api = axios.create({
  baseURL: apiUrl,
});
